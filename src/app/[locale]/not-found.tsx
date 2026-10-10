import Link from "next/link"
import { getDictionary, getLocale } from "@/i18n/dictionaries"

export default async function NotFound() {
  const locale = await getLocale()
  const { notFound: dict } = await getDictionary()

  return (
    <section className="mx-auto flex min-h-[75svh] max-w-6xl flex-col justify-center px-5 pt-28 pb-16 sm:px-8">
      <p className="font-mono text-sm">
        <span className="text-destructive">HTTP/1.1 404</span>{" "}
        <span className="text-muted-foreground">Not Found</span>
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight text-balance sm:text-7xl">
        {dict.title}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">{dict.description}</p>
      <p className="mt-4 inline-block -rotate-2 font-hand text-2xl text-primary">
        {dict.note}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-10 inline-flex w-fit items-center gap-2 rounded-md bg-foreground px-5 py-3 font-mono text-sm text-background transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        ← {dict.back}
      </Link>
    </section>
  )
}
