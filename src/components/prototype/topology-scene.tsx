"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import type { Topology } from "@/lib/topology"
import { cn } from "@/lib/utils"

interface TopologySceneProps {
  topology: Topology
  /** Projetos que podem ser destacados (o caminho deles acende no grafo). */
  paths: { slug: string; title: string }[]
  label: string
  caption: string
}

/**
 * Grafo 3D dos componentes de todos os projetos (Three.js). Nós = componentes reais da
 * arquitetura; arestas = saltos de requisição; pacotes = requisições percorrendo os saltos.
 * Escolher um projeto acende o caminho dele. Movimento reduzido: cena estática, sem pacotes
 * andando e sem rotação automática (arrastar continua funcionando).
 */
export function TopologyScene({ topology, paths, label, caption }: TopologySceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const mount = mountRef.current
    const labelLayer = labelsRef.current
    if (!mount || !labelLayer) return

    let disposed = false
    let cleanup = () => {}

    // Three.js só é baixado no cliente, depois da primeira pintura: não pesa no LCP.
    import("three").then((THREE) => {
      if (disposed) return

      const css = getComputedStyle(mount)
      const color = (name: string) => new THREE.Color(css.getPropertyValue(name).trim())
      const palette = {
        ink: color("--p-ink"),
        dim: color("--p-dim"),
        rule: color("--p-rule"),
        signal: color("--p-signal"),
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      mount.appendChild(renderer.domElement)
      renderer.domElement.style.display = "block"

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
      camera.position.set(0, 0, 9)
      const world = new THREE.Group()
      world.rotation.x = 0.35
      scene.add(world)

      // Nós distribuídos numa esfera (espiral de Fibonacci). Os vagas são embaralhadas pela razão
      // áurea para que os componentes mais usados (que vêm primeiro) não se amontoem num polo.
      const radius = 2.6
      const positions = new Map<string, InstanceType<typeof THREE.Vector3>>()
      const n = topology.nodes.length
      const slots = Array.from({ length: n }, (_, i) => i).sort(
        (a, b) => ((a * 0.618034) % 1) - ((b * 0.618034) % 1)
      )
      topology.nodes.forEach((node, i) => {
        const slot = slots[i]
        const y = 1 - (slot / Math.max(n - 1, 1)) * 2
        const r = Math.sqrt(1 - y * y)
        const theta = Math.PI * (3 - Math.sqrt(5)) * slot
        positions.set(
          node.id,
          new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(
            radius
          )
        )
      })

      // Esfera-guia em arame bem fraco: a "prancheta" onde o grafo está desenhado.
      const guide = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.SphereGeometry(radius, 18, 12)),
        new THREE.LineBasicMaterial({
          color: palette.rule,
          transparent: true,
          opacity: 0.55,
        })
      )
      world.add(guide)

      const nodeGeometry = new THREE.IcosahedronGeometry(1, 1)
      const nodeMeshes = topology.nodes.map((node) => {
        const material = new THREE.MeshBasicMaterial({ color: palette.ink })
        const mesh = new THREE.Mesh(nodeGeometry, material)
        const size = 0.045 + Math.min(node.projects.length, 5) * 0.016
        mesh.scale.setScalar(size)
        mesh.position.copy(positions.get(node.id)!)
        world.add(mesh)
        return { node, mesh, material }
      })

      // Arestas como arcos que saem da superfície (bezier quadrática empurrada para fora).
      const edgeCurves = topology.edges.map((edge) => {
        const a = positions.get(edge.from)!
        const b = positions.get(edge.to)!
        const mid = a.clone().add(b).multiplyScalar(0.5)
        const lift = mid.length() < 0.01 ? 1 : (radius * 1.25) / mid.length()
        const curve = new THREE.QuadraticBezierCurve3(a, mid.multiplyScalar(lift), b)
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(32))
        const material = new THREE.LineBasicMaterial({
          color: palette.dim,
          transparent: true,
          opacity: 0.7,
        })
        const line = new THREE.Line(geometry, material)
        world.add(line)
        return { edge, curve, material, geometry }
      })

      // Pacotes: um por projeto que usa a aresta, cada um com sua fase.
      const packetGeometry = new THREE.SphereGeometry(0.045, 8, 8)
      const packetMaterial = new THREE.MeshBasicMaterial({ color: palette.signal })
      const packets = edgeCurves.flatMap(({ edge, curve }, i) =>
        Array.from({ length: edge.weight }, (_, k) => {
          const mesh = new THREE.Mesh(packetGeometry, packetMaterial)
          world.add(mesh)
          return { mesh, curve, edge, phase: (i * 0.37 + k / edge.weight) % 1 }
        })
      )

      // Rótulos HTML projetados (texto nítido e legível por leitor de tela fica no <ul> abaixo).
      const labelEls = topology.nodes.map((node) => {
        const el = document.createElement("span")
        el.textContent = node.label
        el.className =
          "pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[11px] leading-none will-change-transform"
        labelLayer.appendChild(el)
        return el
      })

      // Arrastar para girar (mouse, caneta e toque). Sem zoom: a roda continua rolando a página.
      let dragging = false
      let lastX = 0
      let lastY = 0
      let velocity = reduced ? 0 : 0.0016
      const onDown = (e: PointerEvent) => {
        dragging = true
        lastX = e.clientX
        lastY = e.clientY
        renderer.domElement.setPointerCapture(e.pointerId)
      }
      const onMove = (e: PointerEvent) => {
        if (!dragging) return
        world.rotation.y += (e.clientX - lastX) * 0.006
        world.rotation.x = Math.max(
          -1.1,
          Math.min(1.1, world.rotation.x + (e.clientY - lastY) * 0.004)
        )
        lastX = e.clientX
        lastY = e.clientY
        requestRender()
      }
      const onUp = () => {
        dragging = false
      }
      renderer.domElement.addEventListener("pointerdown", onDown)
      renderer.domElement.addEventListener("pointermove", onMove)
      renderer.domElement.addEventListener("pointerup", onUp)
      renderer.domElement.addEventListener("pointercancel", onUp)
      renderer.domElement.style.touchAction = "pan-y"
      renderer.domElement.style.cursor = "grab"

      const size = { w: 1, h: 1 }
      const resize = () => {
        size.w = mount.clientWidth
        size.h = mount.clientHeight
        renderer.setSize(size.w, size.h, false)
        renderer.domElement.style.width = "100%"
        renderer.domElement.style.height = "100%"
        camera.aspect = size.w / Math.max(size.h, 1)
        // Em telas estreitas a câmera recua para a esfera inteira caber.
        camera.position.z = camera.aspect < 0.9 ? 12 : 10
        camera.updateProjectionMatrix()
        requestRender()
      }
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(mount)

      const tmp = new THREE.Vector3()
      let lastActive: string | null = "∅"
      const paint = () => {
        const current = activeRef.current
        if (current === lastActive) return
        lastActive = current
        for (const { node, material } of nodeMeshes) {
          const on = current ? node.projects.includes(current) : false
          material.color.copy(on ? palette.signal : current ? palette.dim : palette.ink)
        }
        for (const { edge, material } of edgeCurves) {
          const fromOn = nodeMeshes.find((m) => m.node.id === edge.from)!.node.projects
          const toOn = nodeMeshes.find((m) => m.node.id === edge.to)!.node.projects
          const on = current ? fromOn.includes(current) && toOn.includes(current) : false
          material.color.copy(on ? palette.signal : palette.dim)
          material.opacity = current ? (on ? 1 : 0.18) : 0.7
        }
      }

      let visible = true
      let frame = 0
      let needsRender = true
      function requestRender() {
        needsRender = true
      }

      const tick = (time: number) => {
        frame = requestAnimationFrame(tick)
        if (!visible) return
        const animate = !reduced
        if (!animate && !needsRender && lastActive === activeRef.current) return
        needsRender = false

        if (!dragging && animate) world.rotation.y += velocity
        paint()

        const t = animate ? time / 1000 : 0
        for (const p of packets) {
          const on = activeRef.current
            ? nodeMeshes
                .find((m) => m.node.id === p.edge.from)!
                .node.projects.includes(activeRef.current) &&
              nodeMeshes
                .find((m) => m.node.id === p.edge.to)!
                .node.projects.includes(activeRef.current)
            : true
          p.mesh.visible = on
          p.curve.getPoint((p.phase + t * 0.18) % 1, p.mesh.position)
        }

        renderer.render(scene, camera)

        // Rótulos acompanham os nós; os que estão "atrás" da esfera somem.
        world.updateMatrixWorld()
        nodeMeshes.forEach(({ node, mesh }, i) => {
          tmp.copy(mesh.position).applyMatrix4(world.matrixWorld)
          const depth = tmp.z
          tmp.project(camera)
          const x = (tmp.x * 0.5 + 0.5) * size.w
          const y = (-tmp.y * 0.5 + 0.5) * size.h
          const el = labelEls[i]
          const current = activeRef.current
          const on = current ? node.projects.includes(current) : false
          const front = depth > -0.4
          el.style.transform = `translate(${x + 8}px, ${y - 5}px)`
          el.style.opacity = current ? (on ? "1" : "0.15") : front ? "0.9" : "0.2"
          el.style.color = on ? "var(--p-signal)" : "var(--p-ink)"
        })
      }
      frame = requestAnimationFrame(tick)

      // Fora da tela, o laço continua agendado mas não desenha nada.
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) requestRender()
      })
      io.observe(mount)

      // Troca de tema: relê as cores dos tokens.
      const themeObserver = new MutationObserver(() => {
        const next = getComputedStyle(mount)
        const read = (name: string) => next.getPropertyValue(name).trim()
        palette.ink.set(read("--p-ink"))
        palette.dim.set(read("--p-dim"))
        palette.rule.set(read("--p-rule"))
        palette.signal.set(read("--p-signal"))
        ;(guide.material as InstanceType<typeof THREE.LineBasicMaterial>).color.copy(
          palette.rule
        )
        packetMaterial.color.copy(palette.signal)
        lastActive = "∅"
        requestRender()
      })
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })

      cleanup = () => {
        cancelAnimationFrame(frame)
        velocity = 0
        resizeObserver.disconnect()
        io.disconnect()
        themeObserver.disconnect()
        labelEls.forEach((el) => el.remove())
        nodeGeometry.dispose()
        packetGeometry.dispose()
        packetMaterial.dispose()
        nodeMeshes.forEach(({ material }) => material.dispose())
        edgeCurves.forEach(({ material, geometry }) => {
          material.dispose()
          geometry.dispose()
        })
        guide.geometry.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [topology, reduced])

  return (
    <figure className="flex h-full flex-col">
      <div
        className="relative min-h-[340px] flex-1 overflow-hidden"
        role="img"
        aria-label={label}
      >
        <div ref={mountRef} className="absolute inset-0" />
        <div ref={labelsRef} aria-hidden="true" className="absolute inset-0" />
      </div>
      <figcaption className="mt-4 max-w-md text-sm text-[var(--p-dim)]">
        {caption}
      </figcaption>
      <div className="mt-4 flex flex-wrap gap-x-1 gap-y-2">
        {paths.map((path) => {
          const on = active === path.slug
          return (
            <button
              key={path.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(on ? null : path.slug)}
              onMouseEnter={() => setActive(path.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(path.slug)}
              onBlur={() => setActive(null)}
              className={cn(
                "border px-2.5 py-1 text-xs transition-colors",
                on
                  ? "border-[var(--p-signal)] bg-[var(--p-signal)] text-[var(--p-signal-ink)]"
                  : "border-[var(--p-rule)] hover:border-[var(--p-ink)]"
              )}
            >
              {path.title}
            </button>
          )
        })}
      </div>
      {/* Versão textual do grafo, para leitores de tela */}
      <ul className="sr-only">
        {topology.nodes.map((node) => (
          <li key={node.id}>
            {node.label}: {node.projects.length}
          </li>
        ))}
      </ul>
    </figure>
  )
}
