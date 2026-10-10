"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import * as m from "motion/react-m"
import { sendContact } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { useHydrated } from "@/hooks/use-hydrated"
import { jsonValue, statusFor, type ContactOutcome } from "@/lib/http"
import { contactSchema, type ContactErrorKey, type ContactInput } from "@/lib/schemas"
import { cn } from "@/lib/utils"

const MESSAGE_MAX = 2000

const field =
  "rounded-none border-0 border-b border-input bg-transparent px-0 font-mono text-sm shadow-none focus-visible:border-primary focus-visible:ring-0 dark:bg-transparent aria-invalid:border-destructive aria-invalid:ring-0"

interface Response {
  outcome: ContactOutcome
  ms: number
  /** Só no sucesso: se a confirmação foi para o e-mail de quem escreveu. */
  confirmation?: boolean
  fieldErrors?: Partial<Record<keyof ContactInput, string>>
}

/**
 * Formulário de contato como um console de API: ao digitar, a requisição POST é montada ao
 * lado; ao enviar, a resposta aparece com o status HTTP correspondente.
 */
export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary["contact"]
}) {
  const [pending, startTransition] = useTransition()
  // Antes da hidratação o formulário não tem onSubmit: um clique faria um envio nativo (GET),
  // recarregando a página com e-mail e mensagem na URL. O botão só habilita depois.
  const hydrated = useHydrated()
  const [response, setResponse] = useState<Response | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
    // Valida no envio e depois a cada digitação. Validar no blur fazia a mensagem de erro
    // empurrar o botão entre o mousedown e o mouseup — e o clique de envio se perdia.
    mode: "onSubmit",
    reValidateMode: "onChange",
  })

  const [name, email, message] = useWatch({ control, name: ["name", "email", "message"] })

  // O que for digitado antes da hidratação fica no DOM, mas o React Hook Form não vê:
  // sincroniza na montagem para a pré-visualização refletir o campo.
  useEffect(() => {
    for (const field of ["name", "email", "message"] as const) {
      const el = document.getElementById(field) as
        HTMLInputElement | HTMLTextAreaElement | null
      if (el?.value) setValue(field, el.value)
    }
  }, [setValue])
  const errorText = (key?: string) =>
    key ? dict.errors[key as ContactErrorKey] : undefined

  function onSubmit(data: ContactInput) {
    startTransition(async () => {
      const started = performance.now()
      const result = await sendContact(data, locale)
      const ms = Math.round(performance.now() - started)
      if (result.ok) {
        setResponse({ outcome: "ok", ms, confirmation: result.confirmation })
        reset()
      } else {
        setResponse({ outcome: result.error, ms })
      }
    })
  }

  // Erros de validação no cliente também viram uma "resposta" 422.
  function onInvalid(fieldErrors: typeof errors) {
    setResponse({
      outcome: "invalid",
      ms: 0,
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [
          key,
          errorText(value?.message),
        ])
      ),
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="relative space-y-7 rounded-lg border bg-card p-6 sm:p-8"
      >
        <div className="grid gap-7 sm:grid-cols-2">
          <Field id="name" label={dict.form.name} error={errorText(errors.name?.message)}>
            <Input
              id="name"
              autoComplete="name"
              placeholder={dict.form.namePlaceholder}
              className={field}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
          </Field>
          <Field
            id="email"
            label={dict.form.email}
            error={errorText(errors.email?.message)}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={dict.form.emailPlaceholder}
              className={field}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </Field>
        </div>

        <Field
          id="message"
          label={dict.form.message}
          error={errorText(errors.message?.message)}
        >
          <Textarea
            id="message"
            rows={6}
            maxLength={MESSAGE_MAX}
            placeholder={dict.form.messagePlaceholder}
            className={cn(field, "min-h-36 resize-y")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : "message-count"}
            {...register("message")}
          />
          <span
            id="message-count"
            className="block text-right font-mono text-xs text-muted-foreground"
          >
            {message?.length ?? 0}/{MESSAGE_MAX}
          </span>
        </Field>

        {/* Honeypot: invisível para pessoas, tentador para bots. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] size-px overflow-hidden"
        >
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending || !hydrated}
          className="group w-full rounded-md bg-foreground font-mono text-background hover:bg-primary hover:text-primary-foreground sm:w-auto"
        >
          <span className="text-primary group-hover:text-primary-foreground">POST</span>
          {pending ? dict.form.sending : dict.form.submit}
          {pending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          )}
        </Button>
      </form>

      {/* Requisição sendo montada + resposta */}
      <div className="flex flex-col gap-4 font-mono text-xs leading-relaxed lg:sticky lg:top-24 lg:self-start">
        <section aria-label={dict.previewLabel} className="rounded-lg border bg-card">
          <p className="border-b px-4 py-2 text-muted-foreground">{dict.previewLabel}</p>
          <pre className="px-4 py-3 [overflow-wrap:anywhere] whitespace-pre-wrap">
            <span className="text-primary">POST</span> /v1/contact HTTP/1.1{"\n"}
            <span className="text-muted-foreground">Host: leonardoboni.dev{"\n"}</span>
            <span className="text-muted-foreground">
              Content-Type: application/json{"\n\n"}
            </span>
            {"{\n"}
            <JsonLine k="name" v={name} placeholder={dict.form.namePlaceholder} />
            <JsonLine k="email" v={email} placeholder={dict.form.emailPlaceholder} />
            <JsonLine
              k="message"
              v={message}
              placeholder={dict.form.messagePlaceholder}
              last
            />
            {"}"}
          </pre>
        </section>

        <section
          aria-label={dict.response.label}
          aria-live="polite"
          className="relative overflow-hidden rounded-lg border bg-card"
        >
          <p className="border-b px-4 py-2 text-muted-foreground">
            {dict.response.label}
          </p>
          {pending && (
            <m.span
              aria-hidden="true"
              className="absolute top-0 left-0 h-0.5 w-1/3 bg-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <div className="min-h-28 px-4 py-3">
            {pending ? (
              <p className="text-muted-foreground">
                {dict.response.waiting}
                <span className="animate-blink">…</span>
              </p>
            ) : response ? (
              <ResponseView response={response} dict={dict} />
            ) : (
              <p className="text-muted-foreground">{dict.response.idle}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function JsonLine({
  k,
  v,
  placeholder,
  last,
}: {
  k: string
  v: string | undefined
  placeholder: string
  last?: boolean
}) {
  return (
    <>
      {"  "}
      <span className="text-ink">&quot;{k}&quot;</span>:{" "}
      {v ? (
        <span className="text-foreground">{jsonValue(v)}</span>
      ) : (
        <span className="text-muted-foreground/60">{jsonValue(placeholder, 40)}</span>
      )}
      {last ? "\n" : ",\n"}
    </>
  )
}

function ResponseView({
  response,
  dict,
}: {
  response: Response
  dict: Dictionary["contact"]
}) {
  const status = statusFor(response.outcome)
  const ok = response.outcome === "ok"
  const messages: Record<ContactOutcome, string> = {
    ok:
      response.confirmation === false
        ? dict.response.successNoCopy
        : dict.response.success,
    invalid: dict.response.invalid,
    rateLimited: dict.response.rateLimited,
    error: dict.response.error,
  }

  return (
    <m.pre
      key={`${response.outcome}-${response.ms}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="[overflow-wrap:anywhere] whitespace-pre-wrap"
    >
      <span className={ok ? "text-success" : "text-destructive"}>
        HTTP/1.1 {status.code} {status.text}
      </span>
      {response.ms > 0 && (
        <span className="text-muted-foreground"> · {response.ms} ms</span>
      )}
      {"\n\n{\n  "}
      <span className="text-ink">&quot;message&quot;</span>:{" "}
      {jsonValue(messages[response.outcome], 200)}
      {response.fieldErrors && Object.keys(response.fieldErrors).length > 0 && (
        <>
          {",\n  "}
          <span className="text-ink">&quot;errors&quot;</span>
          {": {\n"}
          {Object.entries(response.fieldErrors).map(([key, value], i, all) => (
            <span key={key}>
              {"    "}
              <span className="text-ink">&quot;{key}&quot;</span>: {jsonValue(value, 200)}
              {i < all.length - 1 ? ",\n" : "\n"}
            </span>
          ))}
          {"  }"}
        </>
      )}
      {"\n}"}
    </m.pre>
  )
}

interface FieldProps {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label
        htmlFor={id}
        className="font-mono text-xs font-normal tracking-wider text-muted-foreground uppercase"
      >
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
