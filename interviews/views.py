from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import InterviewSession, Question, Answer
from .serializers import InterviewSessionSerializer, QuestionSerializer, AnswerSerializer
import random
from django.contrib.auth.models import User
from .evaluator import evaluate_answer

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

    question_bank = {
        'software_engineer': [
            'Explain OOP principles.',
            'What is polymorphism?',
            'Explain REST API.',
            'Difference between stack and queue.',
        ],

        'data_analyst': [
            'Explain SQL joins.',
            'Difference between mean and median.',
            'Explain normalization.',
            'What is a KPI?',
        ]
    }

    questions = question_bank.get(session.domain, [])

    selected_question = random.choice(questions)

    question = Question.objects.create(
        session=session,
        question_text=selected_question
    )

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

    serializer = AnswerSerializer(answer)

    return Response(serializer.data)