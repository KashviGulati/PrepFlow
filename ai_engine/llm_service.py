import os
import random
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_question(
    domain,
    resume_text=None,
    history=None,
    difficulty_mode="beginner"
):
    history_text = history if history else "No previous questions"

    prompt = f"""
You are an experienced technical interviewer conducting a realistic mock interview.

Interview Difficulty:
{difficulty_mode}

Interview Type:
{"Resume-Based Interview" if resume_text else "Domain-Based Interview"}

Interview Domain:
{domain}

Resume Content:
{resume_text if resume_text else "None"}

Previous Questions And Answers:
{history_text}

STRICT INTERVIEW RULES:

- Ask EXACTLY ONE question.
- NEVER repeat previous questions.
- NEVER ask the same concept twice.
- Return ONLY the question text.
- No bullets.
- No numbering.
- No explanation.

IMPORTANT:

If Resume Exists:
- Prioritize resume content heavily.
- Questions MUST come directly from projects, skills, frameworks, tools, internships, and technologies mentioned in the resume.
- Ask questions as if interviewer is reading the resume live.
- Do NOT ask generic theoretical questions initially.
- First questions should help candidate talk about experience.

QUESTION PROGRESSION:

Question 1:
- Ask simple introductory resume/project question.
- Ask about one project or skill from resume.
- Example:
  "Can you explain the project where you used Flask and what your role was?"

Question 2:
- Ask about implementation details.
- Ask how something was built.
- Ask tool usage.

Question 3:
- Ask debugging/problem-solving question related to resume.

Question 4:
- Ask optimization/scaling/performance question.

Question 5+:
- Ask deeper architecture or edge-case questions.

AVOID:

- Architecture questions too early.
- System design questions in first 2 questions.
- Multi-part questions.
- Very long questions.
- Broad textbook questions.
- Asking multiple concepts together.

Question Style:
- Natural interviewer tone.
- Short.
- Realistic.
- Resume-driven.
- One concept at a time.

Generate the next interview question now.
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