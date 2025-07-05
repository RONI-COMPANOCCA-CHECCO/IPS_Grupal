import { useEffect, useState } from "react";

interface SidebarUsuarioProps {
  show: boolean;
  onClose: () => void;
  onFavoriteUpdate?: () => void; // Callback para actualizar la lista principal
}

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

interface Favorito {
  id: number;
  proyecto: string;
  proyecto_nombre: string;
}

export const SidebarUsuario: React.FC<SidebarUsuarioProps> = ({
  show,
  onClose,
  onFavoriteUpdate,
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar favoritos
  const cargarFavoritos = async (usuarioId: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/favoritos/?usuario=${usuarioId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar favoritos");
      }

      const data = await response.json();
      setFavoritos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los favoritos";
      setError(errorMessage);
      console.error("Error cargando favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser && show) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
        cargarFavoritos(parsedUser.id);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar la información del usuario";
        setError(errorMessage);
        console.error("Error parsing user data:", err);
      }
    }
  }, [show]); // Recargar cuando se abre el sidebar

  // Función para eliminar favorito
  const eliminarFavorito = async (proyectoId: string) => {
    if (!usuario) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/eliminar-favorito/?usuario=${usuario.id}&proyecto=${proyectoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar favorito");
      }

      // Actualizar la lista local
      setFavoritos((prev) => prev.filter((f) => f.proyecto !== proyectoId));

      // Notificar al componente padre
      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "No se pudo eliminar el favorito";
      setError(errorMessage);
      console.error("Error eliminando favorito:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      tabIndex={-1}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Mi Cuenta</h5>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        {usuario ? (
          <>
            {/* Información del usuario */}
            <div className="mb-4">
              <p className="mb-2">
                <strong>Nombre:</strong> {usuario.nombre}
              </p>
              <p className="mb-0">
                <strong>Correo:</strong> {usuario.correo}
              </p>
            </div>

            {/* Sección de favoritos */}
            <div className="mb-4">
              <h5 className="mb-3">Favoritos</h5>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {loading && (
                <div className="text-center mb-3">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Cargando...
                </div>
              )}

              {favoritos.length > 0 ? (
                <div className="list-group">
                  {favoritos.map((favorito) => (
                    <div
                      key={favorito.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{favorito.proyecto_nombre || "Proyecto"}</span>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => eliminarFavorito(favorito.proyecto)}
                        disabled={loading}
                        title="Eliminar de favoritos"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <p className="text-muted">Aún no tienes favoritos.</p>
                )
              )}
            </div>

            {/* Botón de cerrar sesión */}
            <button
              type="button"
              className="btn btn-outline-danger w-100 mt-auto"
              onClick={handleLogout}
              disabled={loading}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <p className="text-muted">No has iniciado sesión.</p>
        )}
      </div>
    </div>
  );
};
