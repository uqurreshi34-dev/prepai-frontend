"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") || ""
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setError("Invalid verification link.")
      return
    }

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/`, { token })
      .then(res => {
        setStatus("success")
        setTimeout(() => router.push("/login"), 2500)
      })
      .catch(err => {
        setStatus("error")
        setError(err.response?.data?.error || "Verification failed. Please request a new link.")
      })
  }, [token, router])

  return (
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0fdf4 100%)" }}>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 text-center"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.04)" }}>

          {status === "loading" && (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border border-gray-200 mb-5">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email</h1>
              <p className="text-sm text-gray-500">Just a moment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Email verified!</h1>
              <p className="text-sm text-gray-500 mb-1">Your account is now active.</p>
              <p className="text-sm text-gray-500">Redirecting you to the login page...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-200 mb-5">
                <XCircle size={24} className="text-red-500" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Verification failed</h1>
              <p className="text-sm text-gray-500 mb-6">{error}</p>
              <Link href="/register"
                className="block w-full bg-emerald-600 text-white font-medium py-2.5 rounded-xl text-sm text-center hover:bg-emerald-700 transition-colors">
                Back to register
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
