"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Mic, MicOff, Square } from "lucide-react"

interface Question {
  id: number
  question_number: number
  question_text: string
}

interface Feedback {
  clarity: number
  relevance: number
  depth: number
  tip: string
}

type AnsweredQuestion = Question & { feedback: Feedback; answer: string }

export default function InterviewSession() {
  const { id } = useParams()
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [inputMode, setInputMode] = useState<"text" | "voice">("text")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([])
  const [recording, setRecording] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get(`/api/sessions/${id}/`)
      .then(res => {
        setQuestions(res.data.questions)
        setInputMode(res.data.input_mode)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load session.")
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (feedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [feedback])

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0

  const submitAnswer = useCallback(async (answerText: string) => {
    if (!answerText.trim() || !currentQuestion) return
    setSubmitting(true)
    setError("")
    try {
      const res = await api.post(
        `/api/sessions/${id}/questions/${currentQuestion.id}/evaluate/`,
        { answer_text: answerText }
      )
      setFeedback(res.data)
      setAnswered(prev => [...prev, {
        ...currentQuestion,
        feedback: res.data,
        answer: answerText
      }])
    } catch {
      setError("Failed to evaluate answer. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }, [currentQuestion, id])

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Please use Chrome.")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join("")
      setAnswer(transcript)
    }

    recognition.onend = () => setRecording(false)
    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  async function handleNext() {
    if (isLast) {
      setFinishing(true)
      try {
        const res = await api.post(`/api/sessions/${id}/complete/`)
        router.push(`/session/${id}/results`)
        sessionStorage.setItem(`session_results_${id}`, JSON.stringify(res.data))
      } catch {
        setError("Failed to complete session. Please try again.")
        setFinishing(false)
      }
      return
    }
    setCurrentIndex(i => i + 1)
    setAnswer("")
    setFeedback(null)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading your interview...</p>
      </main>
    )
  }

  if (error && !currentQuestion) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-xs text-gray-400">
              {Math.round(progress)}% complete
            </p>
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-3">
            Question {currentIndex + 1}
          </p>
          <p className="text-lg font-medium text-gray-900 leading-relaxed mb-6">
            {currentQuestion?.question_text}
          </p>

          {!feedback && (
            <>
              {inputMode === "text" ? (
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              ) : (
                <div className="flex flex-col items-center py-6 gap-4">
                  {recording ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center animate-pulse">
                        <Mic className="text-red-500" size={28} />
                      </div>
                      <p className="text-sm text-gray-500">Listening...</p>
                      {answer && (
                        <p className="text-sm text-gray-700 text-center italic max-w-md">
                          &ldquo;{answer}&rdquo;
                        </p>
                      )}
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        <Square size={14} /> Stop recording
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={startRecording}
                        className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                      >
                        <Mic className="text-emerald-600" size={28} />
                      </button>
                      <p className="text-sm text-gray-400">Tap to start recording</p>
                      {answer && (
                        <p className="text-sm text-gray-700 text-center italic max-w-md">
                          &ldquo;{answer}&rdquo;
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setInputMode(m => m === "text" ? "voice" : "text")
                    setAnswer("")
                    if (recording) stopRecording()
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {inputMode === "text"
                    ? <><Mic size={14} /> Switch to voice</>
                    : <><MicOff size={14} /> Switch to text</>
                  }
                </button>
                <button
                  onClick={() => submitAnswer(answer)}
                  disabled={submitting || !answer.trim()}
                  className="ml-auto bg-emerald-600 text-white font-medium px-6 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Evaluating..." : "Submit answer →"}
                </button>
              </div>
            </>
          )}
        </div>

        {feedback && (
          <div ref={feedbackRef} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider mb-4">
              Feedback
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Clarity", score: feedback.clarity },
                { label: "Relevance", score: feedback.relevance },
                { label: "Depth", score: feedback.depth },
              ].map(({ label, score }) => (
                <div key={label} className="bg-white rounded-xl p-3 text-center border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-600">{score}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-emerald-800 leading-relaxed mb-4">
              {feedback.tip}
            </p>

            <button
              onClick={handleNext}
              disabled={finishing}
              className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {finishing
                ? "Finishing..."
                : isLast
                ? "See results →"
                : "Next question →"
              }
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
