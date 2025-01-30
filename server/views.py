# this file is for rendering html page

from django.shortcuts import render

def index(request):
    return render(request, 'index.html')