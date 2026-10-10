export type ContactOutcome = "ok" | "invalid" | "rateLimited" | "error"

const STATUS: Record<ContactOutcome, { code: number; text: string }> = {
  ok: { code: 201, text: "Created" },
  invalid: { code: 422, text: "Unprocessable Entity" },
  rateLimited: { code: 429, text: "Too Many Requests" },
  error: { code: 503, text: "Service Unavailable" },
}

/** Status HTTP exibido no console de contato para cada desfecho do envio. */
export function statusFor(outcome: ContactOutcome) {
  return STATUS[outcome]
}

/** Valor como literal JSON, truncado para caber na pré-visualização. */
export function jsonValue(value: string | undefined, max = 140): string {
  const text = value ?? ""
  return JSON.stringify(text.length > max ? `${text.slice(0, max)}…` : text)
}
