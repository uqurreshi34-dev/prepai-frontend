import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your PrepAI account and continue practising.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
