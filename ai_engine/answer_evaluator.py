import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")


def evaluate_answer_ai(question, answer):

    prompt = f"""
    You are a professional interview evaluator.

    Evaluate the candidate's answer.

    Question:
    {question}

    Answer:
    {answer}

    Score the answer from 1–10.

    Return ONLY valid JSON.

    Required JSON format:

    {{
        "semantic_score": number,
        "technical_score": number,
        "confidence_score": number,
        "feedback": "feedback text"
    }}
    """

    try:

        response = model.generate_content(prompt)

        raw_text = response.text.strip()

        cleaned = (
            raw_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(cleaned)

        return {
            "semantic_score": parsed.get("semantic_score", 5),
            "technical_score": parsed.get("technical_score", 5),
            "confidence_score": parsed.get("confidence_score", 5),
            "feedback": parsed.get(
                "feedback",
                "Evaluation completed."
            )
        }

    except Exception:

        return {
            "semantic_score": 5,
            "technical_score": 5,
            "confidence_score": 5,
            "feedback": "AI evaluation unavailable."
        }