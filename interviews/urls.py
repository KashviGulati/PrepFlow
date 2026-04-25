from django.urls import path
from .views import start_interview, generate_question, submit_answer, interview_summary

urlpatterns = [
    path('start/', start_interview),
    path('generate-question/', generate_question),
    path('submit-answer/', submit_answer),
    path('summary/<int:session_id>/', interview_summary),
]