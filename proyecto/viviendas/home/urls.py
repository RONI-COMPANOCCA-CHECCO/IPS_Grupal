from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import LoginAPIView, FavoritoDeleteView

# Configurar el router para el ViewSet
router = DefaultRouter()
router.register(r'favoritos', views.FavoritoViewSet, basename='favorito')

urlpatterns = [
    path('api/proyectos/', views.ProyectoListCreate.as_view(), name='proyecto-list'),
    path('api/proyectos/<int:pk>/', views.ProyectoDetail.as_view(), name='proyecto-detail'),
    path('api/usuarios/', views.UsuarioListCreate.as_view(), name='usuario-list'),
    
    # ✅ USAR VIEWSET: Esto manejará automáticamente:
    # GET /api/favoritos/ -> Listar favoritos del usuario autenticado
    # POST /api/favoritos/ -> Crear nuevo favorito
    # GET /api/favoritos/{id}/ -> Obtener favorito específico
    # PUT/PATCH /api/favoritos/{id}/ -> Actualizar favorito
    # DELETE /api/favoritos/{id}/ -> Eliminar favorito
    path('api/', include(router.urls)),
    
    # ❌ ELIMINAR: Esta línea causaba conflicto
    # path('api/favoritos/', views.FavoritoListCreate.as_view(), name='favorito-list'),
    
    path('api/notificaciones/', views.NotificacionListCreate.as_view(), name='notificacion-list'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
    
    # 🗑️ OPCIONAL: Puedes mantener esta ruta o usar la del ViewSet
    path("api/eliminar-favorito/", FavoritoDeleteView.as_view(), name="favorito-eliminar"),
]