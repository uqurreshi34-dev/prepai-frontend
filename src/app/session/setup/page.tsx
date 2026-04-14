"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import axios from "axios"

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
            className={`px-4 py-2 rounded-xl text-sm border transition-all active:scale-[0.98] cursor-pointer ${
              value === opt.value
                ? "bg-emerald-50 border-emerald-400 text-emerald-700 font-medium"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
            style={value === opt.value
              ? { boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)" }
              : { boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }
            }
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
    <div className="rounded-xl px-4 py-3 text-sm text-gray-500 mb-6 border border-emerald-100"
      style={{ background: "linear-gradient(135deg, #f0fdf4, #f8fafc)" }}>
      You&apos;re preparing for a{" "}
      <span className="text-emerald-700 font-medium">{roleLabel}</span> role. This
      will be a{" "}
      <span className="text-emerald-700 font-medium">
        {questionCount}-question {typeLabel.toLowerCase()}
      </span>{" "}
      interview. You&apos;ll answer by{" "}
      <span className="text-emerald-700 font-medium">{inputMode}</span>.
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error === "free_tier_limit") {
        router.push("/upgrade")
      } else {
        setError("Failed to start session. Please try again.")
      }
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: "#f8fafc" }}>
      <div className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Set up your interview</h1>
          <p className="text-gray-500 mt-1 text-sm">Tell us what you&apos;re preparing for</p>
        </div>

        <div className="bg-white rounded-2xl p-6"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)" }}>
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
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: "0 2px 8px rgba(5, 150, 105, 0.35)"
              }}
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
