from django.contrib import admin
from .models import Proyecto, Usuario, Favorito, Notificacion

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_completo', 'correo', 'pais', 'fecha_registro')
    search_fields = ('nombre_completo', 'correo')
    list_filter = ('pais', 'provincia', 'ciudad')

admin.site.register(Proyecto)
admin.site.register(Favorito)
admin.site.register(Notificacion)
