"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`, {
        name,
        email,
        password,
      })
      setRegistered(true)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Something went wrong.")
      } else {
        setError("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResending(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification/`, { email })
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch {
      // silent
    } finally {
      setResending(false)
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const inputClass = "w-full border border-gray-200 rounded-xl py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
  const inputStyle = { boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }

  if (registered) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0fdf4 100%)" }}>
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.04)" }}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-2">
              We sent a verification link to
            </p>
            <p className="text-sm font-medium text-gray-900 mb-6">{email}</p>
            <p className="text-xs text-gray-400 mb-6">
              Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
            </p>

            {resent && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
                Verification email resent.
              </div>
            )}

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm disabled:opacity-50 cursor-pointer mb-4"
            >
              {resending ? "Resending..." : "Resend verification email"}
            </button>

            <Link href="/login" className="block text-sm text-emerald-600 font-medium hover:text-emerald-700">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0fdf4 100%)" }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 mb-4"
            style={{ boxShadow: "0 4px 14px rgba(5, 150, 105, 0.35)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L13 8H17L14 12L15 18L10 15L5 18L6 12L3 8H7L10 2Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Start practising with PrepAI for free</p>
        </div>

        <div className="bg-white rounded-2xl p-8"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.04)" }}>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className={`${inputClass} pl-9 pr-3`} style={inputStyle} placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className={`${inputClass} pl-9 pr-3`} style={inputStyle} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)} required minLength={8}
                  className={`${inputClass} pl-9 pr-9`} style={inputStyle} placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input type={showConfirm ? "text" : "password"} value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} required minLength={8}
                  className={`${inputClass} pl-9 pr-9`} style={inputStyle} placeholder="Repeat your password" />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-xl hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              style={{ boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)" }}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition-all cursor-pointer"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
