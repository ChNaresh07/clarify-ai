import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function calculateScore(input) {
  let score = 0
  if (input.length > 20) score += 30
  if (input.split(" ").length > 8) score += 30
  if (input.toLowerCase().includes("plan") || input.toLowerCase().includes("goal")) score += 20
  if (input.toLowerCase().includes("month") || input.toLowerCase().includes("time")) score += 20
  return score
}

export async function POST(req) {
  try {
    const { rawInput } = await req.json()

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const prompt = `
Return ONLY JSON.

Idea: "${rawInput}"

{
  "goal": "",
  "approach": "",
  "steps": ["", "", ""],
  "missing": ["", "", ""],
  "simplified": "",
  "score": 0
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    text = text.replace(/```json|```/g, "").trim()

    let parsed

    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = {
        goal: rawInput,
        approach: "AI formatting issue",
        steps: ["Retry"],
        missing: [],
        simplified: rawInput,
        score: calculateScore(rawInput)
      }
    }

    if (!parsed.score) {
      parsed.score = calculateScore(rawInput)
    }

    return Response.json(parsed)

  } catch {
    return Response.json({
      goal: "Fallback",
      approach: "AI unavailable",
      steps: ["Try again"],
      missing: ["API issue"],
      simplified: "Fallback mode",
      score: 60
    })
  }
}