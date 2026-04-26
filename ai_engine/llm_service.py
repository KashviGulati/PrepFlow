import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_question(domain, resume_text=None):

    prompt = f"""
    You are a professional interviewer.

    Generate ONE realistic interview question for a {domain} candidate.
    """

    if resume_text:

        prompt += f"""

        Candidate Resume Context:

        {resume_text[:3000]}

        Ask a question specifically related to their projects,
        internships, skills, or technical decisions.
        """

    try:

        response = model.generate_content(prompt)

        return response.text.strip()

    except Exception:

        fallback_questions = {
            "software_engineer": [
                "Explain OOP principles.",
                "Difference between stack and queue.",
                "Explain REST API."
            ],

            "data_analyst": [
                "Explain SQL joins.",
                "Difference between mean and median.",
                "What is normalization?"
            ]
        }

        return fallback_questions.get(
            domain,
            ["Tell me about yourself."]
        )[0]