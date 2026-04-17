import GoogleProvider from "next-auth/providers/google"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "consumers",
      authorization: {
        params: {
          scope: "openid profile email User.Read offline_access",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          )
          if (res.data.access) {
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              name: res.data.user.name,
              accessToken: res.data.access,
              refreshToken: res.data.refresh,
              isPro: res.data.user.is_pro,
            }
          }
          return null
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.data?.error === "email_not_verified") {
            throw new Error("email_not_verified")
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/`,
            { id_token: account.id_token }
          )
          user.accessToken = res.data.access
          user.refreshToken = res.data.refresh
          user.isPro = res.data.user.is_pro
          user.id = res.data.user.id
        } catch {
          return false
        }
      }
      if (account?.provider === "azure-ad") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/microsoft/`,
            { access_token: account.access_token || account.id_token }
          )
          user.accessToken = res.data.access
          user.refreshToken = res.data.refresh
          user.isPro = res.data.user.is_pro
          user.id = res.data.user.id
        } catch (err) {
          console.error("Microsoft auth error:", err)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.isPro = user.isPro
        token.id = user.id
        token.accessTokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour
      }

      // Return token if still valid
      if (Date.now() < (token.accessTokenExpiry as number)) {
        return token
      }

      // Access token expired — refresh using Django refresh token
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`,
          { refresh: token.refreshToken }
        )
        token.accessToken = res.data.access
        token.accessTokenExpiry = Date.now() + 60 * 60 * 1000
      } catch {
        // Refresh failed — user will need to re-login
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.user.isPro = token.isPro as boolean
      session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
}
