import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def analyze_answer(question, answer):

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""
You are a strict technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Classify the answer into ONE:

- STRONG
- PARTIAL
- WEAK
- IRRELEVANT

Also provide a short reason.

Return ONLY valid JSON:
{{
  "classification": "",
  "reason": ""
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except:
        return {
            "classification": "PARTIAL",
            "reason": "Parsing failed"
        }