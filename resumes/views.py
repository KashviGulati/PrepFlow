from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Resume
from .serializers import ResumeSerializer
from .parser import extract_text_from_pdf
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume(request):

    user = request.user

    uploaded_file = request.FILES.get('file')

    resume = Resume.objects.create(
        user=user,
        file=uploaded_file
    )

    extracted_text = extract_text_from_pdf(
        resume.file.path
    )

    resume.extracted_text = extracted_text
    resume.save()

    serializer = ResumeSerializer(resume)

    return Response(serializer.data)