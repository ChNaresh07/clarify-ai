"use client"
import { useState } from "react"

export default function Home() {
  const [input, setInput] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!input) return
    setLoading(true)

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ rawInput: input })
    })

    const result = await res.json()
    setData(result)
    setLoading(false)
  }

  const getColor = (score) => {
    if (score >= 80) return "#00ff99"
    if (score >= 50) return "#ffaa00"
    return "#ff4d4d"
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      color: "white",
      padding: "30px",
      fontFamily: "Segoe UI"
    }}>

      <div style={{ maxWidth: "900px", margin: "auto" }}>

        {/* HEADER */}
        <h1 style={{ fontSize: "40px", fontWeight: "bold" }}>
          🚀 Explain My Plan
        </h1>
        <p style={{ color: "#94a3b8" }}>
          Turn messy ideas into structured execution instantly
        </p>

        {/* INPUT BOX */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          padding: "20px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          marginTop: "20px"
        }}>
          <textarea
            placeholder="Type your idea..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              background: "#0f172a",
              color: "white"
            }}
          />

          <button
            onClick={analyze}
            style={{
              marginTop: "10px",
              padding: "12px",
              width: "100%",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "🤖 AI is thinking..." : "✨ Structure My Plan"}
          </button>
        </div>

        {/* SUGGESTIONS */}
        <div style={{ marginTop: "15px", color: "#94a3b8" }}>
          Try:
          <div onClick={() => setInput("i want to build muscle in 3 months")} style={{ cursor: "pointer" }}>💪 Fitness Plan</div>
          <div onClick={() => setInput("i want to start freelancing")} style={{ cursor: "pointer" }}>💼 Freelancing</div>
          <div onClick={() => setInput("i want to crack placements")} style={{ cursor: "pointer" }}>📚 Placements</div>
        </div>

        {data && (
          <div style={{ marginTop: "30px" }}>

            {/* TRANSFORMATION */}
            <GlassCard title="🔄 Transformation">
              <p><b>Before:</b> {input}</p>
              <p><b>After:</b> {data.simplified}</p>
            </GlassCard>

            {/* SCORE */}
            <GlassCard title="📊 Clarity Score">
              <h2>{data.score}/100</h2>
              <div style={{
                height: "10px",
                background: "#1e293b",
                borderRadius: "5px"
              }}>
                <div style={{
                  width: `${data.score}%`,
                  background: getColor(data.score),
                  height: "100%",
                  borderRadius: "5px",
                  transition: "0.5s"
                }}></div>
              </div>
            </GlassCard>

            {/* GRID */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "20px"
            }}>

              <GlassCard title="🎯 Goal">{data.goal}</GlassCard>
              <GlassCard title="✨ Simplified">{data.simplified}</GlassCard>
              <GlassCard title="🛠 Strategy">{data.approach}</GlassCard>
              <GlassCard title="⚠ Missing">{data.missing?.join(", ")}</GlassCard>

            </div>

            <GlassCard title="📋 Steps">
              <ul>
                {data.steps?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </GlassCard>

          </div>
        )}
      </div>
    </div>
  )
}

function GlassCard({ title, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      padding: "15px",
      borderRadius: "15px",
      backdropFilter: "blur(10px)",
      marginTop: "15px",
      transition: "0.3s"
    }}>
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      {children}
    </div>
  )
}