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

# MongoDB Setup
client = MongoClient("mongodb+srv://prakashbalan555:aicourse@ai-course.si9g6.mongodb.net/")
db = client["core"]

# Ensure the database and collection are created
if "core" not in client.list_database_names():
    db = client["core"]

if "users" not in db.list_collection_names():
    users_collection = db.create_collection("users")
else:
    users_collection = db["users"]

print("Successfully connected to MongoDB and accessed the 'users' collection.")

# Helper Functions
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
            message="",  # Empty because we're using HTML content
            html_message=message,
            from_email='your_email@gmail.com',  # Ensure this matches DEFAULT_FROM_EMAIL
            recipient_list=[to_email],
        )
        print(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

import logging

# Set up logging
logger = logging.getLogger(__name__)

# Registration View
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            # Extract fields
            first_name = data.get('first_name')
            middle_name = data.get('middle_name', "")  # Optional
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')

            # Validate required fields
            if not all([first_name, last_name, email, password, confirm_password]):
                return JsonResponse({"error": "All fields are required."}, status=400)

            # Validate email and phone
            if not is_valid_email(email):
                return JsonResponse({"error": "Invalid email format."}, status=400)

            # Validate password
            if len(password) < 8:
                return JsonResponse({"error": "Password must be at least 8 characters long."}, status=400)
            if password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)

            # Check if email or phone already exists
            if users_collection.find_one({"email": email}):
                return JsonResponse({"error": "Email is already registered."}, status=409)

            # Generate OTPs
            email_otp = generate_otp()

            # Send Email OTP
            email_message = f"<p>Your email verification OTP is: <strong>{email_otp}</strong></p>"
            email_sent = send_email(email, "Email Verification OTP", email_message)
            if not email_sent:
                return JsonResponse({"error": "Failed to send email OTP. Try again later."}, status=500)


            # Save user to database with unverified status
            users_collection.insert_one({
                "first_name": first_name,
                "middle_name": middle_name,
                "last_name": last_name,
                "email": email,
                "password": password,  # In production, hash this!
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
def verify_email_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            otp = data.get('otp')

            user = users_collection.find_one({"email": email})

            if not user:
                return JsonResponse({"error": "User not found."}, status=404)

            # Verify OTP
            if user.get('email_otp') == otp:
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

# Login View
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        print("Login")
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
                

                return JsonResponse({
                    "message": "Login successful.",
                    "email": email,
                    "first_name": user.get("first_name"),
                    "last_name": user.get("last_name"),
                })
            else:
                return JsonResponse({"error": "Invalid email or password."}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
    
# Forgot Password: Request OTP
@csrf_exempt
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

# Forgot Password: Change Password
@csrf_exempt
def reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            # Validate input
            if not email or not new_password or not confirm_password:
                return JsonResponse({"error": "All fields are required."}, status=400)

            if new_password != confirm_password:
                return JsonResponse({"error": "Passwords do not match."}, status=400)

            if len(new_password) < 8:
                return JsonResponse({"error": "Password must be at least 8 characters long."}, status=400)

            # Find user
            user = users_collection.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "Email not registered."}, status=404)

            # Update password
            users_collection.update_one({"email": email}, {"$set": {"password": new_password, "reset_otp": None}})

            return JsonResponse({"message": "Password reset successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": "Internal server error. Please try again later."}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
