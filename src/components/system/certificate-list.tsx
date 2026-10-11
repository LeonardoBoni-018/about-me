"use client"

import { useState } from "react"
import type { CourseArea } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface CertificateRow {
  key: string
  title: string
  provider: string
  /** Mês já formatado no idioma da página (o servidor formata). */
  month: string
  hours?: number
  area: CourseArea
}

interface CertificateListProps {
  rows: CertificateRow[]
  areas: { id: CourseArea; label: string; count: number }[]
  labels: { all: string; filter: string }
}

/** Todos os certificados, filtráveis por área. As linhas chegam prontas do servidor. */
export function CertificateList({ rows, areas, labels }: CertificateListProps) {
  const [area, setArea] = useState<CourseArea | null>(null)
  const visible = area ? rows.filter((row) => row.area === area) : rows
  const areaLabel = Object.fromEntries(areas.map((a) => [a.id, a.label]))

  const chip = (id: CourseArea | null, label: string, count: number) => (
    <button
      key={id ?? "all"}
      type="button"
      aria-pressed={area === id}
      onClick={() => setArea(id)}
      className={cn(
        "rounded-md border px-2.5 py-1 transition-colors",
        area === id
          ? "border-primary bg-primary/10 text-foreground"
          : "text-muted-foreground hover:border-ink/60 hover:text-foreground"
      )}
    >
      {label} <span className="text-muted-foreground">{count}</span>
    </button>
  )

  return (
    <div>
      <div
        role="group"
        aria-label={labels.filter}
        className="flex flex-wrap gap-2 font-mono text-xs"
      >
        {chip(null, labels.all, rows.length)}
        {areas.map((a) => chip(a.id, a.label, a.count))}
      </div>
      <ul className="mt-4" aria-live="polite">
        {visible.map((row) => (
          <li
            key={row.key}
            className="grid gap-x-4 gap-y-0.5 border-b border-dashed py-3 font-mono text-sm sm:grid-cols-[7rem_1fr_auto]"
          >
            <span className="text-xs text-muted-foreground">{row.month}</span>
            <span className="font-sans text-foreground">
              {row.title}
              <span className="text-muted-foreground"> · {row.provider}</span>
            </span>
            <span className="flex gap-3 text-xs">
              <span className="text-ink">{areaLabel[row.area]}</span>
              {row.hours && <span className="text-success">{row.hours}h</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
