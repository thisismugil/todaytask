from django.urls import path
from .views import (
    register_user,
    verify_email_otp,
    login_user,
    forgot_password_request,
    verify_reset_otp,
    reset_password,
    logout_user,
    fetch_courses,
    enroll_course,
    fetch_course
)

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('verify-email-otp/', verify_email_otp, name='verify_email_otp'),
    path('login/', login_user, name='login_user'),
    path('forgot-pass/', forgot_password_request, name='forgot_password_request'),
    path('verify-reset/', verify_reset_otp, name='verify_reset_otp'),
    path('reset-pass/', reset_password, name='reset_password'),
    path('fetch-courses/', fetch_courses, name='fetch_courses'),
    path('fetch-course/<str:course_id>/', fetch_course, name='fetch_course'),
    path('enroll-course/', enroll_course, name='enroll_course'),
    path('logout/', logout_user, name='logout_user'),
]
