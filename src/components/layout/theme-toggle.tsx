"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { setTheme } from "@/lib/theme"

export function ThemeToggle({ label }: { label: string }) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const isDark = document.documentElement.classList.contains("dark")
    const rect = event.currentTarget.getBoundingClientRect()
    setTheme(isDark ? "light" : "dark", {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  // Os dois ícones são renderizados e o CSS (`dark:`) decide qual aparece,
  // então o servidor e o cliente geram o mesmo HTML.
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <Sun className="scale-100 rotate-0 transition-transform duration-500 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition-transform duration-500 dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
