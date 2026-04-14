"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mic, BarChart3, Zap } from "lucide-react"

const features = [
  {
    icon: <Mic size={20} className="text-emerald-400" />,
    title: "Voice or text",
    desc: "Answer by speaking or typing. The AI listens, evaluates, and responds instantly.",
  },
  {
    icon: <BarChart3 size={20} className="text-emerald-400" />,
    title: "Real-time scoring",
    desc: "Every answer scored on clarity, relevance, and depth — with one specific tip to improve.",
  },
  {
    icon: <Zap size={20} className="text-emerald-400" />,
    title: "Track your progress",
    desc: "Sessions, streaks, and scores tracked over time so you can see yourself getting better.",
  },
]

function anim(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#0a0f0d" }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(5,150,105,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute",
          top: "10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(5,150,105,0.06) 0%, transparent 70%)",
        }} />
      </div>

      <section className="relative flex flex-col items-center justify-center flex-1 px-6 pt-24 pb-20 text-center">

        <motion.div {...anim(0.1)}>
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free to try — no credit card required
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          style={{ color: "#f0fdf4" }}
          {...anim(0.2)}
        >
          Practice until
          <br />
          <span style={{
            background: "linear-gradient(135deg, #34d399, #059669, #34d399)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            you&apos;re dangerous.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          style={{ color: "#6b7280" }}
          {...anim(0.3)}
        >
          An AI-powered mock interview coach that gives you real-time feedback
          on every answer — so you walk into every interview ready.
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-3 justify-center" {...anim(0.4)}>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-sm transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #059669, #047857)",
              color: "white",
              boxShadow: "0 4px 20px rgba(5, 150, 105, 0.4)"
            }}
          >
            Get started free →
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center font-medium px-7 py-3.5 rounded-xl text-sm transition-all active:scale-[0.98]"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#d1d5db",
              background: "rgba(255,255,255,0.04)"
            }}
          >
            Log in
          </Link>
        </motion.div>

        <motion.p
          className="text-xs mt-6"
          style={{ color: "#4b5563" }}
          {...anim(0.5)}
        >
          3 free sessions per month. No setup needed.
        </motion.p>
      </section>

      <section className="relative px-6 pb-24">
        <div className="max-w-4xl mx-auto">

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#4b5563" }}>
              How it works
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#f0fdf4" }}>
              A real coach, at a fraction of the price
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                className="rounded-2xl p-6 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "#f0fdf4" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            style={{
              background: "linear-gradient(135deg, rgba(5,150,105,0.12), rgba(4,120,87,0.06))",
              border: "1px solid rgba(5,150,105,0.25)",
            }}
          >
            <p className="text-2xl font-bold mb-2" style={{ color: "#f0fdf4" }}>
              Human coaches charge £80–200 per session.
            </p>
            <p className="mb-6" style={{ color: "#6b7280" }}>
              PrepAI gives you the same quality feedback, unlimited practice, for £8/month.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "white",
                boxShadow: "0 4px 16px rgba(5,150,105,0.35)"
              }}
            >
              Start practising free →
            </Link>
          </motion.div>

        </div>
      </section>

      <footer className="border-t px-6 py-6 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-xs" style={{ color: "#374151" }}>
          © 2026 PrepAI. Built to help everyone interview better.
        </p>
      </footer>

    </main>
  )
}
