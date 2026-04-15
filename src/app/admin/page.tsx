"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Users, BarChart3, ShieldCheck, TrendingUp, Mail } from "lucide-react"

interface UserRow {
  id: number
  name: string
  email: string
  joined: string
  sessions: number
  avg_score: number | null
  is_email_verified: boolean
  is_pro: boolean
  google: boolean
}

interface WaitlistRow {
  email: string
  joined: string
}

interface AdminData {
  total_users: number
  total_sessions: number
  verified_emails: number
  avg_score: number | null
  waitlist_count: number
  waitlist: WaitlistRow[]
  users: UserRow[]
}

function AdminContent() {
  const searchParams = useSearchParams()
  const secret = searchParams.get("secret") || ""
  const [data, setData] = useState<AdminData | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!secret) {
      setError("No secret provided.")
      setLoading(false)
      return
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin-stats/?secret=${secret}`)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.status === 403 ? "Invalid secret." : "Failed to load.")
        setLoading(false)
      })
  }, [secret])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">403</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </main>
    )
  }

  if (!data) return null

  const cardShadow = { boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)" }

  const statCards = [
    { label: "Total users", value: data.total_users, icon: <Users size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Total sessions", value: data.total_sessions, icon: <BarChart3 size={14} className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Verified emails", value: data.verified_emails, icon: <ShieldCheck size={14} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Avg score", value: data.avg_score ?? "—", icon: <TrendingUp size={14} className="text-amber-500" />, bg: "bg-amber-50" },
    { label: "Waitlist", value: data.waitlist_count, icon: <Mail size={14} className="text-purple-600" />, bg: "bg-purple-50" },
  ]

  return (
    <main className="min-h-screen" style={{ background: "#f8fafc" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Admin</h1>
            <p className="text-gray-500 text-sm mt-1">PrepAI internal dashboard</p>
          </div>
          <div className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-lg" style={cardShadow}>
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-2xl p-5" style={cardShadow}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden mb-6" style={cardShadow}>
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">All users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100" style={{ background: "#fafafa" }}>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Sessions</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Avg score</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Auth</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === data.users.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.sessions}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {user.avg_score !== null ? (
                        <span className={
                          user.avg_score >= 8 ? "text-emerald-600" :
                          user.avg_score >= 6 ? "text-amber-500" : "text-red-500"
                        }>
                          {user.avg_score}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        user.is_email_verified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {user.is_email_verified ? "Verified" : "Unverified"}
                      </span>
                      {user.is_pro && (
                        <span className="ml-2 text-xs font-medium px-2.5 py-1 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                          Pro
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        user.google
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}>
                        {user.google ? "Google" : "Email"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {data.waitlist.length > 0 && (
          <div className="bg-white rounded-2xl overflow-hidden" style={cardShadow}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Waitlist</p>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                {data.waitlist_count} {data.waitlist_count === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100" style={{ background: "#fafafa" }}>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.waitlist.map((entry, i) => (
                    <tr
                      key={entry.email}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i === data.waitlist.length - 1 ? "border-0" : ""}`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    }>
      <AdminContent />
    </Suspense>
  )
}
