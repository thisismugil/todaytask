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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
import json
import random
import re
from django.core.mail import send_mail
import random
import string
import json
from django.http import JsonResponse
import jwt 
import datetime
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings

client = MongoClient("mongodb+srv://prakashbalan555:aicourse@ai-course.si9g6.mongodb.net/")
db = client["core"]


if "core" not in client.list_database_names():
    db = client["core"]

if "users" not in db.list_collection_names():
    users_collection = db.create_collection("users")
else:
    users_collection = db["users"]

print("Successfully connected to MongoDB and accessed the 'users' collection.")

def generate_otp():
    """Generate a 6-digit OTP."""
    return random.randint(100000, 999999)

def is_valid_email(email):
    """Validate email format."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def send_email(to_email, subject, message):
    """
    Send an email using Django's SMTP backend.
    """
    try:
        send_mail(
            subject=subject,
            message="", 
            html_message=message,
            from_email='your_email@gmail.com',  
            recipient_list=[to_email],
        )
        print(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

import logging
logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            first_name = data.get('first_name')      
            hashed_password = make_password(data.get('password'))
            last_name = data.get('last_name')
            email = data.get('email')
            password = hashed_password
            confirm_password = data.get('confirm_password')
            if not all([first_name, last_name, email, password, confirm_password]):
                return JsonResponse({"error": "All fields are required."}, status=400)
            if not is_valid_email(email):
                return JsonResponse({"error": "Invalid email format."}, status=400)
            if len(password) < 8:
                return JsonResponse({"error": "Password must be at least 8 characters long."}, status=400)
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)
            if users_collection.find_one({"email": email}):
                return JsonResponse({"error": "Email is already registered."}, status=409)
            email_otp = generate_otp()
            email_message = f"<p>Your email verification OTP is: <strong>{email_otp}</strong></p>"
            email_sent = send_email(email, "Email Verification OTP", email_message)
            if not email_sent:
                return JsonResponse({"error": "Failed to send email OTP. Try again later."}, status=500)
            users_collection.insert_one({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": password,  
                "email_verified": False,
                "email_otp": email_otp,
            })
            return JsonResponse({
                "message": "User registered successfully! Verify your email and phone.",
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            otp = data.get('otp')

            user = users_collection.find_one({"email": email})

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)
            if str(user.get('email_otp')) == otp:
                users_collection.update_one({"email": email}, {"$set": {"email_verified": True}})
                return JsonResponse({"message": "Email verified successfully."})
            else:
                return JsonResponse({"error": "Invalid OTP."}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


from django.conf import settings

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')

            # Validate required fields
            if not email or not password:
                return JsonResponse({"error": "Email and password are required."}, status=400)

            # Find user in the database
            user = users_collection.find_one({"email": email, "password": password})

            if user:
                if not user.get('email_verified', False):
                    return JsonResponse({"error": "Email is not verified."}, status=403)

                # Generate JWT token
                payload = {
                    'email': email,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expires in 24 hours
                }
                token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

                return JsonResponse({
                    "message": "Login successful.",
                    "email": email,
                    "first_name": user.get("first_name"),
                    "last_name": user.get("last_name"),
                    "token": token
                })
            else:
                return JsonResponse({"error": "Invalid email or password."}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    
# Forgot Password: Request OTP
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')

            # Validate email
            if not email or not is_valid_email(email):
                return JsonResponse({"error": "Invalid email format."}, status=400)

            # Check if user exists
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "Email not registered."}, status=404)

            # Generate OTP
            reset_otp = generate_otp()

            # Send Email OTP
            email_message = f"<p>Your password reset OTP is: <strong>{reset_otp}</strong></p>"
            email_sent = send_email(email, "Password Reset OTP", email_message)
            if not email_sent:
                return JsonResponse({"error": "Failed to send email OTP. Try again later."}, status=500)

            # Save OTP in the database
            users_collection.update_one({"email": email}, {"$set": {"reset_otp": reset_otp}})

            return JsonResponse({"message": "Password reset OTP sent successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


# Forgot Password: Verify OTP
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            otp = data.get('otp')

            # Validate input
            if not email or not otp:
                return JsonResponse({"error": "Email and OTP are required."}, status=400)

            # Find user
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "Email not registered."}, status=404)

            # Verify OTP
            if str(user.get("reset_otp")) == str(otp):
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

            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "Email not registered."}, status=404)

            users_collection.update_one({"email": email}, {"$set": {"password": new_password, "reset_otp": None}})

            return JsonResponse({"message": "Password reset successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def logout_user(request):
    if request.method == 'POST':
        try:
            return JsonResponse({"message": "Logout successful."})
        except Exception as e:
            return JsonResponse({"error": "Internal server error."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
