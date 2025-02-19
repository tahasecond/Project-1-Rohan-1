import json, requests
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from server.models import Cart, Movie, Review, Order, UserProfile
from rest_framework.decorators import api_view
from server.serializers import MovieSerializer, OrderSerializer
from django.utils.timezone import now
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.hashers import check_password
from django.db.models import ObjectDoesNotExist

def index(request):
    return render(request, "index.html")


from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import User, UserProfile
from rest_framework.authtoken.models import Token
from django.http import JsonResponse

class RegistrationView(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            birthday = request.data.get("birthday")

            if User.objects.filter(email=email).exists():
                return JsonResponse(
                    {"success": False, "message": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.create_user(
                username=email, email=email, password=password
            )

            token, created = Token.objects.get_or_create(user=user)
            if not created:
                return JsonResponse(
                    {"success": False, "message": "Token already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user_profile = UserProfile.objects.create(
                user = user,
                birthday = birthday,
                wallet = 10.00 
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
            return Response(
                {
                    "success": False,
                    "message": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class LoginView(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"success": False, "message": "User not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if check_password(password, user.password):
                token = Token.objects.get(user=user)
                return Response(
                    {
                        "success": True,
                        "message": "You are now logged in!",
                        "token": token.key,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"success": False, "message": "Invalid Login Credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": "An unexpected error occurred. Please try again later.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class EmailView(APIView):
    def get(self, request, token, format=None):
        try:
            user_token = Token.objects.get(key=token)
            user = user_token.user
            return JsonResponse({"user": user.email})
        except Token.DoesNotExist:
            return JsonResponse({"error": "Invalid token"}, status=401)


class CartView(APIView):
    def post(self, request, email):
        try:
            data = json.loads(request.body)
            print("Incoming data:", data)

            movie_id = data.get("movie_id")
            movie_title = data.get("movie_title")
            image = data.get("image")
            price = data.get("price")

            user = User.objects.get(email=email)

            existing_item = Cart.objects.filter(user=user, movie_id=movie_id).first()

            if existing_item:
                existing_item.quantity += 1
                existing_item.save()
                return JsonResponse({"message": "Movie quantity updated"}, status=200)

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
            )

            return JsonResponse({"message": "Movie added to cart"}, status=201)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            print("Error:", str(e))
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
                    "price": float(item.price),
                    "image": item.image,
                }
                for item in cart_items
            ]

            print("Cart Data:", cart_data)

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


def get_movies(request):
    query = request.GET.get("search", "")

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
            for movie in data["results"]
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

@api_view(["GET", "DELETE"])
def movie_detail(request, id): 
    try:
        movie = Movie.objects.get(id=id) 

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
            movie_data = request.data
            if "rating" in movie_data:
                movie_data["rating"] = round(float(movie_data["rating"]), 1)
            if "backdrop" in movie_data and movie_data["backdrop"]:
                movie_data["backdrop"] = movie_data["backdrop"].strip()
            serializer = MovieSerializer(data=movie_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PATCH"])
def wallet_view(request, token):
    try:
        user = Token.objects.get(key=token).user
        user_profile = get_object_or_404(UserProfile, user=user)

        if request.method == "GET":
            return Response({"wallet": user_profile.wallet}, status=status.HTTP_200_OK)

        elif request.method == "PATCH":
            new_wallet_amount = request.data.get("wallet")
            if new_wallet_amount is not None:
                user_profile.wallet = new_wallet_amount
                user_profile.save()
                return Response(
                    {"message": "Wallet updated", "wallet": user_profile.wallet},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Invalid request data"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

    except Token.DoesNotExist:
        return Response({"error": "Invalid token"}, status=status.HTTP_404_NOT_FOUND)

class CreateOrderView(APIView):
    def post(self, request):
        try:
            user_email = request.data.get("user")
            movie_id = request.data.get("movie")
            movie_title = request.data.get(
                "movie_title"
            ) 
            image = request.data.get("image")  

            user = get_object_or_404(User, email=user_email)

            order = Order.objects.create(
                user=user,
                movie_id=movie_id,
                movie_title=movie_title,
                image=image,
                timestamp=now(),
            )
            order.save()

            return JsonResponse(
                {"success": True, "message": "Order created successfully"},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return JsonResponse(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetUserOrdersView(APIView):
    def get(self, request, user_email):
        try:
            user = get_object_or_404(User, email=user_email)
            orders = Order.objects.filter(user=user).order_by(
                "-timestamp"
            )
            serializer = OrderSerializer(orders, many=True)

            return JsonResponse(
                {"success": True, "orders": serializer.data},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return JsonResponse(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
class LeaveReview(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try: 
            user = request.user

            rating = request.data.get("rating")
            comment = request.data.get("comment")
            movie = request.data.get("movieId")
            
            review = Review.objects.create(
                user = user,
                movie = movie,
                rating = rating,
                comment = comment
            )
            review.save()
            return Response({"success": True, "message": "Review left successfully"}, status = 201)
        except Exception as e:
            return Response({"success": False, "message": "Failed to leave a review"}, status = 400)

class FetchMovieReviews(APIView):
    def get(self, request, id):
        try:
            reviews = Review.objects.filter(movie = id)

            reviews_data = []
            for review in reviews:
                reviews_data.append({
                    "id": review.id,
                    "user": review.user.username,
                    "comment": review.comment,
                    "rating": review.rating
                })

            return Response({
                "success": True,
                "message": "Movie reviews fetched",
                "reviews": reviews_data
            })
        except Exception as e:
            return Response({
                "success": False,
                "message": "Failed to fetch movie reviews"
            })

class FetchUserReviews(APIView):
    def get(self, request, token):
        try:
            user = Token.objects.get(key = token).user
            reviews = Review.objects.filter(user = user)

            reviews_data = []
            for review in reviews:
                reviews_data.append({
                    "review_id": review.id,
                    "movieId": review.movie,
                    "comment": review.comment,
                    "rating": review.rating
                })
            
            return Response({
                "success": True,
                "message": "User reviews fetched",
                "reviews": reviews_data
            })
        except Exception as e:
            return Response({
                "success": False,
                "message": "Failed to fetch user reviews"
            })

class ResetPassword(APIView):
    def post(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            birthday = request.data.get("birthday")

            try:
                user = User.objects.get(email = email)
            except User.DoesNotExist:
                return Response(
                    {"success": False, "message": "User not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            user_profile = get_object_or_404(UserProfile, user = user)
            
            if str(birthday) == str(user_profile.birthday):
                user.set_password(password)
                user.save()
                return Response({
                    "success": True,
                    "message": "Updated password successfully"
                })
            
            else:
                return Response({
                    "success": False,
                    "message": "Failed to verify credentials. Please check your email and birthday."
                }, status=400)

        except Exception as e:
            return Response({
                "success": False,
                "message": "Failed to verify/reset password"
            })

class DeleteReview(APIView):
    def post(self, request):
        try:
            id = request.data.get("reviewId")
            review = Review.objects.get(id=id)
            review.delete()
            return Response({"success": True, "message": "Deleted review"})
        except ObjectDoesNotExist:
            return Response({"success": False, "message": "Review not found"}, status=404)
        except Exception as e:
            return Response({"success": False, "message": "Failed to delete review"}, status=500)

class EditReview(APIView):
    def post(self, request):
        try:
            id = request.data.get("id")
            review = Review.objects.get(id=id)
            review.comment = request.data.get("comment", review.comment)
            review.rating = request.data.get("rating", review.rating)
            review.save()
            return Response({"success": True, "message": "Edited review"})
        except ObjectDoesNotExist:
            return Response({"success": False, "message": "Review not found"}, status=404)
        except Exception as e:
            return Response({"success": False, "message": "Failed to edit review"}, status=500)
