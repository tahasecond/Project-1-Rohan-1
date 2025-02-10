from django.db import models


class Movie(models.Model):
    title = models.CharField(max_length=255)
    poster_path = models.CharField(max_length=255)  # URL to the poster image


<<<<<<< HEAD
class User(models.Model):
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    password = models.CharField(max_length=15)
=======
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE)
    comment = models.TextField()

# Foreign Key creates a many-to-one relationship
# models.CASCADE deletes any associated records related to a user that is also deleted
>>>>>>> parent of 0f2ac24 (Merge branch 'main' of https://github.com/tahasecond/Project-1-Rohan-1)
