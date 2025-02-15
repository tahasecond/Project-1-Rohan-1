import json
import logging
import requests
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from server.models import Cart, Movie
from rest_framework.decorators import api_view, permission_classes
from server.serializers import MovieSerializer
from rest_framework.exceptions import AuthenticationFailed

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
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.create_user(
                username=username, email=email, password=password
            )
            logger.info(f"New user registered: {email}")
            token, created = Token.objects.get_or_create(user=user)
            if not created:
                return JsonResponse(
                    {"success": False, "message": "Token already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return JsonResponse(
                {
                    "success": True,
                    "message": "You are now registered!",
                    "token": token.key,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.exception(f"Unexpected error during registration: {str(e)}")
            return Response(
                {
                    "success": False,
                    "message": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


from rest_framework.authentication import TokenAuthentication


class EmailView(APIView):
    def get(self, request, token, format=None):
        try:
            # Authenticate user using token
            user_token = Token.objects.get(key=token)
            user = user_token.user
            return JsonResponse({"user": user.email})
        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)


class LoginView(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            try:
                user = User.objects.get(email=email)
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
                    {
                        "success": True,
                        "message": "You are now logged in!",
                        "token": token.key,
                    },
                    status=status.HTTP_200_OK,
                )

            logger.warning(f"Invalid login attempt for email: {email}")
            return Response(
                {"success": False, "message": "Invalid Login Credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        except Exception as e:
            logger.exception(f"Unexpected error during login: {str(e)}")
            return Response(
                {
                    "success": False,
                    "message": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CartView(APIView):
    def post(self, request, email):
        try:
            data = json.loads(request.body)  # Load JSON data
            print("Incoming data:", data)  # ✅ Debug log

            movie_id = data.get("movie_id")
            movie_title = data.get("movie_title")
            image = data.get("image")
            price = data.get("price")

            user = User.objects.get(email=email)

            # Check if the movie is already in the cart
            existing_item = Cart.objects.filter(user=user, movie_id=movie_id).first()

            if existing_item:
                existing_item.quantity += 1
                existing_item.save()
                return JsonResponse({"message": "Movie quantity updated"}, status=200)

            # Create a new cart item
            cart_item = Cart.objects.create(
                user=user,
                movie_id=movie_id,
                movie_title=movie_title,
                price=price,
                image=image,
            )
            cart_item.save()

            print(
                "Saved Cart Item:", cart_item.image
            )  # ✅ Check if image is saved correctly

            return JsonResponse({"message": "Movie added to cart"}, status=201)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            print("Error:", str(e))  # ✅ Log errors
            return JsonResponse({"error": str(e)}, status=400)

    def get(self, request, email):
        try:
            if not email:
                return JsonResponse({"error": "Email is required"}, status=400)

            user = User.objects.get(email=email)
            cart_items = Cart.objects.filter(user=user)

            cart_data = [
                {
                    "movie_id": item.movie_id,
                    "movie_title": item.movie_title,
                    "price": float(item.price),  # Ensure price is properly formatted
                    "image": item.image,
                }
                for item in cart_items
            ]

            print("Cart Data:", cart_data)  # ✅ Debugging log

            return JsonResponse({"cart": cart_data}, status=200, safe=False)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    def delete(self, request, email, movie_id):
        try:
            user = User.objects.get(email=email)
            cart_item = Cart.objects.filter(user=user, movie_id=movie_id).first()

            if not cart_item:
                return JsonResponse({"error": "Movie not found in cart"}, status=404)

            cart_item.delete()
            return JsonResponse({"message": "Movie removed from cart"}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


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
            "backdrops": f"https://image.tmdb.org/t/p/original{data['backdrop_path']}"
            if data["backdrop_path"]
            else None,
        }
        return JsonResponse(movie)
    return JsonResponse({"error": "Failed to fetch movie details"}, status=500)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, UserProfile
from .serializers import MovieSerializer


@api_view(["GET", "DELETE"])
def movie_detail(request, id):  # ✅ Change movie_id to id
    try:
        movie = Movie.objects.get(id=id)  # ✅ Match model field name

        if request.method == "GET":
            serializer = MovieSerializer(movie)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "DELETE":
            movie.delete()
            return Response(
                {"message": "Movie removed from database"}, status=status.HTTP_200_OK
            )

    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def movie_list(request):
    try:
        if request.method == "GET":
            movies = Movie.objects.all()
            serializer = MovieSerializer(movies, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == "POST":
            # Handling the movie data coming from TMDB
            movie_data = request.data
            # Ensure the rating is a decimal (if it’s not)
            if "rating" in movie_data:
                movie_data["rating"] = round(float(movie_data["rating"]), 1)
            # Handle the backdrop URL, ensuring it’s correctly formatted
            if "backdrop" in movie_data and movie_data["backdrop"]:
                movie_data["backdrop"] = movie_data["backdrop"].strip()
            # Create the movie using the serializer
            serializer = MovieSerializer(data=movie_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_wallet(request, token):
    try:
        # First, authenticate the token
        try:
            user_token = Token.objects.get(key=token)
            user = user_token.user
        except Token.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        # Now, fetch the UserProfile
        user_profile = UserProfile.objects.get(user=user)

        # Return the wallet balance
        return JsonResponse({"wallet_balance": user_profile.wallet})

    except UserProfile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)
