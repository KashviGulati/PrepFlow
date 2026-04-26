from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Avg

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_interview(request):

    user = request.user

    domain = request.data.get('domain')
    resume_id = request.data.get('resume_id')

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
        resume=resume
    )

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
        history
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
        semantic_score=evaluation.get('semantic_score', 0),
        confidence_score=evaluation.get('confidence_score', 0),
        filler_word_count=filler_count,
        vocabulary_score=vocabulary_score,
        technical_score=evaluation.get('technical_score', 0),
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

    avg_semantic = answers.aggregate(
        Avg('semantic_score')
    )['semantic_score__avg']

    avg_confidence = answers.aggregate(
        Avg('confidence_score')
    )['confidence_score__avg']

    avg_vocab = answers.aggregate(
        Avg('vocabulary_score')
    )['vocabulary_score__avg']

    avg_technical = answers.aggregate(
        Avg('technical_score')
    )['technical_score__avg']

    return Response({
        "session_id": session.id,
        "domain": session.domain,
        "resume_used": session.resume.id if session.resume else None,
        "completed": session.completed,
        "questions_answered": answers.count(),
        "average_semantic_score": avg_semantic,
        "average_confidence_score": avg_confidence,
        "average_vocabulary_score": avg_vocab,
        "average_technical_score": avg_technical
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
        semantic_score=evaluation.get('semantic_score', 0),
        confidence_score=evaluation.get('confidence_score', 0),
        filler_word_count=filler_count,
        vocabulary_score=vocabulary_score,
        technical_score=evaluation.get('technical_score', 0),
        feedback=evaluation.get('feedback', '')
    )

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
        history
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