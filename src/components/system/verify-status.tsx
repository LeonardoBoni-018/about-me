"use client"

import { useRef } from "react"
import { useInView } from "motion/react"
import { useHydrated } from "@/hooks/use-hydrated"

interface VerifyStatusProps {
  pending: string
  valid: string
  /** Posição na grade: escalona a verificação, um certificado depois do outro. */
  index: number
}

/**
 * Status de um certificado como numa verificação TLS: "verificando…" até entrar na tela,
 * depois "válido". Antes da hidratação já aparece válido (o estado real). Decorativo para
 * leitores de tela — o conteúdo do cartão já diz tudo.
 */
export function VerifyStatus({ pending, valid, index }: VerifyStatusProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const waiting = useHydrated() && !inView

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="verify-status grid font-mono text-[11px]"
      data-pending={waiting || undefined}
      style={{ "--verify-delay": `${300 + index * 160}ms` } as React.CSSProperties}
    >
      <span className="verify-pending col-start-1 row-start-1 text-muted-foreground">
        {pending}
      </span>
      <span className="verify-valid col-start-1 row-start-1 text-success">{valid}</span>
    </span>
  )
}
