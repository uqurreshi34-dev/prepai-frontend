"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

const ROLES = [
  { value: "junior_developer", label: "Junior developer" },
  { value: "marketing_graduate", label: "Marketing graduate" },
  { value: "finance_analyst", label: "Finance analyst" },
  { value: "nursing", label: "Nursing" },
  { value: "general", label: "General" },
]

const INTERVIEW_TYPES = [
  { value: "behavioural", label: "Behavioural" },
  { value: "technical", label: "Technical" },
  { value: "mixed", label: "Mixed" },
]

const QUESTION_COUNTS = [
  { value: 5, label: "5 questions" },
  { value: 10, label: "10 questions" },
]

const INPUT_MODES = [
  { value: "text", label: "Text" },
  { value: "voice", label: "Voice" },
]

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (v: string | number) => void
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
              value === opt.value
                ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Summary({
    role,
    interviewType,
    questionCount,
    inputMode,
  }: {
    role: string
    interviewType: string
    questionCount: number
    inputMode: string
  }) {
    const roleLabel = ROLES.find(r => r.value === role)?.label || role
    const typeLabel = INTERVIEW_TYPES.find(t => t.value === interviewType)?.label || interviewType
  
    return (
      <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-500 mb-6">
        You&apos;re preparing for a{" "}
        <span className="text-gray-900 font-medium">{roleLabel}</span> role. This
        will be a{" "}
        <span className="text-gray-900 font-medium">
          {questionCount}-question {typeLabel.toLowerCase()}
        </span>{" "}
        interview. You&apos;ll answer by{" "}
        <span className="text-gray-900 font-medium">{inputMode}</span>.
      </div>
    )
  }

export default function SessionSetup() {
  const router = useRouter()
  const [role, setRole] = useState("junior_developer")
  const [interviewType, setInterviewType] = useState("behavioural")
  const [questionCount, setQuestionCount] = useState(5)
  const [inputMode, setInputMode] = useState("text")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/api/auth/me/")
      .then(res => {
        if (res.data.target_role) {
          setRole(res.data.target_role)
        }
      })
      .catch(() => {})
  }, [])

  async function handleStart() {
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/api/sessions/create/", {
        role,
        interview_type: interviewType,
        question_count: questionCount,
        input_mode: inputMode,
      })
      router.push(`/session/${res.data.session_id}`)
    } catch {
      setError("Failed to start session. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Set up your interview</h1>
          <p className="text-gray-500 mt-1 text-sm">Tell us what you&apos;re preparing for</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <OptionGroup
            label="Role"
            options={ROLES}
            value={role}
            onChange={v => setRole(v as string)}
          />
          <OptionGroup
            label="Interview type"
            options={INTERVIEW_TYPES}
            value={interviewType}
            onChange={v => setInterviewType(v as string)}
          />
          <OptionGroup
            label="Number of questions"
            options={QUESTION_COUNTS}
            value={questionCount}
            onChange={v => setQuestionCount(v as number)}
          />
          <OptionGroup
            label="Answer mode"
            options={INPUT_MODES}
            value={inputMode}
            onChange={v => setInputMode(v as string)}
          />

          <div className="border-t border-gray-100 pt-6">
            <Summary
              role={role}
              interviewType={interviewType}
              questionCount={questionCount}
              inputMode={inputMode}
            />

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Generating questions..." : "Start interview →"}
            </button>

            {loading && (
              <p className="text-center text-xs text-gray-400 mt-3">
                AI is generating your questions — this takes a few seconds
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
