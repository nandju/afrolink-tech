"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { NavbarNew } from "@/components/ui/navbar-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    // Front-end only - any credentials work
    // Check if email contains "admin" to redirect to admin space
    const isAdmin = email.toLowerCase().includes("admin")
    document.cookie = "authenticated=true; path=/; max-age=86400"
    sessionStorage.setItem("authenticated", "true")
    
    if (isAdmin) {
      router.push("/admin")
    } else {
      router.push("/client/dashboard")
    }
  }

  const handleGoogleLogin = () => {
    document.cookie = "authenticated=true; path=/; max-age=86400"
    sessionStorage.setItem("authenticated", "true")
    router.push("/client/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <NavbarNew /> */}
      <div className="flex flex-1">
      {/* Left: Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-8 inline-flex items-center gap-3">
            <img src="/logo/icone_orange.png" alt="PROUV" className="h-10 w-10" />
            <span className="font-heading text-2xl font-bold text-[#1E1E1E]">PROUV</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">
              Bon retour !
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Connectez-vous pour accéder à votre espace
            </p>
            <p className="mt-3 text-xs text-[#D68C2D]">
              Astuce : saisissez un email contenant "admin" pour accéder à l'espace administrateur, ou un email classique pour l'espace client.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#1E1E1E]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@example.com"
                  className="h-12 rounded-xl border-[#E5E7EB] pl-10 focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-[#1E1E1E]">
                  Mot de passe
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#D68C2D] hover:text-[#D68C2D]/80"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-[#E5E7EB] pl-10 focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="group h-12 w-full rounded-xl bg-[#D68C2D] text-base font-semibold text-white shadow-lg shadow-[#D68C2D]/25 hover:bg-[#D68C2D]/90"
            >
              {isLoading ? (
                "Connexion..."
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-sm text-[#6B7280]">ou</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          {/* Google Login */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="h-12 w-full rounded-xl border-2 border-[#E5E7EB] text-base font-semibold hover:border-[#D68C2D]/30 hover:bg-[#FAFAFA]"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </Button>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-[#6B7280]">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-semibold text-[#D68C2D] hover:text-[#D68C2D]/80">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden bg-gradient-to-br from-[#FAFAFA] to-white lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
        <div className="w-full max-w-lg">
          <PlaceholderImage
            aspectRatio="square"
            text="Login Illustration"
            className="shadow-2xl"
          />
          <div className="mt-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-[#1E1E1E]">
              Gérez vos certificats en toute simplicité
            </h2>
            <p className="mt-2 text-[#6B7280]">
              Rejoignez les 120+ organisations qui font confiance à PROUV
            </p>
          </div>
        </div>
      </div>
      </div>
      {/* <FooterSectionNew /> */}
    </div>
  )
}
