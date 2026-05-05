from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Avg
from ai_engine.interviewer_brain import analyze_answer
from .models import InterviewSession, Question, Answer
from .serializers import (
    InterviewSessionSerializer,
    QuestionSerializer,
    AnswerSerializer
)
import os
from .evaluator import evaluate_answer
from ai_engine.llm_service import generate_question as generate_ai_question
from ai_engine.answer_evaluator import evaluate_answer_ai
from resumes.models import Resume

from ai_engine.audio_transcriber import transcribe_audio
from ai_engine.context_builder import build_interview_context

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


def generate_final_feedback(answers):

    combined = "\n\n".join([
        f"Q: {a.question.question_text}\nA: {a.answer_text}\nFeedback: {a.feedback}"
        for a in answers
    ])

    from groq import Groq
    import os

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""
You are a senior interviewer reviewing a full interview.

Here are all answers:

{combined}

Generate a FINAL INTERVIEW REPORT:

1. Overall Performance Summary
2. Key Strengths
3. Key Weaknesses
4. Communication Skills
5. Technical Understanding
6. STAR Usage
7. Final Advice

Do NOT give scores.
Be structured and realistic.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_interview(request):

    user = request.user

    domain = request.data.get('domain')
    resume_id = request.data.get('resume_id')
    difficulty_mode = request.data.get(
        'difficulty_mode',
        'beginner'
    )

    if not domain and resume_id:
        domain = "resume_based"

    resume = None

    if resume_id:
        try:
            resume = Resume.objects.get(
                id=resume_id,
                user=request.user
            ) 
        except Resume.DoesNotExist:
            return Response({
                "error": "Resume not found"
            }, status=404)

    interview = InterviewSession.objects.create(
        user=user,
        domain=domain,
        resume=resume,
        difficulty_mode=difficulty_mode
    )

    resume_text = None

    if resume:
        resume_text = resume.extracted_text

    first_question = generate_ai_question(
        interview.domain,
        resume_text,
        None,
        interview.difficulty_mode
    )

    Question.objects.create(
        session=interview,
        question_text=first_question,
        ai_model_used="groq"
    )

    interview.current_question_number = 1
    interview.save()

    serializer = InterviewSessionSerializer(interview)

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_question(request):

    session_id = request.data.get('session_id')

    try:
        session = InterviewSession.objects.get(
            id=session_id,
            user=request.user
        )
    except InterviewSession.DoesNotExist:

        return Response({
            "error": "Interview session not found"
        }, status=404)

    resume_text = None

    if session.resume:
        resume_text = session.resume.extracted_text

    history = build_interview_context(session)

    selected_question = generate_ai_question(
        session.domain,
        resume_text,
        history,
        session.difficulty_mode
    )

    question = Question.objects.create(
        session=session,
        question_text=selected_question,
        ai_model_used="gemini-2.5-flash"
    )

    session.current_question_number += 1
    session.save()

    serializer = QuestionSerializer(question)

    return Response(serializer.data)


