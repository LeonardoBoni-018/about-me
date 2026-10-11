/**
 * Hash curto e determinístico (FNV-1a, 32 bits) em hexadecimal. Usado para "ids de commit" e
 * "trace ids" decorativos: o mesmo texto sempre gera o mesmo valor, no servidor e no cliente.
 */
export function shortHash(input: string, length = 7): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  let hex = (hash >>> 0).toString(16).padStart(8, "0")
  // Para comprimentos maiores, encadeia hashes do próprio resultado.
  while (hex.length < length) hex += shortHash(hex, 8)
  return hex.slice(0, length)
}

/** "Impressão digital" decorativa no formato de certificados: "4F:A2:19:C0:…". */
export function fingerprint(input: string, bytes = 8): string {
  return (
    shortHash(input, bytes * 2)
      .toUpperCase()
      .match(/../g)
      ?.join(":") ?? ""
  )
}
