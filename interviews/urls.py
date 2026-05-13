from django.urls import path
from .views import start_interview, generate_question, interview_summary, submit_audio_answer, interview_step, interview_history, current_question

urlpatterns = [
    path('start/', start_interview),
    path('generate-question/', generate_question),
    path('summary/<int:session_id>/', interview_summary),
    path('submit-audio-answer/', submit_audio_answer),
    path('interview-step/', interview_step),
    path('history/', interview_history),
    path('current-question/<int:session_id>/',current_question),
]