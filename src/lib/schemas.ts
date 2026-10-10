import { z } from "zod"

/**
 * Schema do formulário de contato, compartilhado entre cliente (React Hook Form)
 * e servidor (Server Action). As mensagens de erro são chaves de
 * `contact.errors` no dicionário, traduzidas na hora de exibir.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "nameRequired" })
    .max(100, { error: "nameRequired" }),
  email: z.email({ error: "emailInvalid" }).max(200, { error: "emailInvalid" }),
  message: z
    .string()
    .trim()
    .min(10, { error: "messageShort" })
    .max(2000, { error: "messageLong" }),
  /** Honeypot: humanos nunca preenchem este campo (fica invisível). */
  website: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactErrorKey =
  "nameRequired" | "emailInvalid" | "messageShort" | "messageLong"
