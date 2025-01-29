from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import random
import json
import re
from django.core.mail import send_mail
import logging
import string
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from pymongo import MongoClient
from django.conf import settings
import re 
from bson import ObjectId
from django.contrib.auth.hashers import make_password, check_password




client = MongoClient("mongodb+srv://prakashbalan555:aicourse@ai-course.si9g6.mongodb.net/")
db = client["core"]


if "core" not in client.list_database_names():
    db = client["core"]

if "instructor" not in db.list_collection_names():
    instructor_collection = db.instructor_collection("instructor")
else:
    instructor_collection = db["instructor"]
if "courses" not in db.list_collection_names():
    course_collection = db.course_collection("courses")
else:
    course_collection = db["courses"]
    


def generate_otp():
    return random.randint(100000, 999999)
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)
def send_email(to_email, subject, message):
    try:
        send_mail(
            subject=subject,
            message="",
            html_message=message,
            from_email='mugil1206@gmail.com',
            recipient_list=[to_email],
        )
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False    
logger=logging.getLogger(__name__)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_instructor(request):
    print(request.method)
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')     
            if not all([first_name, last_name, email, password, confirm_password]):
                return JsonResponse({'error': 'Please fill all fields'}, status=400)
            if not is_valid_email(email):
                return JsonResponse({'error': 'Invalid email'}, status=400)
            if len(password) < 8:
                return JsonResponse({'error': 'Password must be at least 8 characters'}, status=400)
            if password != confirm_password:
                return JsonResponse({'error': 'Passwords do not match'}, status=400)            
            if instructor_collection.find_one({'email': email}):
                return JsonResponse({'error': 'Email already exists'}, status=400)
            hashed_password = make_password(data.get('password'))
            email_otp = generate_otp()
            email_message = f"<p>Your OTP is: <strong>{email_otp}</strong></p>"
            email_sent = send_email(email, "email verification otp", email_message)
            if not email_sent:
                return JsonResponse({'error': 'Failed to send email'}, status=400)
            instructor_collection.insert_one({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": hashed_password,
                "email_verified": False,
                "email_otp": email_otp,
            })
            return JsonResponse({'message': 'Instructor registered successfully'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"unexpected error: {str(e)}")
            return JsonResponse({'error': 'Unexpected error'}, status=500)
    else:
        print("dkbcjkbsd")
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_otp(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        otp = data.get('otp')
        print("otp", otp)
        instructor = instructor_collection.find_one({"email": email})
        if not instructor:
            return JsonResponse({"error": "instructor not found."}, status=404)
        print(str(type(otp)))
        if str(instructor.get('email_otp')) == otp:
            instructor_collection.update_one({"email": email}, {"$set": {"email_verified": True}})
            return JsonResponse({"message": "Email verified successfully."})
        else:
            return JsonResponse({"error": "Invalid OTP."}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    except Exception as e:
        return JsonResponse({"error": "Internal server error."}, status=500)
            
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_instructor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            print(email)
            password = data.get('password')
            print(password)
            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)
            instructor = instructor_collection.find_one({"email": email})
            print(instructor)
            if instructor:
                if check_password(password=password, encoded=instructor['password']):
                    if not instructor.get('email_verified', False):
                        return JsonResponse({"error": "Email is not verified."}, status=403)
                    return JsonResponse({
                        "message": "Login successful.",
                        "email": email,
                        "first_name": instructor.get("first_name"),
                        "last_name": instructor.get("last_name"),
                        "_id": str(instructor.get("_id")),
                        
                    })
                else:
                    return JsonResponse({"error": "Invalid password."}, status=401)
            else:
                return JsonResponse({"error": "Invalid email or password."}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')

            if not email or not is_valid_email(email):
                return JsonResponse({"error": "Invalid email format."}, status=400)

            instructor = instructor_collection.find_one({"email": email})
            if not instructor:
                return JsonResponse({"error": "Email not registered."}, status=404)

            reset_otp = generate_otp()

            email_message = f"<p>Your password reset OTP is: <strong>{reset_otp}</strong></p>"
            email_sent = send_email(email, "Admin Password Reset OTP", email_message)
            if not email_sent:
                return JsonResponse({"error": "Failed to send email OTP. Try again later."}, status=500)

            instructor_collection.update_one({"email": email}, {"$set": {"reset_otp": reset_otp}})

            return JsonResponse({"message": "Password reset OTP sent successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            otp = data.get('otp')

            if not email or not otp:
                return JsonResponse({"error": "Email and OTP are required."}, status=400)

            instructor = instructor_collection.find_one({"email": email})
            if not instructor:
                return JsonResponse({"error": "Email not registered."}, status=404)
            if str(instructor.get("reset_otp")) == str(otp):
                return JsonResponse({"message": "OTP verified successfully. You can now reset your password."}, status=200)
            else:
                return JsonResponse({"error": "Invalid OTP."}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')
            if not email or not new_password or not confirm_password:
                return JsonResponse({"error": "All fields are required."}, status=400)
            if new_password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)
            if len(new_password) < 8:
                return JsonResponse({"error": "Password must be at least 8 characters long."}, status=400)
            instructor = instructor_collection.find_one({"email": email})
            if not instructor:
                return JsonResponse({"error": "Email not registered."}, status=404)
            instructor_collection.update_one({"email": email}, {"$set": {"password": new_password, "reset_otp": None}})
            return JsonResponse({"message": "Password reset successfully."}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
        
@api_view(['POST'])
@permission_classes([AllowAny])
def upload_content(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        course_name = data.get('course_name')
        category = data.get('category')
        description = data.get('description')
        number_of_modules = data.get('number_of_modules')
        content = data.get('content')
        price = data.get('price')
        user_id = data.get("user_id")
        if not user_id:
            return JsonResponse({"error": "User ID is required."}, status=400)
        if not course_name or not description or not content or not price:
            return JsonResponse({"error": "All fields are required."}, status=400)
        
        course_collection.insert_one({
            "course_name": course_name,
            "category": category,
            "description": description,
            "Number of modules": number_of_modules,
            "content": content,
            "price": price,
            "user_id": user_id,
            "enrolled_students": []
            
        })
        
        instructor = instructor_collection.find_one({"_id": user_id})
        if instructor:
            instructor_email = instructor['email']
            print("email",instructor_email)
            subject = 'Course Creation Successful'
            message = f'Dear Instructor,\n\nYour course "{course_name}" has been successfully created.\n\nBest regards,\nThanks for choosing us.'
            from_email = 'mugil1206@gmail.com'
            recipient_list = [instructor_email]
            send_mail(subject, message, from_email, recipient_list)
            
            
        return JsonResponse({"message": "Course uploaded successfully."}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    
@api_view(['GET'])
def uploaded_courses(request, user_id):
    try:
        contents = list(course_collection.find({"user_id":user_id}))
        print(contents)
        for content in contents:
            content['_id'] = str(content['_id'])
        return Response({
            'contents': contents
        })
    except Exception as e:
        print(f'Error {e}')
        return JsonResponse({"error": "Internal server error. Please try again later."}, status=500 )
    
@api_view(['GET'])
def all_course(request):
    try:
        contents = list(course_collection.find())
        for content in contents:
            content['_id'] = str(content['_id'])
        return Response({
                'contents': contents
            })
    except Exception as e:
        return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)

        
    
