"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { User, Heart, LogOut, X, AlertCircle, Loader2 } from "lucide-react";
import { Toast, ToastContainer } from "react-bootstrap";

interface SidebarUsuarioProps {
  show: boolean;
  onClose: () => void;
  onFavoriteUpdate?: () => void;
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

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Función para mostrar mensajes toast
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const newToast: ToastMessage = {
      id: Date.now(),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 4000);
  };

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

      if (data.length === 0) {
        showToast("No tienes proyectos favoritos aún", "info");
      } else {
        showToast(`${data.length} favorito(s) cargado(s)`, "success");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los favoritos";
      setError(errorMessage);
      showToast(errorMessage, "error");
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
        showToast(errorMessage, "error");
      }
    }
  }, [show]);

  // Función para eliminar favorito
  const eliminarFavorito = async (
    proyectoId: string,
    proyectoNombre: string
  ) => {
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
      showToast(`"${proyectoNombre}" eliminado de favoritos`, "success");

      // Notificar al componente padre
      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "No se pudo eliminar el favorito";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    showToast("Sesión cerrada exitosamente", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      {show && <div className="sidebar-backdrop" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`user-sidebar ${show ? "show" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center">
            <User size={24} className="sidebar-header-icon me-2" />
            <h5 className="sidebar-title mb-0">Mi Cuenta</h5>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="sidebar-body">
          {usuario ? (
            <>
              {/* User Info Card */}
              <div className="user-info-card">
                <div className="user-avatar">
                  <User size={32} />
                </div>
                <div className="user-details">
                  <h6 className="user-name">{usuario.nombre}</h6>
                  <p className="user-email">{usuario.correo}</p>
                </div>
              </div>

              {/* Favorites Section */}
              <div className="favorites-section">
                <div className="section-header">
                  <Heart size={20} className="section-icon" />
                  <h6 className="section-title">Mis Favoritos</h6>
                  {favoritos.length > 0 && (
                    <span className="favorites-count">{favoritos.length}</span>
                  )}
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} className="me-2" />
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="loading-message">
                    <Loader2 size={16} className="spinner me-2" />
                    Cargando favoritos...
                  </div>
                )}

                {favoritos.length > 0 ? (
                  <div className="favorites-list">
                    {favoritos.map((favorito) => (
                      <div key={favorito.id} className="favorite-item">
                        <div className="favorite-content">
                          <Heart size={14} className="favorite-icon" />
                          <span className="favorite-name">
                            {favorito.proyecto_nombre || "Proyecto"}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-favorite-btn"
                          onClick={() =>
                            eliminarFavorito(
                              favorito.proyecto,
                              favorito.proyecto_nombre
                            )
                          }
                          disabled={loading}
                          title="Eliminar de favoritos"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <div className="empty-favorites">
                      <Heart size={32} className="empty-icon" />
                      <p className="empty-text">Aún no tienes favoritos</p>
                      <small className="empty-subtext">
                        Marca proyectos como favoritos para verlos aquí
                      </small>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="no-user-message">
              <User size={48} className="no-user-icon" />
              <p className="no-user-text">No has iniciado sesión</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {usuario && (
          <div className="sidebar-footer">
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut size={16} className="me-2" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-end" className="toast-container-custom">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={true}
            onClose={() => removeToast(toast.id)}
            className={`toast-custom toast-${toast.type}`}
            delay={4000}
            autohide
          >
            <Toast.Header closeButton={false}>
              <div
                className={`toast-indicator toast-indicator-${toast.type}`}
              ></div>
              <strong className="me-auto">
                {toast.type === "success" && "Éxito"}
                {toast.type === "error" && "Error"}
                {toast.type === "info" && "Información"}
              </strong>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
              >
                <X size={14} />
              </button>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
};
