from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.template import loader
from django.http import HttpResponse
from django import template
# Create your views here.

def index(request):
    context = {}
    return render(request, 'index.html', context=context)

def login_view(request):
    
    context = {}
    return render(request, "login.html", context=context)

