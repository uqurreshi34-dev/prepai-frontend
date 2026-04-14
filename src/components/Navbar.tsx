"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, LayoutDashboard, User, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isOnDarkPage = pathname === "/"

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navBg = scrolled
    ? "rgba(255,255,255,0.92)"
    : isOnDarkPage
    ? "rgba(10,15,13,0.7)"
    : "rgba(255,255,255,0.92)"

  const navBorder = scrolled
    ? "rgba(0,0,0,0.08)"
    : isOnDarkPage
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.08)"

  const logoColor = isOnDarkPage && !scrolled ? "#34d399" : "#059669"
  const textColor = isOnDarkPage && !scrolled ? "#d1d5db" : "#374151"
  const textHoverColor = isOnDarkPage && !scrolled ? "#f9fafb" : "#111827"

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300"
      style={{
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg transition-colors"
        style={{ color: logoColor }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L9.5 5.5H13L10.5 8.5L11.5 13L7 10.5L2.5 13L3.5 8.5L1 5.5H4.5L7 1Z" fill="white" fillOpacity="0.95"/>
          </svg>
        </div>
        PrepAI
      </Link>

      <div className="flex items-center gap-3">
        {session ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 text-sm font-medium transition-all cursor-pointer px-3 py-1.5 rounded-xl"
              style={{
                color: textColor,
                background: menuOpen ? "rgba(5,150,105,0.08)" : "transparent",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
              >
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span>{session.user.name?.split(" ")[0]}</span>
              <motion.div
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={13} />
              </motion.div>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl py-1.5 z-50"
                  style={{
                    background: "rgba(255,255,255,0.98)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)"
                  }}
                >
                  <div className="px-4 py-2 mb-1">
                    <p className="text-xs font-medium text-gray-900 truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "0 12px 6px" }} />
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard size={14} className="text-gray-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={14} className="text-gray-400" />
                    Profile
                  </Link>
                  <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "6px 12px" }} />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium transition-colors px-3 py-1.5 rounded-lg"
              style={{ color: textColor }}
              onMouseEnter={e => (e.currentTarget.style.color = textHoverColor)}
              onMouseLeave={e => (e.currentTarget.style.color = textColor)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "white",
                boxShadow: "0 2px 8px rgba(5,150,105,0.35)"
              }}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
