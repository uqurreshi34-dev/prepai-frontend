"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { CheckCircle2 } from "lucide-react"

const ROLES = [
  { value: "", label: "Not set" },
  { value: "junior_developer", label: "Junior developer" },
  { value: "marketing_graduate", label: "Marketing graduate" },
  { value: "finance_analyst", label: "Finance analyst" },
  { value: "nursing", label: "Nursing" },
  { value: "general", label: "General" },
]

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [targetRole, setTargetRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      api.get("/api/auth/me/")
        .then(res => {
          setTargetRole(res.data.target_role || "")
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, router])

  async function handleSave() {
    setSaving(true)
    setError("")
    setSuccess(false)
    try {
      await api.post("/api/auth/profile/", { target_role: targetRole })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: "#f8fafc" }}>
      <div className="max-w-lg mx-auto px-6 py-10">

        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Profile</h1>
          <p className="text-gray-500 text-sm mt-1">{session?.user?.email}</p>
        </div>

        <div className="bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)" }}>

          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Target role
            </p>
            <p className="text-sm text-gray-500 mb-4">
              PrepAI will pre-select this on your session setup screen.
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(role => (
                <button
                  key={role.value}
                  onClick={() => setTargetRole(role.value)}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all active:scale-[0.98] cursor-pointer ${
                    targetRole === role.value
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  style={targetRole === role.value
                    ? { boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)" }
                    : { boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }
                  }
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} className="flex-shrink-0" />
              Profile saved.
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)"
            }}
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>
    </main>
  )
}
