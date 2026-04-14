import Link from "next/link"
import { Check, X } from "lucide-react"

export default function Upgrade() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: "#f8fafc" }}>
      <div className="max-w-md w-full">

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Free tier limit reached
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
            You&apos;ve used all 3 free sessions this month
          </h1>
          <p className="text-gray-500 text-sm">
            Upgrade to Pro for unlimited sessions, full progress tracking, and more.
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden mb-4"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)" }}>

          <div className="grid grid-cols-3 border-b border-gray-100">
            <div className="p-4 col-span-1" />
            <div className="p-4 text-center border-l border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Free</p>
              <p className="text-xl font-bold text-gray-900 mt-1">£0</p>
            </div>
            <div className="p-4 text-center border-l border-gray-100"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Pro</p>
              <p className="text-xl font-bold text-emerald-700 mt-1">£8<span className="text-sm font-normal text-emerald-600">/mo</span></p>
            </div>
          </div>

          {[
            { label: "Sessions per month", free: "3", pro: "Unlimited" },
            { label: "Progress dashboard", free: false, pro: true },
            { label: "Session history", free: "Limited", pro: "All sessions" },
            { label: "Downloadable reports", free: false, pro: true },
            { label: "Sector question packs", free: false, pro: true },
          ].map(({ label, free, pro }, i) => (
            <div key={label} className={`grid grid-cols-3 ${i !== 4 ? "border-b border-gray-100" : ""}`}>
              <div className="p-4 col-span-1">
                <p className="text-sm text-gray-600">{label}</p>
              </div>
              <div className="p-4 flex items-center justify-center border-l border-gray-100">
                {free === false ? (
                  <X size={14} className="text-gray-300" />
                ) : (
                  <span className="text-sm text-gray-500">{free}</span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-gray-100"
                style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
                {pro === true ? (
                  <Check size={14} className="text-emerald-600" />
                ) : (
                  <span className="text-sm font-medium text-emerald-700">{pro}</span>
                )}
              </div>
            </div>
          ))}

          <div className="p-6"
            style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
            <button
              disabled
              className="w-full text-white font-medium py-3 rounded-xl opacity-60 cursor-not-allowed text-sm"
              style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
            >
              Upgrade to Pro — coming soon
            </button>
            <p className="text-xs text-emerald-700 text-center mt-3">
              Payments launching soon. Your free sessions reset next month.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="block text-center text-sm text-gray-600 hover:text-gray-600 transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
    </main>
  )
}
