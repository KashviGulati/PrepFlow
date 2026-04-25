from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import InterviewSession, Question, Answer
from .serializers import InterviewSessionSerializer, QuestionSerializer, AnswerSerializer
import random
from django.contrib.auth.models import User
from .evaluator import evaluate_answer
from django.db.models import Avg
from ai_engine.llm_service import generate_question as generate_ai_question

@api_view(['POST'])
def start_interview(request):

    user = User.objects.first()

    domain = request.data.get('domain')

    interview = InterviewSession.objects.create(
        user=user,
        domain=domain
    )

    serializer = InterviewSessionSerializer(interview)

    return Response(serializer.data)

@api_view(['POST'])
def generate_question(request):

    session_id = request.data.get('session_id')

    session = InterviewSession.objects.get(id=session_id)

    selected_question = generate_ai_question(session.domain)

    question = Question.objects.create(
        session=session,
        question_text=selected_question
    )

    session.current_question_number += 1
    session.save()

    serializer = QuestionSerializer(question)

    return Response(serializer.data)


@api_view(['POST'])
def submit_answer(request):

    question_id = request.data.get('question_id')
    answer_text = request.data.get('answer_text')

    question = Question.objects.get(id=question_id)

    evaluation = evaluate_answer(
        question.question_text,
        answer_text
    )

    answer = Answer.objects.create(
        question=question,
        answer_text=answer_text,
        semantic_score=evaluation['semantic_score'],
        confidence_score=evaluation['confidence_score'],
        filler_word_count=evaluation['filler_count'],
        vocabulary_score=evaluation['vocabulary_score'],
        technical_score=evaluation['technical_score'],
        feedback=evaluation['feedback']
    )

    session = question.session
    if session.current_question_number >= session.total_questions:
        session.completed = True
        session.save()

    serializer = AnswerSerializer(answer)

    return Response(serializer.data)


@api_view(['GET'])
def interview_summary(request, session_id):

    session = InterviewSession.objects.get(id=session_id)

    questions = Question.objects.filter(session=session)

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
        "completed": session.completed,
        "questions_answered": answers.count(),
        "average_semantic_score": avg_semantic,
        "average_confidence_score": avg_confidence,
        "average_vocabulary_score": avg_vocab,
        "average_technical_score": avg_technical
    })