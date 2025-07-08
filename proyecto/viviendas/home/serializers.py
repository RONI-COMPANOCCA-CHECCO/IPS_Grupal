from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Proyecto, Usuario, Favorito, Notificacion


class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    contrasena = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'correo', 'nombre_completo', 'contrasena',
            'pais', 'provincia', 'ciudad'
        ]

    def create(self, validated_data):
        password = validated_data.pop('contrasena')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user

    
class FavoritoSerializer(serializers.ModelSerializer):
    proyecto_nombre = serializers.CharField(source='proyecto.nombre', read_only=True)

    class Meta:
        model = Favorito
        fields = ['id', 'usuario', 'proyecto', 'fecha_agregado', 'proyecto_nombre']
        read_only_fields = ['usuario', 'fecha_agregado', 'proyecto_nombre']


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'
