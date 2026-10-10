"use client"

import { useSyncExternalStore } from "react"
import { THEME_STORAGE_KEY } from "./theme-script"

export type Theme = "light" | "dark"

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getServerSnapshot(): Theme {
  return "light"
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Tema efetivo: o salvo pelo visitante ou, sem escolha salva, o do sistema. */
export function resolveTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch {
    // localStorage indisponível: cai para a preferência do sistema
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** Reaplica o tema efetivo no <html> (sem persistir nada). */
export function applyResolvedTheme() {
  document.documentElement.classList.toggle("dark", resolveTheme() === "dark")
}

/**
 * Aplica e persiste o tema. Com `origin`, anima a troca com um círculo que se
 * expande a partir desse ponto (View Transitions API), quando suportado.
 */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  const update = () => {
    root.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // localStorage indisponível (modo privado, bloqueio de cookies…)
    }
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!origin || reduceMotion || !document.startViewTransition) {
    update()
    return
  }

  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(update)
  transition.ready.then(() => {
    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 550,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  })
}
