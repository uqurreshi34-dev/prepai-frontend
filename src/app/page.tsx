import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-xl text-center">
        <div className="inline-block bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          Free to try
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Practice until you&apos;re dangerous.
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          PrepAI is an AI-powered mock interview coach that gives you real-time
          feedback on every answer — so you walk into every interview ready.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/register"
            className="bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
