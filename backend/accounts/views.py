from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import AuthSerializer


@api_view(["POST"])
def register_view(request):
    serializer = AuthSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    if User.objects.filter(username=email).exists():
        return Response(
            {"detail": "Бул email мурунтан катталган!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(username=email, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Каттоо ийгиликтүү аяктады!",
        "token": token.key,
    })


@api_view(["POST"])
def login_view(request):
    serializer = AuthSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    user = authenticate(username=email, password=password)
    if user is None:
        return Response(
            {"detail": "Gmail же пароль ката!"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Куш келиңиз!",
        "token": token.key,
    })
