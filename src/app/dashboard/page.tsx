import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import LogoutButton from "@/components/LogoutButton"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-emerald-600">PrepAI</span>
        <LogoutButton />
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-500 mt-1">Ready to practise?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-400 mb-1">Sessions this month</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-400 mt-1">3 remaining on free tier</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-400 mb-1">Average score</p>
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-xs text-gray-400 mt-1">Complete a session to see</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-400 mb-1">Current streak</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-400 mt-1">days</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Start a session</h2>
          <p className="text-gray-500 text-sm mb-6">
            Pick a role, answer real interview questions, get instant feedback.
          </p>
          <button className="bg-emerald-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
            Start interview
          </button>
        </div>
      </div>
    </main>
  )
}
