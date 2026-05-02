from django.db import models
from django.contrib.auth.models import User


class InterviewSession(models.Model):

    DOMAIN_CHOICES = [
        ('software_engineer', 'Software Engineer'),
        ('data_analyst', 'Data Analyst'),
        ('ml_engineer', 'ML Engineer'),
        ('behavioral', 'Behavioral'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    domain = models.CharField(
        max_length=50,
        choices=DOMAIN_CHOICES
    )

    resume = models.ForeignKey(
        'resumes.Resume',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    difficulty_mode = models.CharField(
        max_length=20,
        default="beginner"
    )

    started_at = models.DateTimeField(auto_now_add=True)

    ended_at = models.DateTimeField(null=True, blank=True)

    overall_score = models.FloatField(default=0)
    total_questions = models.IntegerField(default=5)

    current_question_number = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.domain}"
    
class Question(models.Model):

    session = models.ForeignKey(
        InterviewSession,
        on_delete=models.CASCADE
    )

    question_text = models.TextField()

    difficulty = models.CharField(
        max_length=30,
        default='medium'
    )

    generated_by_ai = models.BooleanField(default=True)

    ai_model_used = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text[:50]

class Answer(models.Model):

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    answer_text = models.TextField()

    semantic_score = models.FloatField(default=0)

    confidence_score = models.FloatField(default=0)

    filler_word_count = models.IntegerField(default=0)

    feedback = models.TextField(blank=True, null=True)
    vocabulary_score = models.FloatField(default=0)
    technical_score = models.FloatField(default=0)
    response_time_seconds = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Answer for {self.question.id}"