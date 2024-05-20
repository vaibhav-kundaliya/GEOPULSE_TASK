from django.urls import include, path
from . import views
urlpatterns = [
    path("", views.root),
    path("<int:page_no>/", views.get_cities),
    path("<str:city>/<int:page_no>/", views.get_talukas),
    path("<str:city>/<str:taluka>/<int:page_no>/", views.get_villages),
    path("get_cords/<str:ccode>", views.get_cordinates)
]
