import { cn } from "@/lib/utils"

interface HandNoteProps {
  children: React.ReactNode
  /** Para onde a seta aponta, a partir do texto. */
  direction?: "down-right" | "down-left" | "right"
  className?: string
}

const arrowTransform: Record<NonNullable<HandNoteProps["direction"]>, string> = {
  "down-right": "",
  "down-left": "-scale-x-100",
  right: "-rotate-45",
}

/** Anotação manuscrita com uma seta desenhada, para comentar um elemento vizinho. */
export function HandNote({
  children,
  direction = "down-right",
  className,
}: HandNoteProps) {
  return (
    <span
      className={cn(
        "z-10 inline-flex -rotate-3 items-start gap-1 font-hand text-2xl leading-none text-primary",
        className
      )}
    >
      <span className="pt-1">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 60 60"
        className={cn("mt-3 size-12 shrink-0", arrowTransform[direction])}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 8 C 22 6, 40 16, 46 44" />
        <path d="M36 38 L 46 46 L 52 34" />
      </svg>
    </span>
  )
}
