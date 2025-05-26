from django.db import models

class ProyectoVivienda(models.Model):
    nombre = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    programa = models.CharField(max_length=100)  # Techo Propio, BBP, etc.
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    requisitos = models.TextField()
    contacto = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre