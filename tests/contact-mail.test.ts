import { describe, expect, it } from "vitest"
import { confirmationMail, ownerMail } from "@/lib/contact-mail"

const input = { name: "Ana", email: "ana@empresa.com", message: "Vaga de backend Go." }

describe("ownerMail", () => {
  it("chega para o dono com 'Responder' apontando para quem escreveu", () => {
    const mail = ownerMail(input, "en", "dono@x.com")
    expect(mail).toMatchObject({ to: "dono@x.com", replyTo: "ana@empresa.com" })
    expect(mail.subject).toContain("Ana")
    expect(mail.text).toContain("Vaga de backend Go.")
    expect(mail.text).toContain("Idioma da página: en")
  })
})

describe("confirmationMail", () => {
  it("vai para o visitante, no idioma da página, com o link do site", () => {
    const pt = confirmationMail("pt", "ana@empresa.com", "dono@x.com", "https://site.dev")
    expect(pt).toMatchObject({ to: "ana@empresa.com", replyTo: "dono@x.com" })
    expect(pt.subject).toMatch(/Recebi sua mensagem/)
    expect(pt.text).toContain("https://site.dev")
    expect(pt.text).not.toContain("{site}")

    const en = confirmationMail("en", "ana@empresa.com", "dono@x.com", "https://site.dev")
    expect(en.subject).toMatch(/Got your message/)
  })

  it("não repete nada do que o visitante digitou", () => {
    const mail = confirmationMail(
      "pt",
      "ana@empresa.com",
      "dono@x.com",
      "https://site.dev"
    )
    expect(mail.text).not.toContain("Ana")
    expect(mail.text).not.toContain("Vaga de backend")
  })
})
