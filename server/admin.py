from django.contrib import admin
from .models import User, Token, Movie, Order, Cart, Review

admin.site.register(User)
admin.site.register(Token)
admin.site.register(Movie)
admin.site.register(Order)
admin.site.register(Cart)
admin.site.register(Review)