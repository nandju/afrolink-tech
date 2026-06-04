"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, Building, ArrowRight } from "lucide-react"
import Link from "next/link"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { NavbarNew } from "@/components/ui/navbar-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    // Front-end only - any data works
    document.cookie = "authenticated=true; path=/; max-age=86400"
    router.push("/dashboard")
  }

  const handleGoogleSignup = () => {
    document.cookie = "authenticated=true; path=/; max-age=86400"
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarNew />
      <div className="flex flex-1">
      {/* Left: Visual */}
      <div className="hidden bg-gradient-to-br from-[#FAFAFA] to-white lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
        <div className="w-full max-w-lg">
          <PlaceholderImage
            aspectRatio="square"
            text="Register Illustration"
            className="shadow-2xl"
          />
          <div className="mt-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-[#1E1E1E]">
              Générer mon Certificat
            </h2>
            <p className="mt-2 text-[#6B7280]">
              20 crédits offerts pour tester toutes les fonctionnalités
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
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
              Créer un compte
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Commencez à générer vos certificats en quelques minutes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[#1E1E1E]">
                Nom complet
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="h-12 rounded-xl border-[#E5E7EB] pl-10 focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#1E1E1E]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre.email@example.com"
                  className="h-12 rounded-xl border-[#E5E7EB] pl-10 focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-[#1E1E1E]">
                Entreprise <span className="text-[#6B7280]">(optionnel)</span>
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Votre entreprise"
                  className="h-12 rounded-xl border-[#E5E7EB] pl-10 focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#1E1E1E]">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-[#E5E7EB] pl-10 focus:border-[#D68C2D] focus:ring-[#D68C2D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1E1E1E]">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                "Création du compte..."
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-sm text-[#6B7280]">ou</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>

          {/* Google Signup */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            variant="outline"
            className="h-12 w-full rounded-xl border-2 border-[#E5E7EB] text-base font-semibold hover:border-[#D68C2D]/30 hover:bg-[#FAFAFA]"
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            S'inscrire avec Google
          </Button>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-[#6B7280]">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/terms" className="font-medium text-[#D68C2D] hover:text-[#D68C2D]/80">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="font-medium text-[#D68C2D] hover:text-[#D68C2D]/80">
              Politique de confidentialité
            </Link>
          </p>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-[#D68C2D] hover:text-[#D68C2D]/80">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
      </div>
      <FooterSectionNew />
    </div>
  )
}
