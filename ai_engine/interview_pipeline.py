from interviews.models import Answer, Question
from ai_engine.answer_evaluator import evaluate_answer_ai
from interviews.evaluator import evaluate_answer
from ai_engine.interviewer_brain import analyze_answer
from ai_engine.llm_service import generate_question
from ai_engine.context_builder import build_interview_context
from ai_engine.followups.followup_manager import should_followup


def run_interview_pipeline(question, answer_text):

    session = question.session

    # ----------------------------
    # Evaluate Answer
    # ----------------------------

    try:

        evaluation = evaluate_answer_ai(
            question.question_text,
            answer_text
        )

        filler_count = 0

    except:

        evaluation = evaluate_answer(
            question.question_text,
            answer_text
        )

        filler_count = evaluation.get(
            'filler_count',
            0
        )

    answer = Answer.objects.create(
        question=question,
        answer_text=answer_text,

        semantic_score=0,
        confidence_score=0,
        technical_score=0,
        vocabulary_score=0,

        filler_word_count=filler_count,

        feedback=evaluation.get(
            'feedback',
            ''
        )
    )

    # ----------------------------
    # Analyze Strength
    # ----------------------------

    decision_data = analyze_answer(
        question.question_text,
        answer_text
    )

    classification = decision_data.get(
        "classification"
    )

    followup_required = should_followup(
        classification
    )

    decision = f"""
Classification: {classification}

Reason:
{decision_data.get("reason")}

Followup Required:
{followup_required}
"""

    # ----------------------------
    # Interview Completion
    # ----------------------------

    if session.current_question_number >= session.total_questions:

        session.completed = True
        session.save()

        return {
            "completed": True,
            "evaluation": evaluation
        }

    # ----------------------------
    # Generate Next Question
    # ----------------------------

    resume_text = None

    if session.resume:
        resume_text = session.resume.extracted_text

    history = build_interview_context(
        session
    )

    next_question_text = generate_question(
        session.domain,
        resume_text,
        history,
        session.difficulty_mode,
        decision
    )

    next_question = Question.objects.create(
        session=session,
        question_text=next_question_text,
        ai_model_used="groq"
    )

    session.current_question_number += 1
    session.save()

    return {
        "completed": False,
        "evaluation": evaluation,
        "next_question": next_question
    }