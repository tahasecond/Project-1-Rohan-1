from django.db import models
from django.contrib.auth.models import User  # default django user


class Movie(models.Model):
    movie_id = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="cart_movies",
        null=True,
        blank=True,
    )  # Optional ForeignKey for movie
    movie_title = models.CharField(
        max_length=255, blank=True, null=True
    )  # Optional field for movie_title, no need to reference Movie here
    price = 10

    def save(self, *args, **kwargs):
        # Populate movie_title from movie if movie is provided and movie_title is empty
        if self.movie and not self.movie_title:
            self.movie_title = self.movie.title
        super().save(*args, **kwargs)


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.IntegerField()
