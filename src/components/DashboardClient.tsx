"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Session } from "next-auth"
import api from "@/lib/api"

interface Stats {
  sessions_this_month: number
  sessions_remaining: number
  average_score: number | null
  last_score: number | null
  last_role: string | null
  streak: number
}

export default function DashboardClient({ session }: { session: Session }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/dashboard/stats/")
      .then(res => {
        setStats(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const firstName = session.user.name?.split(" ")[0] || "there"

  function getScoreColor(score: number) {
    if (score >= 8) return "text-emerald-600"
    if (score >= 6) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {stats?.streak && stats.streak > 0
              ? `You're on a ${stats.streak}-day streak. Keep it up.`
              : "Ready to practise?"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-400 mb-1">Sessions this month</p>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {stats?.sessions_this_month ?? 0}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {stats?.sessions_remaining !== undefined
                ? stats.sessions_remaining > 0
                  ? `${stats.sessions_remaining} remaining on free tier`
                  : "Free tier limit reached"
                : "3 remaining on free tier"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-400 mb-1">Average score</p>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className={`text-3xl font-bold ${stats?.average_score ? getScoreColor(stats.average_score) : "text-gray-900"}`}>
                {stats?.average_score ?? "—"}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {stats?.average_score
                ? "across all sessions"
                : "Complete a session to see"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-400 mb-1">Current streak</p>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {stats?.streak ?? 0}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {stats?.streak && stats.streak > 0 ? "days in a row" : "Start today"}
            </p>
          </div>
        </div>

        {stats?.last_score && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Last session
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stats.last_role}
                </p>
                <p className="text-xs text-gray-400 mt-1">Most recent interview</p>
              </div>
              <p className={`text-3xl font-bold ${getScoreColor(stats.last_score)}`}>
                {stats.last_score}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {stats?.sessions_this_month === 0
              ? "Start your first session"
              : "Start another session"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Pick a role, answer real interview questions, get instant feedback.
          </p>
          <Link
            href="/session/setup"
            className="inline-block bg-emerald-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start interview
          </Link>
        </div>

      </div>
    </main>
  )
}
