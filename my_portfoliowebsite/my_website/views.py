from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import TemplateView, ListView, CreateView
from .models import HomeView, AboutView, ServiceView, Contact, SkillsView
from django.urls import reverse_lazy
from django.contrib import messages
from .forms import CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags


class HomePageView(ListView):
    model = HomeView
    template_name = "home.html"
    context_object_name = "homeviews"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["homeviews"] = HomeView.objects.all()
        context["aboutviews"] = AboutView.objects.all()
        context["services"] = ServiceView.objects.all()
        context["contacts"] = Contact.objects.all()
        context["frontend_skills"] = SkillsView.objects.filter(
            category="Frontend Development"
        )
        context["tools_skills"] = SkillsView.objects.filter(
            category="Tools & Technologies"
        )
        return context


class AboutpageView(ListView):
    model = AboutView
    template_name = "about.html"
    context_object_name = "aboutviews"


class ServicePageView(ListView):
    template_name = "services.html"
    model = ServiceView
    context_object_name = "services"


class SkillsPageView(TemplateView):
    template_name = "skills.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["frontend_skills"] = SkillsView.objects.filter(
            category="Frontend Development"
        )
        context["tools_skills"] = SkillsView.objects.filter(
            category="Tools & Technologies"
        )
        return context


class ContactPageView(CreateView):
    template_name = "contact.html"
    model = Contact
    fields = ["name", "email", "subject", "message"]
    success_url = reverse_lazy("home")
    def form_valid(self, form):
        messages.success(self.request, "Thanks for your message")  # Add success message
        return super().form_valid(form)

    # def form_valid(self, form):
    #     response = super().form_valid(form)

    #     # Get user info
    #     name = form.cleaned_data.get("name")
    #     email = form.cleaned_data.get("email")

    #     # Render the HTML email from template
    #     html_message = render_to_string("contact_email.html", {"name": name})
    #     text_message = strip_tags(html_message)

    #     email_message = EmailMultiAlternatives(
    #         subject="Thank You for Contacting Us!",
    #         body=text_message,
    #         from_email=settings.DEFAULT_FROM_EMAIL,
    #         to=[email],
    #     )
    #     email_message.attach_alternative(html_message, "text/html")
    #     email_message.send()

    #     messages.success(
    #         self.request, "Thanks for your message. A confirmation email has been sent."
    #     )
    #     return response


# signup
class SignupView(CreateView):
    template_name = "signup.html"
    form_class = CustomUserCreationForm
    success_url = reverse_lazy("login")

    def form_valid(self, form):
        messages.success(self.request, "Thanks for Signing Up")
        return super().form_valid(form)

    def form_invalid(self, form):
        for field, errors in form.errors.items():
            for error in errors:
                messages.error(self.request, f"{field.capitalize()}: {error}")
        return super().form_invalid(form)


# login
class UserLoginView(LoginView):
    authentication_form = AuthenticationForm
    template_name = "login.html"

    def form_valid(self, form):
        messages.success(self.request, "Thanks for Login")  # Add success message
        return super().form_valid(form)

    def form_invalid(self, form):
        # Increment failed attempts on invalid login
        failed_attempts = self.request.session.get("failed_attempts", 0) + 1
        self.request.session["failed_attempts"] = failed_attempts

        if failed_attempts >= 5:
            messages.warning(
                self.request, "Too many failed attempts. Redirecting to signup."
            )
            self.request.session["failed_attempts"] = 0  # Reset counter
            return redirect("signup")  # redirect to signup page

        messages.error(self.request, f"Invalid login credentials.")
        return super().form_invalid(form)


class UserLogoutView(LogoutView):
    next_page = reverse_lazy("home")
