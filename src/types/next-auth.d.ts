import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isPro: boolean
    } & DefaultSession["user"]
  }

  interface User {
    accessToken: string
    refreshToken: string
    isPro: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    isPro: boolean
    id: string
  }
}
