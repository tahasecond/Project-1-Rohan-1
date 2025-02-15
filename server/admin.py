from django.contrib import admin
from .models import Movie, Order, Cart, Review
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

admin.site.register(Movie)
admin.site.register(Order)
admin.site.register(Cart)
admin.site.register(Review)


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "Profile"


# Extend the UserAdmin class
class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
