import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { Toaster } from "sonner"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "PROUV | Génération automatique de certificats PDF",
  description:
    "Générez automatiquement des certificats PDF personnalisés à partir d'un modèle et d'une liste de noms. Parfait pour les formations, ONG, écoles et séminaires.",
  generator: "Next.js",
  icons: {
    icon: [
      {
        url: "/logo_1.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo_1.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo_1.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo_1.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-sans antialiased bg-zinc-950 text-zinc-100`}>
        <LenisProvider>{children}</LenisProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "bg-white text-[#1E1E1E] border border-[#E5E7EB] shadow-xl rounded-xl font-sans",
            style: {
              backgroundColor: "#FFFFFF",
              color: "#1E1E1E",
              borderColor: "#E5E7EB",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
