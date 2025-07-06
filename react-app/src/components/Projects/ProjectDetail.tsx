"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Badge,
  ListGroup,
  Card,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Building,
  FileText,
  Clock,
  Target,
  Users,
  Briefcase,
  Map,
} from "lucide-react";

interface ProjectDetailsModalProps {
  show: boolean;
  onHide: () => void;
  project: {
    id: string;
    nombre: string;
    descripcion: string;
    departamento: string;
    provincia: string;
    distrito: string;
    tipo: string;
    estado: "activo" | "pausado" | "completado";
    presupuesto: number;
    ubigeo?: string; // Additional details for the modal
    fechaInicio?: string;
    fechaFin?: string;
    beneficiarios?: number;
    responsable?: {
      nombre: string;
      cargo: string;
      telefono: string;
      email: string;
    };
    ubicacion?: {
      coordenadas?: {
        lat: number;
        lng: number;
      };
      direccion?: string;
      referencia?: string;
    };
    especificaciones?: {
      objetivos?: string[];
      alcance?: string;
      metodologia?: string;
      entregables?: string[];
    };
    contactos?: {
      supervisor?: {
        nombre: string;
        telefono: string;
        email: string;
      };
      coordinador?: {
        nombre: string;
        telefono: string;
        email: string;
      };
    };
  } | null;
}

