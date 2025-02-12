import logging
import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status

from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password

logger = logging.getLogger(__name__)

def index(request):
    return render(request, "index.html")

class RegistrationView(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            username = email
            password = request.data.get("password")

            if User.objects.filter(email=email).exists():
                logger.warning(f"Registration attempt with existing email: {email}")
                return JsonResponse(
                    {"success": False, "message": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.create_user(
                username = username,
                email = email,
                password = password
            )
            logger.info(f"New user registered: {email}")
            token, created = Token.objects.get_or_create(user = user)
            if not created:
                return JsonResponse(
                    {"success": False, "message": "Token already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return JsonResponse(
                {"success": True, "message": "You are now registered!", "token": token.key},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.exception(f"Unexpected error during registration: {str(e)}")
            return Response(
                {"success": False, "message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class LoginView(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            try:
                user = User.objects.get(email = email)
            except User.DoesNotExist:
                logger.warning(f"Login attempt with non-existent email: {email}")
                return Response(
                    {"success": False, "message": "User not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            
            if check_password(password, user.password):
                logger.info(f"User logged in: {email}")
                token = Token.objects.get(user=user) 
                return Response(
                    {"success": True, "message": "You are now logged in!", "token": token.key},
                    status=status.HTTP_200_OK
                )

            logger.warning(f"Invalid login attempt for email: {email}")
            return Response(
                {"success": False, "message": "Invalid Login Credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        except Exception as e:
            logger.exception(f"Unexpected error during login: {str(e)}")
            return Response(
                {"success": False, "message": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# Creates the api json so that we can fetch it from frontend
def get_movies(request):
    query = request.GET.get("search", "")  # Get the search query from URL parameters

    if query:
        url = f"https://api.themoviedb.org/3/search/movie?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823&language=en-US&query={query}&page=1"
    else:
        url = f"https://api.themoviedb.org/3/movie/popular?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823&language=en-US&page=1"

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        movies = [
            {
                "id": movie["id"],
                "title": movie["title"],
                "description": movie["overview"],
                "rating": movie["vote_average"],
                "image": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
                if movie["poster_path"]
                else None,
                "backdrops": f"https://image.tmdb.org/t/p/w500{movie['backdrop_path']}"
                if movie["backdrop_path"]
                else None,
            }
            for movie in data["results"]  # Return only the top 10 results
        ]
        return JsonResponse(movies, safe=False)

    return JsonResponse({"error": "Failed to fetch movies"}, status=500)


def get_movie_details(request, movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=b7e53cd3f6fdf95ed3ec34f7bbf27823&language=en-US"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        movie = {
            "id": data["id"],
            "title": data["title"],
            "description": data["overview"],
            "rating": data["vote_average"],
            "image": f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
            if data["poster_path"]
            else None,
            "backdrops": f"https://image.tmdb.org/t/p/w500{data['backdrop_path']}"
            if data["backdrop_path"]
            else None,
        }
        return JsonResponse(movie)
    return JsonResponse({"error": "Failed to fetch movie details"}, status=500)