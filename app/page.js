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

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #1f1f2e, #0a0a0f)",
      color: "white",
      padding: "40px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "40px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 60px rgba(0,0,0,0.6)"
      }}>
        {/* HEADER */}
        <h1 style={{
          textAlign: "center",
          fontSize: "38px",
          fontWeight: "bold",
          background: "linear-gradient(90deg,#7b2ff7,#f107a3)",
          WebkitBackgroundClip: "text",
          color: "transparent"
        }}>
          🚀 Explain My Plan
        </h1>

        <p style={{
          textAlign: "center",
          color: "#aaa",
          marginTop: "10px"
        }}>
          Turn messy ideas into structured execution plans instantly
        </p>

        {/* INPUT */}
        <textarea
          rows={4}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.1)",
            marginTop: "25px",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: "15px",
            outline: "none"
          }}
          placeholder="e.g. I want to build a fitness body in 3 months and stay consistent..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={analyze}
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            background: "linear-gradient(90deg,#7b2ff7,#f107a3)",
            border: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.3s"
          }}
        >
          {loading ? "Analyzing..." : "✨ Structure My Plan"}
        </button>

        {/* OUTPUT */}
        {data && (
          <div style={{
            marginTop: "30px",
            display: "grid",
            gap: "15px"
          }}>
            <Card title="🎯 Goal" content={data.goal} />
            <Card title="🛠 Strategy" content={data.approach} />
            <Card title="📋 Execution Steps" list={data.steps} />
            <Card title="⚠ Missing Elements" list={data.missing} />
            <Card title="✨ Simplified Plan" content={data.simplified} />

            {/* SCORE */}
            <div style={{
              padding: "20px",
              borderRadius: "14px",
              background: "linear-gradient(90deg,#1e1e2f,#2a2a40)",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(123,47,247,0.4)"
            }}>
              <h2 style={{ fontSize: "26px" }}>
                📊 Clarity Score: {data.score}/100
              </h2>
              <p style={{ color: "#aaa" }}>
                Higher score = better clarity & execution readiness
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Card({ title, content, list }) {
  return (
    <div style={{
      padding: "18px",
      borderRadius: "14px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      transition: "0.3s"
    }}>
      <h3 style={{ marginBottom: "8px" }}>{title}</h3>

      {content && <p style={{ color: "#ddd" }}>{content}</p>}

      {list && (
        <ul style={{ paddingLeft: "20px", color: "#ccc" }}>
          {list.map((item, i) => (
            <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}