// Configuration d'authentification simple - 5 comptes
export const AUTH_USERS = [
  { username: "afrolink", password: "leaderafrolink1" },
  { username: "hime", password: "leaderafrolink2" },
  { username: "sara", password: "agentafrolink1" },
  { username: "junior", password: "agentafrolink2" },
  { username: "martin", password: "agentafrolink3" },
] as const

export function validateCredentials(username: string, password: string): boolean {
  return AUTH_USERS.some(
    (user) => user.username === username && user.password === password
  )
}

export function setAuthSession() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("authenticated", "true")
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("authenticated")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("authenticated") === "true"
  }
  return false
}
