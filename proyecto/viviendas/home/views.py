from django.shortcuts import render
from .models import ProyectoVivienda

def lista_proyectos(request):
    proyectos = ProyectoVivienda.objects.all()
    return render(request, 'home/lista_proyectos.html', {'proyectos': proyectos})
