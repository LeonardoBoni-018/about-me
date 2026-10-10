import { ImageResponse } from "next/og"
import { profile } from "@/content/profile"
import { defaultLocale, hasLocale } from "@/i18n/config"

export const alt = `${profile.name} — ${profile.role.pt}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const grid =
  "linear-gradient(rgba(143,184,222,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,184,222,0.1) 1px, transparent 1px)"

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: value } = await params
  const locale = hasLocale(value) ? value : defaultLocale
  const hops = ["client", "gateway", "service", "database", "workers", "200 OK"]

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#0a1626",
        backgroundImage: grid,
        backgroundSize: "60px 60px",
        color: "#e6f0fa",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#8fa6bf" }}>
        <span style={{ color: "#ff7a3d" }}>GET</span>&nbsp;/leonardo HTTP/1.1
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "sans-serif",
          }}
        >
          Leonardo&nbsp;<span style={{ color: "#ff7a3d" }}>Boni</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 34,
            color: "#8fa6bf",
            fontFamily: "sans-serif",
          }}
        >
          {profile.role[locale]} — Java & Go
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", fontSize: 22 }}>
        {hops.map((hop, i) => (
          <div key={hop} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                border: `2px solid ${i === hops.length - 1 ? "#3ddc97" : "#9cc4e8"}`,
                borderRadius: 8,
                color: i === hops.length - 1 ? "#3ddc97" : "#e6f0fa",
              }}
            >
              {hop}
            </div>
            {i < hops.length - 1 && (
              <div
                style={{ display: "flex", width: 34, height: 2, background: "#ff7a3d" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>,
    size
  )
}
