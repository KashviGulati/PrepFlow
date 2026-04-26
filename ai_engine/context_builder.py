from interviews.models import Question, Answer


def build_interview_context(session):

    questions = Question.objects.filter(
        session=session
    ).order_by('created_at')

    context = ""

    for question in questions:

        context += f"\nQuestion: {question.question_text}\n"

        answer = Answer.objects.filter(
            question=question
        ).first()

        if answer:
            context += f"Answer: {answer.answer_text}\n"

    return context