from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Proyecto, Favorito, Notificacion
from django.forms import ModelForm
from django.contrib.auth.forms import ReadOnlyPasswordHashField

# Formulario para crear usuario desde el admin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ('correo', 'nombre_completo', 'pais', 'provincia', 'ciudad')

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = Usuario
        fields = ('correo', 'nombre_completo', 'pais', 'provincia', 'ciudad', 'is_staff', 'is_superuser')

class UsuarioAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = Usuario

    list_display = ('id', 'nombre_completo', 'correo', 'pais', 'fecha_registro', 'is_staff', 'is_superuser')
    list_filter = ('pais', 'provincia', 'ciudad', 'is_staff', 'is_superuser')
    search_fields = ('nombre_completo', 'correo')
    ordering = ('correo',)

    fieldsets = (
        (None, {'fields': ('correo', 'password')}),
        ('Información personal', {'fields': ('nombre_completo', 'pais', 'provincia', 'ciudad')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'fecha_registro')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('correo', 'nombre_completo', 'pais', 'provincia', 'ciudad', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Proyecto)
admin.site.register(Favorito)
admin.site.register(Notificacion)
