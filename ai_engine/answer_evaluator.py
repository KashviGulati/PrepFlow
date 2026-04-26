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
        You are a strict technical interviewer.

        Evaluate the candidate answer realistically.

        Question:
        {question}

        Answer:
        {answer}

        Scoring Rules:

        1. Semantic Score (0-10)
        - How relevant is the answer to the question?

        2. Confidence Score (0-10)
        - Does the answer sound confident and clear?

        3. Technical Score (0-10)
        - Does the answer show technical understanding?

        4. Vocabulary Score (0-10)
        - Is the language professional and detailed?

        Important Rules:

        - Very short answers should score extremely low.
        - Generic answers should score extremely low.
        - One-word answers should receive near-zero scores.
        - Do NOT be polite.
        - Be harsh but fair.
        - Penalize weak explanations.
        - Reward detailed reasoning.

        Return ONLY valid JSON.

        Format:

        {{
            "semantic_score": number,
            "confidence_score": number,
            "technical_score": number,
            "vocabulary_score": number,
            "feedback": "short interview feedback"
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