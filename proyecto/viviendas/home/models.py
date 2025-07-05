from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class Proyecto(models.Model):
    """Información principal de cada proyecto de vivienda."""
    nombre        = models.CharField(max_length=150)
    descripcion   = models.TextField()
    departamento  = models.CharField(max_length=80)
    provincia     = models.CharField(max_length=80)
    distrito      = models.CharField(max_length=80)
    ubigeo        = models.CharField(max_length=6)
    beneficiarios = models.PositiveIntegerField(null=True, blank=True)
    avance        = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True, blank=True,
        help_text="Porcentaje de avance (0-100)"
    )
    fecha_inicio  = models.DateField(null=True, blank=True)
    fecha_fin     = models.DateField(null=True, blank=True)
    tipo          = models.CharField(max_length=50)        # p.ej. “Techo Propio”
    estado        = models.CharField(max_length=20)        # p.ej. “En curso”
    presupuesto   = models.DecimalField(max_digits=14, decimal_places=2)
    ifi           = models.CharField(max_length=120)       # Institución financiera
    tipo_ifi      = models.CharField(max_length=60)

    class Meta:
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre



class UsuarioManager(BaseUserManager):
    def create_user(self, correo, contrasena=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')

        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(contrasena)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, contrasena=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, contrasena, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    nombre_completo = models.CharField(max_length=120)
    correo          = models.EmailField(unique=True)
    pais            = models.CharField(max_length=80)
    provincia       = models.CharField(max_length=80)
    ciudad          = models.CharField(max_length=80)
    fecha_registro  = models.DateTimeField(auto_now_add=True)
    recibir_email   = models.BooleanField(default=True)

    # Campos requeridos por Django
    is_active = models.BooleanField(default=True)
    is_staff  = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_completo']

    class Meta:
        ordering = ['nombre_completo']

    def __str__(self):
        return self.nombre_completo


class Favorito(models.Model):
    """Proyectos marcados como favoritos por los usuarios."""
    usuario        = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    proyecto       = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    fecha_agregado = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("usuario", "proyecto")
        ordering = ["-fecha_agregado"]

    def __str__(self):
        return f"{self.usuario} → {self.proyecto}"


class Notificacion(models.Model):
    """Registro de cambios de estado de proyectos para cada usuario."""
    usuario          = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    proyecto         = models.ForeignKey(Proyecto, on_delete=models.CASCADE)
    estado_anterior  = models.CharField(max_length=20, null=True, blank=True)
    estado_actual    = models.CharField(max_length=20)
    mensaje          = models.TextField()
    email_enviado    = models.BooleanField(default=False)
    fecha_evento     = models.DateTimeField(auto_now_add=True)
    fecha_envio_mail = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("usuario", "proyecto", "estado_actual")
        ordering = ["-fecha_evento"]

    def __str__(self):
        return f"Notif {self.proyecto} → {self.estado_actual} ({self.usuario})"
