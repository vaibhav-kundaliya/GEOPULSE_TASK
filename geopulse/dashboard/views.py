from ast import Set
from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import JsonResponse
import json

# Create your views here.
def root(request):
    file = open("..\GEOPULSE_TASK\Pune_prj 1.geojson")
    return render(request, "root.html")

def get_cities(request, page_no):
    file = open("..\GEOPULSE_TASK\Pune_prj 1.geojson")
    data = json.load(file)
    cities = set()
    for i in data['features']:
        cities.add(i['properties']['District'])
    page = Paginator(list(cities), 20)
    return JsonResponse({
            'cities': page.page(page_no).object_list,
            'has_next': page.page(page_no).has_next()
        })

def get_talukas(request, city, page_no):
    print(city)
    file = open("..\GEOPULSE_TASK\Pune_prj 1.geojson")
    data = json.load(file)
    taluka = set()
    for i in data['features']:
        if i['properties']['District'] in city.split(","):
            taluka.add(i['properties']['Taluka'])

    page = Paginator(list(taluka), 20)
    return JsonResponse({
            'talukas': page.page(page_no).object_list,
            'has_next': page.page(page_no).has_next()
        })

def get_villages(request, city, taluka, page_no):
    file = open("..\GEOPULSE_TASK\Pune_prj 1.geojson")
    data = json.load(file)
    village = []
    for i in data['features']:
        if i['properties']['District'] in city.split(",") and i['properties']['Taluka'] in taluka.split(","):
            village.append({"village":i['properties']['Village'], "CCODE":i['properties']['CCODE']})

    page = Paginator(village, 20)
    return JsonResponse({
            'villages': page.page(page_no).object_list,
            'has_next': page.page(page_no).has_next()
        })

def get_cordinates(request, ccode):
    print(ccode)
    file = open("..\GEOPULSE_TASK\Pune_prj 1.geojson")
    data = json.load(file)
    for i in data['features']:
        if i['properties']['CCODE'] == ccode:
            cordinates = i['geometry']['coordinates']
            for i in range(len(cordinates)):
                
            return JsonResponse({
                "properties": i['geometry']['coordinates']
            })
    return JsonResponse({
        "status_code":500
    })