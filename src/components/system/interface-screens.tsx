import Image from "next/image"
import { ViewportFrame } from "@/components/system/viewport-frame"
import type { InterfaceProject } from "@/lib/types"

interface InterfaceScreensProps {
  item: InterfaceProject
  /** Textos alternativos; `{title}` vira o nome do projeto. */
  alt: { desktop: string; mobile: string }
}

/** Site no ar: screenshot do desktop na moldura e a versão de celular sobreposta. */
export function InterfaceScreens({ item, alt }: InterfaceScreensProps) {
  const { desktop, mobile } = item.screenshots!
  return (
    <div className="relative pr-[14%] pb-[10%]">
      <ViewportFrame route={item.route} status="200">
        <Image
          src={desktop}
          alt={alt.desktop.replace("{title}", item.title)}
          width={1440}
          height={900}
          sizes="(min-width: 1024px) 560px, 92vw"
          className="block h-auto w-full"
        />
      </ViewportFrame>
      <div className="absolute right-0 bottom-0 w-[30%] overflow-hidden rounded-[14px] border-4 border-card bg-card shadow-[0_8px_24px_-12px_rgb(0_0_0/0.45)] ring-1 ring-border">
        <Image
          src={mobile}
          alt={alt.mobile.replace("{title}", item.title)}
          width={780}
          height={1328}
          sizes="(min-width: 1024px) 170px, 28vw"
          className="block h-auto w-full"
        />
      </div>
    </div>
  )
}
