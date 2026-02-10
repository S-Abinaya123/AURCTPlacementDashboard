export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function extractJSON(text: string) {
  const match = text.match(/<json>([\s\S]*?)<\/json>/);
  if (!match) throw new Error("JSON wrapper not found");
  return JSON.parse(match[1]);
}

export async function generateMCQ(topic: string): Promise<Question[]> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            temperature: 0.35,
            max_tokens: 900,
            messages: [
              {
                role: "system",
                content:
                  "You generate MCQs strictly by topic. Never mix domains.",
              },
              {
                role: "user",
                content: `
Generate EXACTLY 10 MCQ questions ONLY from this topic:
"${topic}"

STRICT RULES:
- Questions must belong ONLY to the topic
- Never mix domains
- No explanations
- No markdown
- Exactly 4 options
- correctAnswer must match one option

PROGRAMMING TOPICS (Python, C, C++, Java, JavaScript, etc):
- MUST include code-based questions
- Include output prediction, error detection, syntax
- Code may appear in question or options
- Use \\n for line breaks in code

NON-PROGRAMMING TOPICS:
- NO code
- ONLY aptitude / logic / math / verbal

?? VERY IMPORTANT:
Wrap the FINAL JSON strictly inside <json> and </json> tags.
Do NOT put anything outside these tags.

FORMAT:
<json>
{
  "questions": [
    {
      "question": "text",
      "options": ["A","B","C","D"],
      "correctAnswer": "A"
    }
  ]
}
</json>
`
              }
            ],
          }),
        }
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response");

      const parsed = extractJSON(content);
      return parsed.questions;
    } catch (err) {
      if (attempt === 3) {
        throw new Error("Failed to generate quiz");
      }
    }
  }

  throw new Error("Failed to generate quiz");
}
