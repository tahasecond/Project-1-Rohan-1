# this file is for rendering html page
from django.shortcuts import render
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from django.http import JsonResponse
from django.conf import settings


def index(request):
    return render(request, "index.html")

def get_movies(request):
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={"b7e53cd3f6fdf95ed3ec34f7bbf27823"}&language=en-US&page=1"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        movies = [
            {
                "id": movie["id"],
                "title": movie["title"],
                "image": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
                #"price": TBD
            }
            for movie in data["results"]
        ]
        return JsonResponse(movies, safe=False)
    return JsonResponse({"error": "Failed to fetch movies"}, status=500)

