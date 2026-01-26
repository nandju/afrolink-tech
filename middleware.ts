import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes publiques
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next()
  }

  // Vérifier l'authentification pour les routes protégées
  const authCookie = request.cookies.get("authenticated")

  if (!authCookie || authCookie.value !== "true") {
    // Rediriger vers la page de connexion
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/generate")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
