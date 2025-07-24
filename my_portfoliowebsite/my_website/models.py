from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class HomeView(models.Model):
    # Define your fields here
    title = models.CharField(max_length=200)
    designation=models.CharField(max_length=100)
    description = models.TextField()
    video = models.FileField(upload_to='videos/')  # Add this
    def __str__(self):
        return self.title


class AboutView(models.Model):
    # Define your fields here
    title = models.CharField(max_length=100)
    description1 = models.TextField()
    description2 = models.TextField()
    projectcount = models.IntegerField(default=0)
    experience = models.IntegerField(default=0)
    client_satisfaction = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class ServiceView(models.Model):
    # Define your fields here
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_class  = models.CharField(max_length=100)  # Assuming you use Font Awesome icons

    def __str__(self):
        return self.title
    
class SkillsView(models.Model):
    CATEGORY_CHOICES = [
        ('Frontend Development', 'Frontend Development'),
        ('Tools & Technologies', 'Tools & Technologies'),
    ]

    skill_name = models.CharField(max_length=100)
    skill_percentage = models.IntegerField(default=0)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.skill_name} ({self.category})"


# Create your models here.

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
