from django.urls import path
from .views import start_interview

urlpatterns = [
    path('start/', start_interview),
]