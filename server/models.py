from django.db import models
from django.contrib.auth.models import User  # default django user


class Movie(models.Model):
    id = models.IntegerField(default=0, unique=True, primary_key=True)
    title = models.CharField(max_length=500, default="")
    description = models.CharField(max_length=10000, default="")
    backdrop = models.URLField(max_length=500, blank=True, null=True)
    rating = models.DecimalField(max_digits=10, decimal_places=1, default=0.0)
    image = models.URLField(max_length=500, blank=True, null=True)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField(default=0)  # ✅ Add a default value
    movie_title = models.CharField(max_length=255, default=0)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0
    )  # Ensure default for price too
    image = models.URLField(max_length=500, blank=True, null=True)


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.IntegerField()
    # created_at = models.DateTimeField(auto_now_add=True, default=0)
