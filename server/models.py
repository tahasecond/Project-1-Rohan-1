from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key = True)
    firstName = models.CharField(max_length = 255)
    lastName = models.CharField(max_length = 255)
    email = models.EmailField(max_length = 255, unique = True)
    password = models.CharField(max_length = 15)

class Token(models.Model):
    id = models.AutoField(primary_key = True)
    user_id = models.IntegerField()

    token = models.CharField(max_length = 255)
    created_date = models.DateTimeField()
    expiration_date = models.DateTimeField()
    
    is_used = models.BooleanField(default = False)

class Movie(models.Model):
    movie_id = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE)

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE)
    comment = models.TextField()
    rating = models.IntegerField()

# Foreign Key creates a many-to-one relationship
# models.CASCADE deletes any associated records related to a user that is also deleted