from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import InterviewSession
from .serializers import InterviewSessionSerializer
from django.contrib.auth.models import User


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