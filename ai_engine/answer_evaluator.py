import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def evaluate_answer_ai(question, answer):

    prompt = f"""
    Evaluate this interview answer.

    Question:
    {question}

    Answer:
    {answer}

    Return JSON only.

    {{
        "semantic_score": number,
        "technical_score": number,
        "confidence_score": number,
        "feedback": "feedback text"
    }}
    """

    response = model.generate_content(prompt)

    cleaned = response.text.replace("```json", "").replace("```", "")

    return json.loads(cleaned)