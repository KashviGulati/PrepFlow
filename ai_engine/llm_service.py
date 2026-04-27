import os
import random
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_question(domain, resume_text=None, history=None):

    history_text = history if history else "No previous questions"

    prompt = f"""
You are a strict technical interviewer.

Generate EXACTLY ONE interview question.

Interview Domain:
{domain}

Previous Questions And Answers:
{history_text}

Resume Context:
{resume_text if resume_text else "None"}

VERY IMPORTANT RULES:

- NEVER repeat any previous question.
- NEVER ask about the same topic twice.
- If OOP was already asked, do NOT ask OOP again.
- Ask a completely different technical concept.
- Generate only ONE question.
- Return ONLY plain question text.
- Do not add bullets.
- Do not add explanation.
- Do not add numbering.
- Avoid generic questions.
- Ask progressively different questions.
- Keep question realistic and interview-level.

Generate the next unique question now.
"""

    try:

        print("===== INTERVIEW HISTORY =====")
        print(history_text)
        print("=============================")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",           messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        question = response.choices[0].message.content.strip()

        question = (
            question
            .replace("*", "")
            .replace('"', '')
            .strip()
        )

        return question

    except Exception as e:

        print("Groq Error:", e)

        fallback_questions = {
            "software_engineer": [
                "Explain REST API.",
                "What is database indexing?",
                "Difference between process and thread.",
                "What is dependency injection?",
                "Explain multithreading."
            ],

            "data_analyst": [
                "Explain SQL joins.",
                "What is normalization?",
                "Difference between mean and median.",
                "What is a primary key?",
                "Explain data cleaning."
            ],

            "machine_learning": [
                "What is overfitting?",
                "Difference between supervised and unsupervised learning.",
                "Explain bias vs variance.",
                "What is gradient descent?",
                "Explain confusion matrix."
            ]
        }

        questions = fallback_questions.get(
            domain,
            ["Tell me about yourself."]
        )

        used_questions = history.lower() if history else ""

        available = [
            q for q in questions
            if q.lower() not in used_questions
        ]

        if available:
            return random.choice(available)

        return random.choice(questions)