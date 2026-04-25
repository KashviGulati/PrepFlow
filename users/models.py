from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    target_role = models.CharField(max_length=100)

    experience_level = models.CharField(
        max_length=20,
        choices=EXPERIENCE_LEVELS
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username