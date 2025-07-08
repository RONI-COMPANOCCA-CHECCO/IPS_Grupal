"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  User,
  Heart,
  LogOut,
  X,
  AlertCircle,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";
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
  pais?: string;
  provincia?: string;
  ciudad?: string;
}

interface Favorito {
  id: number;
  proyecto: string;
  proyecto_nombre: string;
}

interface Recomendacion {
  id: number;
  nombre: string;
  tipo: string;
  direccion: string;
  rating: number;
  distancia?: string;
  imagen?: string;
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
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecomendaciones, setLoadingRecomendaciones] = useState(false);
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
  // Función para cargar recomendaciones
  const cargarRecomendaciones = async (usuario: Usuario) => {
    console.log("Intentando cargar recomendaciones para:", usuario); // Debug

    if (!usuario.pais || !usuario.provincia || !usuario.ciudad) {
      console.log("Datos de ubicación faltantes:", {
        pais: usuario.pais,
        provincia: usuario.provincia,
        distrito: usuario.ciudad,
      }); // Debug
      return;
    }

    setLoadingRecomendaciones(true);

    try {
      const token = localStorage.getItem("token");

      // Debug: Verificar que el token existe
      console.log("Token encontrado:", token ? "Sí" : "No");
      console.log(
        "Token (primeros 20 caracteres):",
        token?.substring(0, 20) + "..."
      );

      if (!token) {
        throw new Error(
          "Token no encontrado. Por favor, inicia sesión nuevamente."
        );
      }

      const url = `http://localhost:8000/api/recomendaciones/?pais=${encodeURIComponent(
        usuario.pais
      )}&provincia=${encodeURIComponent(
        usuario.provincia
      )}&ciudad=${encodeURIComponent(usuario.ciudad)}`;

      console.log("URL de la petición:", url); // Debug

      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Debug: Mostrar detalles de la respuesta
      console.log("Status de respuesta:", response.status);
      console.log(
        "Headers de respuesta:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        // Intentar obtener más detalles del error
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = await response.text();
        }

        console.error("Error del servidor:", {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
        });

        if (response.status === 401) {
          // Token inválido o expirado
          localStorage.removeItem("token");
          throw new Error(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Recomendaciones recibidas:", data); // Debug
      setRecomendaciones(data);

      if (data.length > 0) {
        showToast(`${data.length} recomendación(es) encontrada(s)`, "success");
      } else {
        showToast(
          "No se encontraron recomendaciones para tu ubicación",
          "info"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las recomendaciones";
      console.error("Error cargando recomendaciones:", err); // Debug
      showToast(errorMessage, "error");
    } finally {
      setLoadingRecomendaciones(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser && show) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Usuario cargado:", parsedUser); // Debug
        setUsuario(parsedUser);
        cargarFavoritos(parsedUser.id);
        cargarRecomendaciones(parsedUser);
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

  // Función para renderizar estrellas
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} className="star-filled" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={12} className="star-half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} className="star-empty" />);
    }

    return stars;
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
                  {usuario.ciudad && usuario.provincia && usuario.pais && (
                    <p className="user-location">
                      <MapPin size={12} className="me-1" />
                      {usuario.ciudad}, {usuario.provincia}, {usuario.pais}
                    </p>
                  )}
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

              {/* Recommendations Section */}
              <div className="recommendations-section">
                <div className="section-header">
                  <MapPin size={20} className="section-icon" />
                  <h6 className="section-title">Recomendaciones Cercanas</h6>
                  {recomendaciones.length > 0 && (
                    <span className="recommendations-count">
                      {recomendaciones.length}
                    </span>
                  )}
                </div>

                {/* Debug info */}
                {usuario && (
                  <div
                    className="debug-info"
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "10px",
                    }}
                  >
                    <p>
                      Ubicación: {usuario.pais || "N/A"} -{" "}
                      {usuario.provincia || "N/A"} - {usuario.ciudad || "N/A"}
                    </p>
                    <p>
                      Estado:{" "}
                      {loadingRecomendaciones
                        ? "Cargando..."
                        : `${recomendaciones.length} recomendaciones`}
                    </p>
                  </div>
                )}

                {loadingRecomendaciones && (
                  <div className="loading-message">
                    <Loader2 size={16} className="spinner me-2" />
                    Cargando recomendaciones...
                  </div>
                )}

                {recomendaciones.length > 0 ? (
                  <div className="recommendations-list">
                    {recomendaciones.map((recomendacion) => (
                      <div
                        key={recomendacion.id}
                        className="recommendation-item"
                      >
                        <div className="recommendation-content">
                          <div className="recommendation-header">
                            <h6 className="recommendation-name">
                              {recomendacion.nombre}
                            </h6>
                            <div className="recommendation-rating">
                              {renderStars(recomendacion.rating)}
                              <span className="rating-value">
                                ({recomendacion.rating})
                              </span>
                            </div>
                          </div>
                          <p className="recommendation-type">
                            {recomendacion.tipo}
                          </p>
                          <p className="recommendation-address">
                            <MapPin size={12} className="me-1" />
                            {recomendacion.direccion}
                          </p>
                          {recomendacion.distancia && (
                            <p className="recommendation-distance">
                              📍 {recomendacion.distancia}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !loadingRecomendaciones && (
                    <div className="empty-recommendations">
                      <MapPin size={32} className="empty-icon" />
                      <p className="empty-text">
                        No hay recomendaciones disponibles
                      </p>
                      <small className="empty-subtext">
                        {!usuario.pais || !usuario.provincia || !usuario.ciudad
                          ? "Completa tu dirección en el perfil para ver recomendaciones"
                          : "No encontramos lugares recomendados en tu zona"}
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
