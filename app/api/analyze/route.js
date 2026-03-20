import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// 🔥 Clarity Score Logic
function calculateScore(input) {
  let score = 0

  if (input.length > 10) score += 20
  if (input.split(" ").length > 5) score += 20
  if (input.toLowerCase().includes("how") || input.toLowerCase().includes("plan")) score += 20
  if (input.toLowerCase().includes("time") || input.toLowerCase().includes("daily")) score += 20
  if (input.toLowerCase().includes("money") || input.toLowerCase().includes("resources")) score += 20

  return score
}

export async function POST(req) {
  const { rawInput } = await req.json()

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    })

    const prompt = `
Analyze this idea:
"${rawInput}"

Return ONLY JSON:

{
  "goal": "",
  "approach": "",
  "steps": [],
  "missing": [],
  "simplified": "",
  "score": 0
}
`

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })

    const response = await result.response
    let text = response.text()

    console.log("RAW:", text)

    text = text.replace(/```json|```/g, "").trim()

    let parsed

    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = {
        goal: rawInput,
        approach: text,
        steps: ["Try refining your idea"],
        missing: ["AI returned invalid format"],
        simplified: rawInput,
        score: calculateScore(rawInput)
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (error) {
    console.log("API FAILED:", error.message)

    // 💥 FALLBACK (with clarity score)
    const fallback = {
      goal: rawInput,
      approach: "AI unavailable (quota/API issue)",
      steps: [
        "Define your goal clearly",
        "Break into actionable steps",
        "Start execution"
      ],
      missing: ["Detailed AI insights unavailable"],
      simplified: rawInput,
      score: calculateScore(rawInput)
    }

    return new Response(JSON.stringify(fallback), {
      headers: { "Content-Type": "application/json" }
    })
  }
}