from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_answer(question, answer):

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

Also provide:
- 1 line reason

Return JSON:
{{
  "classification": "",
  "reason": ""
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content