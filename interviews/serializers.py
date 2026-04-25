from rest_framework import serializers
from .models import InterviewSession, Question


class InterviewSessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewSession
        fields = '__all__'

from .models import Question, Answer


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = '__all__'