from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    id = models.AutoField(primary_key = True)
    firstName = models.CharField(max_length = 255)
    lastName = models.CharField(max_length = 255)
    email = models.EmailField(max_length = 255, unique = True)
    password = models.CharField(max_length = 128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["firstName", "lastName"]

    objects = UserManager()

class Token(models.Model):
    id = models.AutoField(primary_key = True)
    user_id = models.IntegerField()
    
    key = models.CharField(max_length = 255, unique = True)
    created_date = models.DateTimeField(auto_now_add = True)
    expiration_date = models.DateTimeField()
    is_used = models.BooleanField(default = False)

class Movie(models.Model):
    movie_id = models.IntegerField()
    title = models.CharField(max_length = 255, unique = True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE)

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)

class CartItems(models.Model):
    cart = models.ForeignKey(Cart, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE)
    quantity = models.PositiveIntegerField(default = 1)

    def total_price(self):
        return self.quantity * self.movie.price

    def __str__(self):
        return f"{self.quantity} x {self.movie.title} in  {self.cart.user.email}'s cart"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete = models.CASCADE)
    comment = models.TextField()
    rating = models.IntegerField(default = 1)

# Foreign Key creates a many-to-one relationship
# models.CASCADE deletes any associated records related to a user that is also deleted