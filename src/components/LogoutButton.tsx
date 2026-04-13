"use client"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      Log out
    </button>
  )
}
