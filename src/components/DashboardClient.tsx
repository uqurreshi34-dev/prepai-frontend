"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Session } from "next-auth"
import api from "@/lib/api"
import { getSession } from "next-auth/react"
import { TrendingUp, Zap, Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface Stats {
  sessions_this_month: number
  sessions_remaining: number
  average_score: number | null
  last_score: number | null
  last_role: string | null
  streak: number
}

interface SessionSummary {
  id: number
  role: string
  interview_type: string
  question_count: number
  overall_score: number | null
  completed: boolean
  created_at: string
}

function anim(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const }
  }
}

export default function DashboardClient({ session }: { session: Session }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [history, setHistory] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(s => {
      if (!s) return
      Promise.all([
        api.get("/api/dashboard/stats/"),
        api.get("/api/sessions/history/"),
      ])
        .then(([statsRes, historyRes]) => {
          setStats(statsRes.data)
          setHistory(historyRes.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    })
  }, [])

  const firstName = session.user.name?.split(" ")[0] || "there"

  function getScoreColor(score: number) {
    if (score >= 8) return "text-emerald-600"
    if (score >= 6) return "text-amber-500"
    return "text-red-500"
  }

  function getScoreBadgeStyle(score: number) {
    if (score >= 8) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (score >= 6) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const cardShadow = { boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)" }

  return (
    <main className="min-h-screen" style={{ background: "#f8fafc" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">

        <motion.div className="mb-8" {...anim(0)}>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Welcome {firstName}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {stats?.streak && stats.streak > 0
              ? `You're on a ${stats.streak}-day streak. Keep it up.`
              : "Ready to practise?"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div className="bg-white rounded-2xl p-5" style={cardShadow} {...anim(0.08)}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions this month</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Calendar size={13} className="text-emerald-600" />
              </div>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {stats?.sessions_this_month ?? 0}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1.5">
              {stats?.sessions_remaining !== undefined
                ? stats.sessions_remaining > 0
                  ? `${stats.sessions_remaining} remaining on free tier`
                  : "Free tier limit reached"
                : "3 remaining on free tier"}
            </p>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-5" style={cardShadow} {...anim(0.16)}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average score</p>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp size={13} className="text-emerald-600" />
              </div>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <p className={`text-3xl font-bold tracking-tight ${stats?.average_score ? getScoreColor(stats.average_score) : "text-gray-900"}`}>
                {stats?.average_score ?? "—"}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1.5">
              {stats?.average_score ? "across all sessions" : "Complete a session to see"}
            </p>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-5" style={cardShadow} {...anim(0.24)}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current streak</p>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Zap size={13} className="text-amber-500" />
              </div>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {stats?.streak ?? 0}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1.5">
              {stats?.streak && stats.streak > 0 ? "days in a row" : "Start today"}
            </p>
          </motion.div>
        </div>

        {stats?.last_score && (
          <motion.div className="bg-white rounded-2xl p-5 mb-6" style={cardShadow} {...anim(0.32)}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
              Last session
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{stats.last_role}</p>
                <p className="text-xs text-gray-500 mt-1">Most recent interview</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold tracking-tight ${getScoreColor(stats.last_score)}`}>
                  {stats.last_score}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">out of 10</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            boxShadow: "0 4px 20px rgba(5, 150, 105, 0.35)"
          }}
          {...anim(0.36)}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "white", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: "white", transform: "translate(-30%, 30%)" }} />
          <div className="relative">
            <h2 className="text-lg font-semibold mb-1">
              {stats?.sessions_this_month === 0 ? "Start your first session" : "Start another session"}
            </h2>
            <p className="text-emerald-100 text-sm mb-5">
              Pick a role, answer real interview questions, get instant feedback.
            </p>
            {stats && stats.sessions_remaining === 0 ? (
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 bg-amber-500 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-colors text-sm"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                Upgrade to continue <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/session/setup"
                className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors text-sm"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
              >
                Start interview <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </motion.div>

        {history.length > 0 && (
          <motion.div {...anim(0.44)}>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">
              Session history
            </p>
            <div className="bg-white rounded-2xl overflow-hidden" style={cardShadow}>
              {history.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.44 + i * 0.06, ease: "easeOut" }}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                    i !== history.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">{s.role}</p>
                    <p className="text-xs text-gray-600 mt-0.5 capitalize">
                      {s.interview_type} · {s.question_count} questions · {s.created_at}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.completed && s.overall_score !== null ? (
                      <>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getScoreBadgeStyle(s.overall_score)}`}>
                          {s.overall_score}/10
                        </span>
                        <Link
                          href={`/session/${s.id}/results`}
                          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          View
                        </Link>
                      </>
                    ) : (
                      <span className="text-xs text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                        Incomplete
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </main>
  )
}
