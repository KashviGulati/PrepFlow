import re


def evaluate_answer(question, answer):

    filler_words = ['um', 'uh', 'like', 'basically', 'actually']

    filler_count = 0

    answer_lower = answer.lower()

    for word in filler_words:
        filler_count += answer_lower.count(word)

    semantic_score = min(len(answer.split()) / 5, 10)

    confidence_score = max(10 - filler_count, 1)

    vocabulary_score = min(len(set(answer.split())) / 3, 10)

    technical_score = semantic_score

    feedback = []

    if filler_count > 3:
        feedback.append("Too many filler words.")

    if semantic_score < 5:
        feedback.append("Answer lacks depth.")

    if vocabulary_score < 4:
        feedback.append("Try stronger vocabulary.")

    if not feedback:
        feedback.append("Good response.")

    return {
        "semantic_score": semantic_score,
        "confidence_score": confidence_score,
        "vocabulary_score": vocabulary_score,
        "technical_score": technical_score,
        "filler_count": filler_count,
        "feedback": " ".join(feedback)
    }