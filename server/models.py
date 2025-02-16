from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver  # default django user
from django.db.models.signals import post_save


class Movie(models.Model):
    id = models.IntegerField(default=0, unique=True, primary_key=True)
    title = models.CharField(max_length=500, default="")
    description = models.CharField(max_length=10000, default="")
    backdrop = models.URLField(max_length=500, blank=True, null=True)
    rating = models.DecimalField(max_digits=10, decimal_places=1, default=0.0)
    image = models.URLField(max_length=500, blank=True, null=True)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.IntegerField(default=0)  # ✅ Add a default value
    movie_title = models.CharField(max_length=255, default=0)
    image = models.URLField(max_length=500, blank=True, null=True)
    timestamp = models.DateTimeField(
        default=timezone.now
    )  # Automatically set to current time when order is created


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


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wallet = models.DecimalField(
        max_digits=10, decimal_places=2, default=10.00
    )  # Stores user balance

    def __str__(self):
        return f"{self.user.username} - Wallet: ${self.wallet}"


import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        logger.info(f"Creating user profile for {instance.username}")
        UserProfile.objects.get_or_create(user=instance, defaults={"wallet": 10.00})


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
