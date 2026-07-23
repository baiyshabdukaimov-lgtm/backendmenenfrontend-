from django.http import JsonResponse
from django.urls import include, path


def read_root(request):
    return JsonResponse({"message": "Backend is running"})

urlpatterns = [
    path("", read_root),
    path("api/", include("accounts.urls")),
]