// Componente del mapa optimizado para Vite con soporte para ubigeo
const MapComponent: React.FC<{
  lat?: number;
  lng?: number;
  projectName: string;
  address?: string;
  ubigeo?: string;
  departamento: string;
  provincia: string;
  distrito: string;
}> = ({
  lat,
  lng,
  projectName,
  address,
  ubigeo,
  departamento,
  provincia,
  distrito,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(lat && lng ? { lat, lng } : null);
  const [loading, setLoading] = useState(!coordinates);

  // Efecto para cargar coordenadas si no están disponibles
  useEffect(() => {
    if (!coordinates && ubigeo) {
      const loadCoordinates = async () => {
        setLoading(true);

        // Función para obtener coordenadas desde ubigeo
        const getCoords = async (): Promise<{
          lat: number;
          lng: number;
        } | null> => {
          try {
            // Intentar con API de ubigeo peruano
            const response = await fetch(
              `https://api.ubigeo.pe/api/v1/ubigeo/${ubigeo}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.lat && data.lng) {
                return { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
              }
            }
          } catch (error) {
            console.log("API ubigeo no disponible, usando geocodificación");
          }

          // Fallback: geocodificar usando el nombre de la ubicación
          try {
            const query = `${distrito}, ${provincia}, ${departamento}, Peru`;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
              )}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              return { lat: parseFloat(lat), lng: parseFloat(lon) };
            }
          } catch (error) {
            console.error("Error geocodificando:", error);
          }
          return null;
        };

        const coords = await getCoords();
        setCoordinates(coords);
        setLoading(false);
      };

      loadCoordinates();
    }
  }, [ubigeo, departamento, provincia, distrito, coordinates]);

  useEffect(() => {
    // Cargar Leaflet dinámicamente para Vite
    const loadLeaflet = async () => {
      try {
        // Cargar CSS de Leaflet
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const linkElement = document.createElement("link");
          linkElement.rel = "stylesheet";
          linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          linkElement.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          linkElement.crossOrigin = "";
          document.head.appendChild(linkElement);
        }

        // Cargar JS de Leaflet
        if (!(window as any).L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.integrity =
            "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
          script.crossOrigin = "";

          script.onload = () => {
            setLeafletLoaded(true);
          };

          script.onerror = () => {
            console.error("Error loading Leaflet");
          };

          document.head.appendChild(script);
        } else {
          setLeafletLoaded(true);
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !coordinates) return;

    // Limpiar mapa anterior
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    try {
      const L = (window as any).L;

      // Crear el mapa
      const map = L.map(mapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: true,
      });

      // Agregar capa de OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Crear icono personalizado
      const customIcon = L.divIcon({
        html: `
          <div style="
            background: #dc3545;
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            📍
          </div>
        `,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      // Agregar marcador
      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      // Agregar popup mejorado
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
          <h6 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: 600;">
            ${projectName}
          </h6>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.3;">
            📍 ${distrito}, ${provincia}, ${departamento}
          </p>
          ${
            address
              ? `
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; line-height: 1.3;">
              🏠 ${address}
            </p>
          `
              : ""
          }
          ${
            ubigeo
              ? `
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #888;">
              <strong>Ubigeo:</strong> ${ubigeo}
            </p>
          `
              : ""
          }
          <p style="margin: 0; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 6px;">
            <strong>Coordenadas:</strong><br>
            Lat: ${coordinates.lat.toFixed(6)}, Lng: ${coordinates.lng.toFixed(
        6
      )}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: "custom-popup",
      });

      // Abrir popup automáticamente
      marker.openPopup();

      mapInstanceRef.current = map;

      // Ajustar el mapa después de un breve delay para asegurar que se renderice correctamente
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error("Error creating map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    leafletLoaded,
    coordinates,
    projectName,
    address,
    ubigeo,
    distrito,
    provincia,
    departamento,
  ]);

  if (!leafletLoaded || loading) {
    return (
      <div
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center", color: "#6c757d" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
          <div>{loading ? "Obteniendo ubicación..." : "Cargando mapa..."}</div>
        </div>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center", color: "#6c757d" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>❌</div>
          <div>No se pudo obtener la ubicación</div>
          <small>Ubigeo: {ubigeo || "No disponible"}</small>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #ddd",
        backgroundColor: "#f8f9fa",
      }}
    />
  );
};

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  show,
  onHide,
  project,
}) => {
  if (!project) return null;

  const getStatusBadge = (estado: string) => {
    const colors = {
      activo: "success",
      pausado: "warning",
      completado: "primary",
    } as const;

    return (
      <Badge bg={colors[estado as keyof typeof colors]} className="text-white">
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasCoordinates =
    project.ubicacion?.coordenadas?.lat && project.ubicacion?.coordenadas?.lng;
  const canShowMap = hasCoordinates || project.ubigeo;
  const hasAddress = project.ubicacion?.direccion;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="project-details-modal"
    >
      <Modal.Header className="project-modal-header">
        <div className="d-flex justify-content-between align-items-start w-100">
          <div>
            <Modal.Title className="project-modal-title h4 mb-2">
              {project.nombre}
            </Modal.Title>
            <div className="d-flex align-items-center gap-3">
              {getStatusBadge(project.estado)}
              <span className="project-modal-type">
                <Building size={16} className="me-1" />
                {project.tipo}
              </span>
            </div>
          </div>
          <Button
            variant="link"
            onClick={onHide}
            className="modal-close-button p-0"
          >
            <X size={24} />
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body className="project-modal-body">
        <Row>
          {/* Left Column - Main Information */}
          <Col lg={8}>
            {/* Description */}
            <Card className="info-card mb-4">
              <Card.Header className="info-card-header">
                <h5 className="mb-0 d-flex align-items-center">
                  <FileText size={20} className="me-2" />
                  Descripción del Proyecto
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="project-modal-description">
                  {project.descripcion}
                </p>
              </Card.Body>
            </Card>

            {/* Specifications */}
            {project.especificaciones && (
              <Card className="info-card mb-4">
                <Card.Header className="info-card-header">
                  <h5 className="mb-0 d-flex align-items-center">
                    <Target size={20} className="me-2" />
                    Especificaciones Técnicas
                  </h5>
                </Card.Header>
                <Card.Body>
                  {project.especificaciones.objetivos && (
                    <div className="mb-3">
                      <h6 className="spec-subtitle">Objetivos:</h6>
                      <ListGroup variant="flush">
                        {project.especificaciones.objetivos.map(
                          (objetivo, index) => (
                            <ListGroup.Item
                              key={index}
                              className="spec-list-item"
                            >
                              • {objetivo}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </div>
                  )}

                  {project.especificaciones.alcance && (
                    <div className="mb-3">
                      <h6 className="spec-subtitle">Alcance:</h6>
                      <p className="spec-text">
                        {project.especificaciones.alcance}
                      </p>
                    </div>
                  )}

                  {project.especificaciones.metodologia && (
                    <div className="mb-3">
                      <h6 className="spec-subtitle">Metodología:</h6>
                      <p className="spec-text">
                        {project.especificaciones.metodologia}
                      </p>
                    </div>
                  )}

                  {project.especificaciones.entregables && (
                    <div>
                      <h6 className="spec-subtitle">Entregables:</h6>
                      <ListGroup variant="flush">
                        {project.especificaciones.entregables.map(
                          (entregable, index) => (
                            <ListGroup.Item
                              key={index}
                              className="spec-list-item"
                            >
                              • {entregable}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Location Details with Map */}
            <Card className="info-card mb-4">
              <Card.Header className="info-card-header">
                <h5 className="mb-0 d-flex align-items-center">
                  <MapPin size={20} className="me-2" />
                  Ubicación Geográfica
                </h5>
              </Card.Header>
              <Card.Body>
                <Tabs
                  defaultActiveKey="details"
                  id="location-tabs"
                  className="mb-3"
                >
                  <Tab eventKey="details" title="Detalles">
                    <Row>
                      <Col md={6}>
                        <div className="location-detail">
                          <strong>Departamento:</strong> {project.departamento}
                        </div>
                        <div className="location-detail">
                          <strong>Provincia:</strong> {project.provincia}
                        </div>
                        <div className="location-detail">
                          <strong>Distrito:</strong> {project.distrito}
                        </div>
                        {project.ubigeo && (
                          <div className="location-detail">
                            <strong>Ubigeo:</strong> {project.ubigeo}
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        {project.ubicacion?.direccion && (
                          <div className="location-detail">
                            <strong>Dirección:</strong>{" "}
                            {project.ubicacion.direccion}
                          </div>
                        )}
                        {project.ubicacion?.referencia && (
                          <div className="location-detail">
                            <strong>Referencia:</strong>{" "}
                            {project.ubicacion.referencia}
                          </div>
                        )}
                        {project.ubicacion?.coordenadas && (
                          <div className="location-detail">
                            <strong>Coordenadas:</strong>
                            <br />
                            <small className="text-muted">
                              Lat: {project.ubicacion.coordenadas.lat}, Lng:{" "}
                              {project.ubicacion.coordenadas.lng}
                            </small>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Tab>

                  {canShowMap && (
                    <Tab
                      eventKey="map"
                      title={
                        <span>
                          <Map size={16} className="me-1" />
                          Mapa
                        </span>
                      }
                    >
                      <div className="map-container">
                        <MapComponent
                          lat={project.ubicacion?.coordenadas?.lat}
                          lng={project.ubicacion?.coordenadas?.lng}
                          projectName={project.nombre}
                          address={project.ubicacion?.direccion}
                          ubigeo={project.ubigeo}
                          departamento={project.departamento}
                          provincia={project.provincia}
                          distrito={project.distrito}
                        />
                        <div className="mt-2 text-muted small">
                          <strong>Nota:</strong> Haz clic en el marcador para
                          ver más detalles
                          {project.ubigeo && !hasCoordinates && (
                            <>
                              <br />
                              <em>
                                Ubicación aproximada basada en ubigeo:{" "}
                                {project.ubigeo}
                              </em>
                            </>
                          )}
                        </div>
                      </div>
                    </Tab>
                  )}
                </Tabs>

                {!canShowMap && hasAddress && (
                  <div className="alert alert-info mt-3">
                    <div className="d-flex align-items-center">
                      <Map size={16} className="me-2" />
                      <div>
                        <strong>Mapa no disponible</strong>
                        <br />
                        <small>
                          Para mostrar el mapa, se necesitan coordenadas exactas
                          o un código ubigeo válido.
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Project Details & Contacts */}
          <Col lg={4}>
            {/* Project Summary */}
            <Card className="info-card mb-4">
              <Card.Header className="info-card-header">
                <h5 className="mb-0 d-flex align-items-center">
                  <Briefcase size={20} className="me-2" />
                  Resumen del Proyecto
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="summary-item">
                  <DollarSign size={16} className="summary-icon" />
                  <div>
                    <div className="summary-label">Presupuesto</div>
                    <div className="summary-value budget">
                      {formatCurrency(project.presupuesto)}
                    </div>
                  </div>
                </div>

                <div className="summary-item">
                  <Calendar size={16} className="summary-icon" />
                  <div>
                    <div className="summary-label">Fecha de Inicio</div>
                    <div className="summary-value">
                      {formatDate(project.fechaInicio)}
                    </div>
                  </div>
                </div>

                <div className="summary-item">
                  <Clock size={16} className="summary-icon" />
                  <div>
                    <div className="summary-label">Fecha de Finalización</div>
                    <div className="summary-value">
                      {formatDate(project.fechaFin)}
                    </div>
                  </div>
                </div>

                {project.beneficiarios && (
                  <div className="summary-item">
                    <Users size={16} className="summary-icon" />
                    <div>
                      <div className="summary-label">Beneficiarios</div>
                      <div className="summary-value">
                        {project.beneficiarios.toLocaleString()} personas
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Responsible Person */}
            {project.responsable && (
              <Card className="info-card mb-4">
                <Card.Header className="info-card-header">
                  <h5 className="mb-0 d-flex align-items-center">
                    <User size={20} className="me-2" />
                    Responsable del Proyecto
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="contact-info">
                    <div className="contact-name">
                      {project.responsable.nombre}
                    </div>
                    <div className="contact-role">
                      {project.responsable.cargo}
                    </div>
                    <div className="contact-details">
                      <div className="contact-item">
                        <Phone size={14} className="me-2" />
                        <a
                          href={`tel:${project.responsable.telefono}`}
                          className="contact-link"
                        >
                          {project.responsable.telefono}
                        </a>
                      </div>
                      <div className="contact-item">
                        <Mail size={14} className="me-2" />
                        <a
                          href={`mailto:${project.responsable.email}`}
                          className="contact-link"
                        >
                          {project.responsable.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Additional Contacts */}
            {project.contactos && (
              <Card className="info-card mb-4">
                <Card.Header className="info-card-header">
                  <h5 className="mb-0 d-flex align-items-center">
                    <Users size={20} className="me-2" />
                    Contactos Adicionales
                  </h5>
                </Card.Header>
                <Card.Body>
                  {project.contactos.supervisor && (
                    <div className="contact-info mb-3">
                      <div className="contact-role-header">Supervisor</div>
                      <div className="contact-name">
                        {project.contactos.supervisor.nombre}
                      </div>
                      <div className="contact-details">
                        <div className="contact-item">
                          <Phone size={14} className="me-2" />
                          <a
                            href={`tel:${project.contactos.supervisor.telefono}`}
                            className="contact-link"
                          >
                            {project.contactos.supervisor.telefono}
                          </a>
                        </div>
                        <div className="contact-item">
                          <Mail size={14} className="me-2" />
                          <a
                            href={`mailto:${project.contactos.supervisor.email}`}
                            className="contact-link"
                          >
                            {project.contactos.supervisor.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.contactos.coordinador && (
                    <div className="contact-info">
                      <div className="contact-role-header">Coordinador</div>
                      <div className="contact-name">
                        {project.contactos.coordinador.nombre}
                      </div>
                      <div className="contact-details">
                        <div className="contact-item">
                          <Phone size={14} className="me-2" />
                          <a
                            href={`tel:${project.contactos.coordinador.telefono}`}
                            className="contact-link"
                          >
                            {project.contactos.coordinador.telefono}
                          </a>
                        </div>
                        <div className="contact-item">
                          <Mail size={14} className="me-2" />
                          <a
                            href={`mailto:${project.contactos.coordinador.email}`}
                            className="contact-link"
                          >
                            {project.contactos.coordinador.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="project-modal-footer">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button className="btn-primary-custom">Contactar Responsable</Button>
      </Modal.Footer>
    </Modal>
  );
};
