export const THEME_STORAGE_KEY = "theme"

/**
 * Script inline executado no <head> antes da primeira pintura: aplica o tema
 * salvo ou, sem escolha salva, o do sistema — evitando o "flash" de tema errado.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`
