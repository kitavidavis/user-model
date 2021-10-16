from rest_framework.decorators import api_view
from django.shortcuts import HttpResponse
from rest_framework import status
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
from app.models import User
import json
import datetime


def serialize_user(user):
    serialized = model_to_dict(user)
    serialized["date"] = str(user.date)
    serialized["name"] = str(user.name)
    serialized["email"] = str(user.email)
    serialized["image"] = str(user.image)
    serialized["pdf"] = str(user.pdf)
    return serialized


def save_user(request, user, success_status):
    errors = []
    name = request.data.get("name", "")
    if name == "":
        errors.append({"name": "This field is required"})

    email = request.data.get("email", "")
    if email == "":
        errors.append({"email": "This field is required"})

    image = request.data.get("image", "")
    if image == "":
        errors.append({"image": "This field is required"})

    pdf = request.data.get("pdf", "")
    if pdf == "":
        errors.append({"pdf": "This field is required"})

    date = request.data.get("date", "")
    if date == "":
        date = datetime.datetime.now()

    if len(errors) > 0:
        return HttpResponse(json.dumps(
            {
                "errors": errors
            }), status=status.HTTP_400_BAD_REQUEST)

    try:
        user.date = date
        user.name = name
        user.email = email
        user.image = image
        user.pdf = pdf
        user.save()
    except Exception as e:
        return HttpResponse(json.dumps(
            {
                "errors": {"User": str(e)}
            }), status=status.HTTP_400_BAD_REQUEST)

    return HttpResponse(json.dumps({"data": serialize_user(user)}), status=success_status)


@api_view(['GET', 'POST'])
def users(request):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"detail": "Not authorized"}), status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        users_data = User.objects.all()

        users_count = users_data.count()

        page_size = int(request.GET.get("page_size", "10"))
        page_no = int(request.GET.get("page_no", "0"))
        users_data = list(users_data[page_no * page_size:page_no * page_size + page_size])

        users_data = [serialize_user(user) for user in users_data]
        return HttpResponse(json.dumps({"count": users_count, "data": users_data}), status=status.HTTP_200_OK)

    if request.method == "POST":
        user = User()
        return save_user(request, user, status.HTTP_201_CREATED)

    return HttpResponse(json.dumps({"detail": "Wrong method"}), status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['GET', 'PUT', 'DELETE'])
def user(request, user_id):
    if request.user.is_anonymous:
        return HttpResponse(json.dumps({"detail": "Not authorized"}), status=status.HTTP_401_UNAUTHORIZED)

    try:
        user = User.objects.get(pk=user_id)
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({"detail": "Not found"}), status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return HttpResponse(json.dumps({"data": serialize_user(user)}), status=status.HTTP_200_OK)

    if request.method == "PUT":
        return save_user(request, user, status.HTTP_200_OK)

    if request.method == "DELETE":
        user.delete()
        return HttpResponse(json.dumps({"detail": "deleted"}), status=status.HTTP_410_GONE)

    return HttpResponse(json.dumps({"detail": "Wrong method"}), status=status.HTTP_501_NOT_IMPLEMENTED)