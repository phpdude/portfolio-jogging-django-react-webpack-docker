from macrosurl import url
from project.apps.spa import views

urlpatterns = [
    url('.*', views.Index, name='index')
]
