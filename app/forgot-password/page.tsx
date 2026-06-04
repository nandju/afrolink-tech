"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { NavbarNew } from "@/components/ui/navbar-new"
import { FooterSectionNew } from "@/components/sections/footer-section-new"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Front-end simulation
    setEmailSent(true)
    setIsLoading(false)
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

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">
                  Mot de passe oublié ?
                </h1>
                <p className="mt-2 text-[#6B7280]">
                  Entrez votre email pour recevoir un lien de réinitialisation
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl bg-[#D68C2D] text-base font-semibold text-white shadow-lg shadow-[#D68C2D]/25 hover:bg-[#D68C2D]/90"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/10">
                  <CheckCircle className="h-8 w-8 text-[#10B981]" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-[#1E1E1E]">
                  Email envoyé !
                </h1>
                <p className="mt-4 text-[#6B7280]">
                  Nous avons envoyé un lien de réinitialisation à{" "}
                  <span className="font-semibold text-[#1E1E1E]">{email}</span>
                </p>
                <p className="mt-2 text-sm text-[#6B7280]">
                  Vérifiez votre boîte de réception et suivez les instructions.
                </p>

                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="mt-8 h-12 w-full rounded-xl border-2 border-[#E5E7EB] text-base font-semibold hover:border-[#D68C2D]/30 hover:bg-[#FAFAFA]"
                >
                  Renvoyer l'email
                </Button>
              </div>
            </>
          )}

          {/* Back to login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#D68C2D]"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden bg-gradient-to-br from-[#FAFAFA] to-white lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
        <div className="w-full max-w-lg">
          <PlaceholderImage
            aspectRatio="square"
            text="Password Reset Illustration"
            className="shadow-2xl"
          />
          <div className="mt-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-[#1E1E1E]">
              Récupération sécurisée
            </h2>
            <p className="mt-2 text-[#6B7280]">
              Nous vous aiderons à retrouver l'accès à votre compte
            </p>
          </div>
        </div>
      </div>
      </div>
      {/* <FooterSectionNew /> */}
    </div>
  )
}
