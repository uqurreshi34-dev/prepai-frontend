"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Status() {
  const [status, setStatus] = useState<string>("checking...")

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health/`)
      .then(res => setStatus(res.data.status === "ok" ? "Backend connected" : "unexpected response"))
      .catch(() => setStatus("Backend unreachable"))
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">API status</p>
        <p className="text-2xl font-semibold text-gray-900">{status}</p>
        <p className="text-xs text-gray-400 mt-2">{process.env.NEXT_PUBLIC_API_URL}</p>
      </div>
    </main>
  )
}
