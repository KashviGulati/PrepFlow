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
You are a strict technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Evaluate strictly.

Return ONLY JSON:

{{
    "semantic_score": number,
    "technical_score": number,
    "confidence_score": number,
    "vocabulary_score": number,
    "feedback": "short explanation"
}}
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

        parsed = json.loads(cleaned)
        print("RAW GROQ RESPONSE:")
        print(raw)

        return {
            "semantic_score": parsed.get("semantic_score", 0),
            "technical_score": parsed.get("technical_score", 0),
            "confidence_score": parsed.get("confidence_score", 0),
            "vocabulary_score": parsed.get("vocabulary_score", 0),
            "feedback": parsed.get("feedback", "")
        }

    except Exception as e:

        print("Groq Eval Error:", e)

        return {
            "semantic_score": 0,
            "technical_score": 0,
            "confidence_score": 0,
            "vocabulary_score": 0,
            "feedback": "Evaluation unavailable."
        }