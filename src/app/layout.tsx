import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import Navbar from "@/components/Navbar"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://rehearsai.co.uk"),
  title: {
    default: "RehearsAI — AI Mock Interview Coach",
    template: "%s | RehearsAI",
  },
  description: "Practice job interviews with an AI coach. Get real-time feedback on every answer — clarity, relevance, and depth. Free to try, no credit card required.",
  keywords: ["mock interview", "interview practice", "AI interview coach", "job interview preparation", "interview feedback"],
  authors: [{ name: "RehearsAI" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://rehearsai.co.uk",
    siteName: "RehearsAI",
    title: "RehearsAI — AI Mock Interview Coach",
    description: "Practice job interviews with an AI coach. Get real-time feedback on every answer. Free to try.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RehearsAI — AI Mock Interview Coach",
      },
    ],
  },
  icons: {
    icon: "/favicon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "RehearsAI — AI Mock Interview Coach",
    description: "Practice job interviews with an AI coach. Get real-time feedback on every answer. Free to try.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "-t4qkQUzQpXCy9d2N2tBXg6cLupxOsXcNnH-y_JiIfg"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} pt-[60px]`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
