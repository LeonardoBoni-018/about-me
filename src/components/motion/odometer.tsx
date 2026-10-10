"use client"

import { useRef } from "react"
import { useInView } from "motion/react"
import * as m from "motion/react-m"

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

interface OdometerProps {
  value: number
  suffix?: string
  className?: string
}

/** Número em estilo odômetro: cada dígito "rola" até o valor quando entra na viewport. */
export function Odometer({ value, suffix = "", className }: OdometerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const digits = String(value).split("")

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true" className="inline-flex tabular-nums">
        {digits.map((digit, i) => (
          <span
            key={i}
            className="relative inline-block h-[1em] overflow-hidden leading-none"
          >
            <m.span
              className="flex flex-col"
              initial={{ y: "0%" }}
              animate={{ y: inView ? `-${Number(digit) * 10}%` : "0%" }}
              transition={{ duration: 1.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="h-[1em]">
                  {d}
                </span>
              ))}
            </m.span>
          </span>
        ))}
        {suffix}
      </span>
    </span>
  )
}
