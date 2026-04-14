"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-emerald-600 text-lg">
        PrepAI
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-medium text-emerald-700">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              {session.user.name?.split(" ")[0]}
              <ChevronDown size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-sm py-1 z-50">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
