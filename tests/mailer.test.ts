import { beforeEach, describe, expect, it, vi } from "vitest"

const sendMail = vi.fn()
const createTransport = vi.fn((_options: unknown) => ({ sendMail }))
const resendSend = vi.fn()

vi.mock("server-only", () => ({}))
vi.mock("nodemailer", () => ({ createTransport }))
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend }
  },
}))

const { getMailer, getOwnerEmail } = await import("@/lib/mailer")

const smtpEnv = {
  SMTP_HOST: "smtp.gmail.com",
  SMTP_USER: "eu@gmail.com",
  SMTP_PASS: "senha-de-app",
}
const mail = { to: "alguem@x.com", subject: "Oi", text: "corpo" }

beforeEach(() => vi.clearAllMocks())

describe("getMailer", () => {
  it("sem configuração, não há provedor", () => {
    expect(getMailer({})).toBeNull()
  })

  it("prefere SMTP, com TLS direto na 465 e remetente = conta autenticada", async () => {
    const mailer = getMailer({ ...smtpEnv, RESEND_API_KEY: "re_x" })
    expect(mailer?.provider).toBe("smtp")
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: "eu@gmail.com", pass: "senha-de-app" },
      })
    )
    await mailer!.send(mail)
    expect(sendMail).toHaveBeenCalledWith({
      from: "Leonardo Boni <eu@gmail.com>",
      ...mail,
    })
  })

  it("na porta 587 usa STARTTLS (secure: false)", () => {
    getMailer({ ...smtpEnv, SMTP_PORT: "587" })
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ port: 587, secure: false })
    )
  })

  it("usa o Resend quando só há RESEND_API_KEY e propaga o erro dele", async () => {
    const mailer = getMailer({ RESEND_API_KEY: "re_x" })
    expect(mailer?.provider).toBe("resend")

    resendSend.mockResolvedValueOnce({ error: null })
    await expect(mailer!.send(mail)).resolves.toBeUndefined()

    resendSend.mockResolvedValueOnce({
      error: { name: "validation_error", message: "domínio não verificado" },
    })
    await expect(mailer!.send(mail)).rejects.toThrow("domínio não verificado")
  })
})

describe("getOwnerEmail", () => {
  it("usa CONTACT_TO_EMAIL e, sem ele, a conta SMTP", () => {
    expect(getOwnerEmail({ ...smtpEnv, CONTACT_TO_EMAIL: "dono@x.com" })).toBe(
      "dono@x.com"
    )
    expect(getOwnerEmail(smtpEnv)).toBe("eu@gmail.com")
    expect(getOwnerEmail({})).toBeNull()
  })
})
