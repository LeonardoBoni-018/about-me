import { useSyncExternalStore } from "react"

const noop = () => () => {}

/** `false` no HTML do servidor e durante a hidratação; `true` depois que o React assume. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
}
