from django.contrib import admin
from .models import Movie, Order, Cart, Review

admin.site.register(Movie)
admin.site.register(Order)
admin.site.register(Cart)
admin.site.register(Review)