@api_view(['GET'])
def current_question(request, session_id):

    session = InterviewSession.objects.get(id=session_id)

    question = Question.objects.filter(
        session=session
    ).order_by('-created_at').first()

    if not question:

        return Response({
            "error": "No question found yet"
        }, status=404)

    return Response({
        "id": question.id,
        "question_text": question.question_text
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):

    question_id = request.data.get('question_id')
    answer_text = request.data.get('answer_text')

    try:
        question = Question.objects.get(
            id=question_id,
            session__user=request.user
        )
    except Question.DoesNotExist:

        return Response({
            "error": "Question not found"
        }, status=404)

    try:

        evaluation = evaluate_answer_ai(
            question.question_text,
            answer_text
        )

        filler_count = 0
        vocabulary_score = 0

    except:

        evaluation = evaluate_answer(
            question.question_text,
            answer_text
        )

        filler_count = evaluation.get('filler_count', 0)
        vocabulary_score = evaluation.get('vocabulary_score', 0)

    answer = Answer.objects.create(
    question=question,
    answer_text=answer_text,

    # keep these as placeholders (or remove later)
    semantic_score=0,
    confidence_score=0,
    technical_score=0,
    vocabulary_score=0,

    filler_word_count=filler_count,

    # THIS is what matters now
    feedback=evaluation.get('feedback', '')
)

    session = question.session

    if session.current_question_number >= session.total_questions:
        session.completed = True
        session.save()

    serializer = AnswerSerializer(answer)

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_summary(request, session_id):

    try:
        session = InterviewSession.objects.get(
            id=session_id,
            user=request.user
        )
    except InterviewSession.DoesNotExist:

        return Response({
            "error": "Interview session not found"
        }, status=404)

    answers = Answer.objects.filter(
        question__session=session
    )

    final_feedback = generate_final_feedback(answers)

    return Response({
        "session_id": session.id,
        "domain": session.domain,
        "completed": session.completed,
        "questions_answered": answers.count(),
        "final_feedback": final_feedback
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_audio_answer(request):

    question_id = request.data.get('question_id')

    audio_file = request.FILES.get('audio')

    if not audio_file:

        return Response({
            "error": "No audio uploaded"
        }, status=400)

    question = Question.objects.get(
        id=question_id,
        session__user=request.user
    )
    temp_dir = "media/temp"

    os.makedirs(temp_dir, exist_ok=True)

    temp_path = os.path.join(
        temp_dir,
        audio_file.name
    )
    with open(temp_path, 'wb+') as destination:

        for chunk in audio_file.chunks():

            destination.write(chunk)

    transcribed_text = transcribe_audio(temp_path)

    request._full_data = {
        "question_id": question_id,
        "answer_text": transcribed_text
    }

    return submit_answer(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def interview_step(request):

    question_id = request.data.get('question_id')
    answer_text = request.data.get('answer_text')

    try:
        question = Question.objects.get(
            id=question_id,
            session__user=request.user
        )
    except Question.DoesNotExist:

        return Response({
            "error": "Question not found"
        }, status=404)

    session = question.session

    # ---- Evaluate Answer ----

    try:

        evaluation = evaluate_answer_ai(
            question.question_text,
            answer_text
        )

        filler_count = 0
        vocabulary_score = 0

    except:

        evaluation = evaluate_answer(
            question.question_text,
            answer_text
        )

        filler_count = evaluation.get('filler_count', 0)
        vocabulary_score = evaluation.get('vocabulary_score', 0)

    answer = Answer.objects.create(
    question=question,
    answer_text=answer_text,

    # keep these as placeholders (or remove later)
    semantic_score=0,
    confidence_score=0,
    technical_score=0,
    vocabulary_score=0,

    filler_word_count=filler_count,

    # THIS is what matters now
    feedback=evaluation.get('feedback', '')
)

    # ---- Interview Decision (NEW) ----

    decision_data = analyze_answer(
        question.question_text,
        answer_text
    )

    decision = f"""
    Classification: {decision_data.get("classification")}
    Reason: {decision_data.get("reason")}
"""
    # ---- Interview Complete? ----

    if session.current_question_number >= session.total_questions:

        session.completed = True
        session.save()

        return Response({
            "message": "Interview completed",
            "answer_feedback": evaluation,
            "interview_completed": True
        })

    # ---- Generate Next Question ----

    resume_text = None

    if session.resume:
        resume_text = session.resume.extracted_text

    history = build_interview_context(session)

    selected_question = generate_ai_question(
        session.domain,
        resume_text,
        history,
        session.difficulty_mode,
        decision
    )

    next_question = Question.objects.create(
        session=session,
        question_text=selected_question,
        ai_model_used="gemini-2.5-flash"
    )

    session.current_question_number += 1
    session.save()

    return Response({
        "interview_completed": False,
        "answer_feedback": evaluation,
        "next_question": QuestionSerializer(next_question).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_history(request):

    sessions = InterviewSession.objects.filter(
        user=request.user
    ).order_by('-started_at')

    data = []

    for session in sessions:

        data.append({
            "id": session.id,
            "domain": session.domain,
            "started_at": session.started_at,
            "completed": session.completed
        })

    return Response(data)