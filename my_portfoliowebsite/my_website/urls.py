from django.urls import path
from .views import HomePageView,AboutpageView,ServicePageView, ContactPageView, SkillsPageView,SignupView,UserLoginView,UserLogoutView

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('about/', AboutpageView.as_view(), name='about'),
    path('services/', ServicePageView.as_view(), name='services'),
    path('skills/', SkillsPageView.as_view(), name='skills'),
    path('contact/', ContactPageView.as_view(), name='contact'),
     path('signup/', SignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
]