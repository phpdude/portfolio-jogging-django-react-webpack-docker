from django.conf.urls import include, url
from project.apps.api.api import UserViewSet, TimeViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'times', TimeViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
