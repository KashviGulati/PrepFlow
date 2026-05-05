import re


def evaluate_answer(question, answer):

    filler_words = ['um', 'uh', 'like', 'basically', 'actually']

    answer_lower = answer.lower()

    filler_count = sum(answer_lower.count(word) for word in filler_words)

    word_count = len(answer.split())

    unique_words = len(set(answer.split()))

    # ---- Basic signal extraction ----

    confidence_level = "Low"
    if filler_count <= 1:
        confidence_level = "High"
    elif filler_count <= 3:
        confidence_level = "Moderate"

    articulation = "Weak"
    if word_count > 30:
        articulation = "Good"
    elif word_count > 15:
        articulation = "Moderate"

    vocabulary = "Basic"
    if unique_words > 20:
        vocabulary = "Strong"
    elif unique_words > 10:
        vocabulary = "Moderate"

    # ---- Structured feedback ----

    feedback = f"""
Strengths:
- Attempted to answer the question

Areas for Improvement:
- Answer lacks depth and detail
- Provide more specific examples

Communication Feedback:
- Confidence: {confidence_level}
- Articulation: {articulation}
- Vocabulary: {vocabulary}

STAR Analysis:
- Situation: Not clearly described
- Task: Missing
- Action: Not explained
- Result: Not mentioned

Final Advice:
- Structure your answers using the STAR method
- Add concrete examples from your experience
"""

    return {
        "filler_count": filler_count,
        "confidence_level": confidence_level,
        "articulation": articulation,
        "vocabulary_level": vocabulary,
        "feedback": feedback.strip()
    }