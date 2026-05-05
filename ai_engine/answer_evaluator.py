import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def evaluate_answer_ai(question, answer):

    prompt = f"""
You are a senior technical interviewer conducting a real interview.

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer like a real interviewer.

Do NOT give scores.
Do NOT return numbers.
Do NOT return JSON.

Return ONLY structured feedback in this format:

Strengths:
- ...

Areas for Improvement:
- ...

Communication Feedback:
- Comment on confidence, clarity, articulation

STAR Analysis:
- Situation: ...
- Task: ...
- Action: ...
- Result: ...

Final Advice:
- ...

Tone Rules:
- Be constructive, not harsh
- Do NOT insult the candidate
- Be realistic and specific
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        raw = response.choices[0].message.content.strip()

        cleaned = (
            raw
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        print("RAW GROQ RESPONSE:")
        print(raw)

        return {
            "feedback": raw
    }

    except Exception as e:

        print("Groq Eval Error:", e)

        return {
    "feedback": "Evaluation unavailable."
}