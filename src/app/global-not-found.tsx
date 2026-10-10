import type { Metadata } from "next"
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google"
import Link from "next/link"
import { themeScript } from "@/lib/theme-script"
import "./globals.css"

// preload desligado: esta página é rara e não deve "vazar" preloads para as outras rotas.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  preload: false,
})
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
})

export const metadata: Metadata = {
  title: "404 — Página não encontrada",
  description: "A página solicitada não existe. / The requested page does not exist.",
}

/** 404 para URLs que não casam com nenhuma rota (fora do layout por idioma). */
export default function GlobalNotFound() {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh items-center px-5 sm:px-8">
        <main className="mx-auto w-full max-w-3xl">
          <p className="font-mono text-sm">
            <span className="text-destructive">HTTP/1.1 404</span>{" "}
            <span className="text-muted-foreground">Not Found</span>
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-7xl">
            Essa rota não existe.
          </h1>
          <p className="mt-3 font-display text-2xl text-muted-foreground" lang="en">
            This route doesn&apos;t exist.
          </p>
          <div>
            <Link
              href="/"
              className="mt-10 inline-flex rounded-md bg-foreground px-5 py-3 font-mono text-sm text-background transition-colors hover:bg-primary"
            >
              ← Início / Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
