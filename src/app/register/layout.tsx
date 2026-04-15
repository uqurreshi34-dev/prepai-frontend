import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free PrepAI account and start practising job interviews with AI feedback.",
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
