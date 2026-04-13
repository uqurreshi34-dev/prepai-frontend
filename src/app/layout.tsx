import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrepAI — Practice until you're dangerous",
  description: "AI-powered mock interview coach",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
