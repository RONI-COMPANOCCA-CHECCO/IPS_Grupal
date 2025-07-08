from rest_framework import generics, permissions
from .models import Proyecto, Usuario, Favorito, Notificacion
from .serializers import (
    ProyectoSerializer, UsuarioSerializer,
    FavoritoSerializer, NotificacionSerializer
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Usuario
from rest_framework.authtoken.models import Token
import uuid
from rest_framework.authentication import TokenAuthentication
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from django.db.models import Q

class ProyectoListCreate(generics.ListCreateAPIView):
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        queryset = Proyecto.objects.all()

        departamento = self.request.query_params.get('departamento')
        provincia = self.request.query_params.get('provincia')
        tipo = self.request.query_params.get('tipo')

        if departamento:
            queryset = queryset.filter(departamento__iexact=departamento)
        if provincia:
            queryset = queryset.filter(provincia__icontains=provincia)
        if tipo:
            queryset = queryset.filter(tipo__iexact=tipo)

        return queryset

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
    permission_classes = [AllowAny] 

class ProyectoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer


# ✅ CORRECCIÓN: Agregar autenticación y permisos
class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

class NotificacionListCreate(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    authentication_classes = [TokenAuthentication]  # 🔑 Agregar autenticación
    permission_classes = [IsAuthenticated]          # 🔒 Agregar permisos

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        correo = request.data.get('correo')
        contrasena = request.data.get('contrasena')

        if not correo or not contrasena:
            return Response({'error': 'Credenciales requeridas'}, status=400)

        try:
            usuario = Usuario.objects.get(correo=correo)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)

        if not usuario.check_password(contrasena):
            return Response({'error': 'Contraseña incorrecta'}, status=401)

        token, _ = Token.objects.get_or_create(user=usuario)

        # ✅ Aquí usamos el serializer
        usuario_serializado = UsuarioSerializer(usuario)

        return Response({
            'token': token.key,
            'usuario': usuario_serializado.data
        })


class FavoritoDeleteView(APIView):
    authentication_classes = [TokenAuthentication]  # 🔑 Agregar autenticación
    permission_classes = [IsAuthenticated]          # 🔒 Agregar permisos
    
    def delete(self, request):
        user_id = request.query_params.get("usuario")
        proyecto_id = request.query_params.get("proyecto")

        if not user_id or not proyecto_id:
            return Response({"error": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)

        favorito = Favorito.objects.filter(usuario_id=user_id, proyecto_id=proyecto_id).first()
        if favorito:
            favorito.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)

class FavoritoViewSet(viewsets.ModelViewSet):
    queryset = Favorito.objects.all()
    serializer_class = FavoritoSerializer
    authentication_classes = [TokenAuthentication]  # 🔑 Agregar autenticación
    permission_classes = [IsAuthenticated]          # 🔒 Ya tenías permisos

    def get_queryset(self):
        """Mostrar solo los favoritos del usuario autenticado"""
        return Favorito.objects.filter(usuario=self.request.user)

    def create(self, request, *args, **kwargs):
        """Manejar creación con funcionalidad de toggle"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        proyecto = serializer.validated_data.get('proyecto')
        usuario = self.request.user
        
        # Verificar si ya existe el favorito
        existing_favorite = Favorito.objects.filter(
            usuario=usuario,
            proyecto=proyecto
        ).first()
        
        if existing_favorite:
            # Si ya existe, eliminarlo (toggle off)
            existing_favorite.delete()
            return Response(
                {"message": "Proyecto removido de favoritos"}, 
                status=status.HTTP_200_OK
            )
        
        # Si no existe, crear el favorito
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        except IntegrityError:
            return Response(
                {"error": "Error al procesar favorito"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        """Asignar automáticamente el usuario autenticado al crear favorito"""
        print("Usuario autenticado:", self.request.user)
        serializer.save(usuario=self.request.user)

class RecomendacionesAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pais = request.query_params.get("pais")
        provincia = request.query_params.get("provincia")
        ciudad = request.query_params.get("ciudad")

        q_filter = Q()

        if pais:
            q_filter |= Q(departamento__icontains=pais)
        if provincia:
            q_filter |= Q(provincia__icontains=provincia)
        if ciudad:
            q_filter |= Q(distrito__icontains=ciudad)

        if not q_filter:
            return Response([], status=status.HTTP_200_OK)

        proyectos = Proyecto.objects.filter(q_filter)

        data = [
            {
                "id": p.id,
                "nombre": p.nombre,
                "tipo": p.tipo,
                "direccion": f"{p.distrito}, {p.provincia}",
                "rating": 4.2,
                "distancia": None,
                "imagen": None,
            }
            for p in proyectos[:10]
        ]

        return Response(data)