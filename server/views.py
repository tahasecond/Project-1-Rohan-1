# this file is for rendering html page
from django.shortcuts import render
from django.conf import settings
from rest_framework.response import Response

# from rest_framework.views import viewsets
import requests
from django.http import JsonResponse
from django.conf import settings

# for authentication
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from .models import User, Token
from .serializers import UserSerializer, TokenSerializer


SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"

def index(request):
    return render(request, "index.html")
    

class RegistrationView(APIView):
    def post(self, request, format = None):
        request.data["password"] = make_password(
            password = request.data["password"], salt = SALT
        )

        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                  {"success": True, "message": "You are now registered on our website!"},
                status = status.HTTP_200_OK,
            )
        else:
            error_msg = ""
            for key in serializer.errors:
                error_msg += serializer.errors[key][0]
            return Response(
                {"success": False, "message": error_msg},
                status = status.HTTP_200_OK,
            )

class LoginView(APIView):
    def post(self, request, format = None) :
        email = request.data("email")
        password = request.data("password")
        hashed_password = make_password(password = password, salt = SALT)
        user = User.objects.get(email = email)
        if user is None or user.password != hashed_password:
            return Response(
                {
                    "success": False,
                    "message": "Invalid Login Credentials!",
                },
                status = status.HTTP_200_OK,
            )
        else:
            return Response(
                {"success": True, "message": "You are now logged in!"},
                status = status.HTTP_200_OK,
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