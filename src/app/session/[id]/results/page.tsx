"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"

interface Results {
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  practice_questions: string[]
}

export default function Results() {
  const { id } = useParams()
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cached = sessionStorage.getItem(`session_results_${id}`)
    if (cached) {
      setResults(JSON.parse(cached))
      setLoading(false)
      return
    }
  
    api.get(`/api/sessions/${id}/`)
      .then(res => {
        setResults({
          overall_score: res.data.overall_score ?? 0,
          strengths: res.data.strengths || [],
          weaknesses: res.data.weaknesses || [],
          practice_questions: res.data.practice_questions || [],
        })
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load results.")
        setLoading(false)
      })
  }, [id])

  function getScoreColor(score: number) {
    if (score >= 8) return "text-emerald-600"
    if (score >= 6) return "text-amber-500"
    return "text-red-500"
  }

  function getScoreLabel(score: number) {
    if (score >= 8) return "Strong"
    if (score >= 6) return "Good"
    if (score >= 4) return "Developing"
    return "Needs work"
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading your results...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <Link href="/dashboard" className="text-emerald-600 text-sm hover:underline">
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  if (!results) return null

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="text-center mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Session complete
          </p>
          <div className="inline-flex flex-col items-center bg-white rounded-2xl border border-gray-200 px-10 py-6 mb-4">
          <p className={`text-6xl font-bold mb-1 ${getScoreColor(results.overall_score ?? 0)}`}>
            {results.overall_score ?? 0}
          </p>
            <p className="text-sm text-gray-400">out of 10</p>
            <p className={`text-sm font-medium mt-2 ${getScoreColor(results.overall_score)}`}>
              {getScoreLabel(results.overall_score)}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Overall score across clarity, relevance and depth
          </p>
        </div>

        {results.strengths.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-4">
              Your strengths
            </p>
            <ul className="space-y-3">
              {results.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{s}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.weaknesses.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <p className="text-xs font-medium text-amber-500 uppercase tracking-wider mb-4">
              Areas to improve
            </p>
            <ul className="space-y-3">
              {results.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{w}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.practice_questions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
              Practice these next time
            </p>
            <ul className="space-y-3">
              {results.practice_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xs font-medium text-gray-400 mt-0.5 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.strengths.length === 0 && results.weaknesses.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center">
            <p className="text-sm text-gray-400">
              Detailed feedback will appear here once AI evaluation is enabled.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/session/setup"
            className="flex-1 bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors text-center text-sm"
          >
            Start another session
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors text-center text-sm"
          >
            Back to dashboard
          </Link>
        </div>

      </div>
    </main>
  )
}
