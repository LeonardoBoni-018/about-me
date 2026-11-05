import { Archivo } from "next/font/google"
import { cn } from "@/lib/utils"

// Archivo com eixo de largura: condensada nos títulos, como o letreiro de uma folha técnica.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
})

/** Moldura dos protótipos: sem o header, o trilho e o rodapé do site atual. */
export default function LabLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <div className={cn(archivo.variable, "proto flex-1")}>
      {/* Marca que há JS antes da primeira pintura: o CSS só esconde o que a abertura anima
          quando o GSAP vai de fato rodar (ver .js em globals.css). */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      {children}
    </div>
  )
}
