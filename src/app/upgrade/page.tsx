import Link from "next/link"

export default function Upgrade() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-4">
          <div className="inline-block bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
            Free tier limit reached
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            You&apos;ve used all 3 free sessions this month
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Upgrade to Pro for unlimited sessions, full progress tracking,
            session history, and downloadable reports.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: "Sessions", free: "3/month", pro: "Unlimited" },
              { label: "Progress dashboard", free: "—", pro: "Full access" },
              { label: "Session history", free: "Limited", pro: "All sessions" },
              { label: "PDF reports", free: "—", pro: "Included" },
            ].map(({ label, free, pro }) => (
              <div key={label} className="col-span-2 flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <p className="text-sm text-gray-600">{label}</p>
                <div className="flex gap-6 text-sm">
                  <span className="text-gray-400 w-20 text-center">{free}</span>
                  <span className="text-emerald-600 font-medium w-20 text-center">{pro}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1 text-center py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-400">Free</p>
              <p className="text-lg font-bold text-gray-900">£0</p>
            </div>
            <div className="flex-1 text-center py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-600">Pro</p>
              <p className="text-lg font-bold text-emerald-700">£8/mo</p>
            </div>
          </div>

          <button
            disabled
            className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg opacity-50 cursor-not-allowed mt-4"
          >
            Upgrade to Pro — coming soon
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Payments launching soon. Check back next month for your free sessions.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="block text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
