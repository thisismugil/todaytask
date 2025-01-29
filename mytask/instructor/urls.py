from django.urls import path
from . import views
urlpatterns = [
    path('register/',views.register_instructor, name='register'),
    path('login/',views.login_instructor, name='login'),
    path('verify-email-otp/',views.verify_email_otp, name='verify-email-otp'),
    path('forgot-pass/',views.forgot_password_request, name='forgot-pass'),
    path('reset-pass/',views.reset_password, name='reset-pass'),
    path('verify-reset/',views.verify_reset_otp, name='verify-reset'),
    path('upload/',views.upload_content, name='upload'),
    path('fetch/<str:user_id>',views.uploaded_courses, name='fetch'),
    path('courses/',views.all_course, name='courses'),
    path('edit-course/', views.edit_course, name='edit-course'),
]