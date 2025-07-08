from home.models import Usuario

def verificar_y_arreglar_contrasenas():
    usuarios = Usuario.objects.all()
    print(f"Revisando {usuarios.count()} usuarios...\n")
    for user in usuarios:
        password = user.password
        if not password.startswith("pbkdf2_") and not password.startswith("argon2$") and not password.startswith("bcrypt$"):
            print(f"[!] {user.correo} tenía una contraseña no encriptada. Se ha corregido.")
            user.set_password("clave12345")
            user.save()
        else:
            print(f"[OK] {user.correo} tiene una contraseña segura.")

verificar_y_arreglar_contrasenas()
