import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_question(domain):

    prompt = f"""
    You are a professional interviewer.

    Generate ONE realistic interview question for a {domain} candidate.

    Keep it concise.
    """

    response = model.generate_content(prompt)

    return response.text.strip()