"use client";

import { useState, useEffect } from "react";
import { SidebarUsuario } from "./SidebarUsuario";
import { User } from "lucide-react";
import { fetchProjects } from "../../api/proyects";
import {
  Search,
  MapPin,
  Filter,
  Heart,
  Building,
  GraduationCap,
  Hospital,
  Droplets,
} from "lucide-react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Card,
  Badge,
} from "react-bootstrap";

interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  tipo: string;
  estado: "activo" | "pausado" | "completado";
  presupuesto: number;
  isFavorite: boolean;
}
const tiposProyecto = [
  "Vivienda",
  "Educación",
  "Salud",
  "Saneamiento",
  "Infraestructura",
  "Desarrollo Social",
];

const departamentos = [
  "Lima",
  "Cusco",
  "Arequipa",
  "Loreto",
  "Piura",
  "La Libertad",
  "Lambayeque",
  "Ancash",
  "Junín",
  "Ica",
  "Huánuco",
  "San Martín",
  "Cajamarca",
  "Ayacucho",
  "Ucayali",
  "Apurímac",
  "Amazonas",
  "Huancavelica",
  "Moquegua",
  "Pasco",
  "Tacna",
  "Tumbes",
  "Madre de Dios",
  "Puno",
  "Callao",
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const handleFavoriteUpdate = () => {
    // Actualizar la lista principal de proyectos
    console.log("Favoritos actualizados");
  };
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (searchTerm) params.append("search", searchTerm); // opcional
        if (selectedDepartamento)
          params.append("departamento", selectedDepartamento);
        if (selectedProvincia) params.append("provincia", selectedProvincia);
        if (selectedTipo) params.append("tipo", selectedTipo);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8000/api/proyectos/?${params.toString()}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        // Adaptar la respuesta si la API no devuelve "zona"
        const adapted = data.map((item: any) => ({
          ...item,
          zona: {
            departamento: item.departamento,
            provincia: item.provincia,
            distrito: item.distrito,
          },
          isFavorite: false, // puedes reemplazar por datos reales si los manejas
        }));

        setProjects(adapted);
      } catch (err: any) {
        setError(err.message || "Error al cargar proyectos");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [searchTerm, selectedDepartamento, selectedProvincia, selectedTipo]);

  const toggleFavorite = async (projectId: string) => {
    const userRaw = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!userRaw || !token) {
      alert("Debes iniciar sesión");
      return;
    }

    let user;
    try {
      user = JSON.parse(userRaw);
      if (!user?.id) throw new Error("Usuario inválido");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Error al recuperar la sesión";
      alert(`${errorMessage}. Inicia sesión nuevamente.`);
      return;
    }

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      console.error("Proyecto no encontrado");
      return;
    }

    const isAlreadyFavorite = project.isFavorite;

    // Actualización optimista de la UI
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );

    try {
      if (isAlreadyFavorite) {
        // Eliminar favorito
        const response = await fetch(
          `http://localhost:8000/api/eliminar-favorito/?usuario=${user.id}&proyecto=${projectId}`,
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
      } else {
        // Agregar favorito
        const response = await fetch("http://localhost:8000/api/favoritos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ proyecto: projectId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error en el POST:", errorData);
          throw new Error("No se pudo agregar a favoritos");
        }
      }

      // Opcional: Mostrar mensaje de éxito
      const action = isAlreadyFavorite ? "eliminado de" : "agregado a";
      console.log(`Proyecto ${action} favoritos exitosamente`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar favorito";
      console.error("Error actualizando favorito:", error);

      // Revertir el cambio optimista en caso de error
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === projectId ? { ...p, isFavorite: isAlreadyFavorite } : p
        )
      );

      // Mostrar mensaje de error al usuario
      alert(errorMessage);
    }
  };

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

  const getProjectIcon = (tipo: string) => {
    const icons = {
      Vivienda: Building,
      Educación: GraduationCap,
      Salud: Hospital,
      Saneamiento: Droplets,
      Infraestructura: Building,
      "Desarrollo Social": Heart,
    };
    const IconComponent = icons[tipo as keyof typeof icons] || Building;
    return <IconComponent size={16} />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartamento("");
    setSelectedProvincia("");
    setSelectedTipo("");
  };

  return (
    <div className="projects-page-wrapper">
      {/* Header Section */}
      <div className="projects-header">
        <Container>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <MapPin size={40} className="text-light" />
              <h1 className="projects-title display-4 mb-0">
                Proyectos de Desarrollo
              </h1>
            </div>
            <p className="projects-subtitle lead">
              Encuentra proyectos de desarrollo social e infraestructura en tu
              región. Explora iniciativas que están transformando comunidades en
              todo el Perú.
            </p>
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Search and Filter Section */}
        <Card className="search-section mb-4">
          <Card.Body>
            <div className="mb-4">
              <h2 className="search-title h3 d-flex align-items-center">
                <Search size={24} className="me-2" />
                Buscar Proyectos
              </h2>
              <p className="search-description mb-0">
                Utiliza los filtros para encontrar proyectos específicos en tu
                área de interés
              </p>
            </div>

            <Row className="g-3 mb-4">
              <Col lg={4}>
                <Form.Group>
                  <Form.Label className="search-label">
                    Buscar proyecto
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="search-icon-group">
                      <Search size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Nombre o descripción del proyecto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col lg={2}>
                <Form.Group>
                  <Form.Label className="search-label">Departamento</Form.Label>
                  <Form.Select
                    value={selectedDepartamento}
                    onChange={(e) => setSelectedDepartamento(e.target.value)}
                    className="search-select"
                  >
                    <option value="">Todos</option>
                    {departamentos.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={2}>
                <Form.Group>
                  <Form.Label className="search-label">Provincia</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Provincia..."
                    value={selectedProvincia}
                    onChange={(e) => setSelectedProvincia(e.target.value)}
                    className="search-input"
                  />
                </Form.Group>
              </Col>

              <Col lg={2}>
                <Form.Group>
                  <Form.Label className="search-label">Tipo</Form.Label>
                  <Form.Select
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    className="search-select"
                  >
                    <option value="">Todos</option>
                    {tiposProyecto.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={2} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  className="btn-outline-custom w-100 d-flex align-items-center justify-content-center"
                  onClick={clearFilters}
                >
                  <Filter size={16} className="me-1" />
                  Limpiar
                </Button>
              </Col>
            </Row>

            <div className="results-summary">
              <div className="d-flex justify-content-between align-items-center">
                <p className="results-text mb-0">
                  Se encontraron <strong>{projects.length}</strong> proyecto(s)
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedDepartamento &&
                    selectedDepartamento !== "all" &&
                    ` en ${selectedDepartamento}`}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Mensajes de carga o error */}
        {loading && <p className="text-center">Cargando proyectos...</p>}
        {error && <p className="text-center text-danger">Error: {error}</p>}

        {/* Projects Grid */}
        {!loading && !error && projects.length > 0 ? (
          <Row>
            {projects.map((project) => (
              <Col lg={4} md={6} className="mb-4" key={project.id}>
                <Card className="project-card h-100">
                  <Card.Header className="project-card-header">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title className="project-title h5 mb-1">
                          {project.nombre}
                        </Card.Title>
                        {getStatusBadge(project.estado)}
                      </div>
                      <Button
                        variant="link"
                        className={`favorite-btn ${
                          project.isFavorite ? "favorited" : ""
                        }`}
                        onClick={() => toggleFavorite(project.id)}
                      >
                        <Heart
                          size={20}
                          className={`text-white ${
                            project.isFavorite ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </Card.Header>

                  <Card.Body className="project-card-body">
                    <Card.Text className="project-description">
                      {project.descripcion}
                    </Card.Text>

                    <div className="project-details">
                      <div className="detail-item d-flex align-items-center mb-2">
                        <MapPin size={16} className="detail-icon me-2" />
                        <span className="detail-text small">
                          {project.distrito}, {project.provincia},{" "}
                          {project.departamento}
                        </span>
                      </div>

                      <div className="detail-item d-flex align-items-center mb-2">
                        <div className="project-type d-flex align-items-center">
                          <span className="me-2">
                            {getProjectIcon(project.tipo)}
                          </span>
                          <span className="fw-semibold">{project.tipo}</span>
                        </div>
                      </div>

                      <div className="detail-item d-flex align-items-center">
                        <span className="detail-label fw-bold me-2">
                          Presupuesto:
                        </span>
                        <span className="detail-value budget fw-bold text-success fs-5">
                          {formatCurrency(project.presupuesto)}
                        </span>
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="project-card-footer">
                    <Button className="btn-primary-custom w-100">
                      Ver Detalles
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          !loading &&
          !error && (
            <Card className="no-results text-center py-5">
              <Card.Body>
                <Search size={64} className="no-results-icon text-muted mb-3" />
                <h3 className="no-results-title h4 text-muted mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="no-results-text text-muted mb-4">
                  Intenta ajustar los filtros de búsqueda o buscar con términos
                  diferentes.
                </p>
                <Button onClick={clearFilters} className="btn-primary-custom">
                  Limpiar filtros
                </Button>
              </Card.Body>
            </Card>
          )
        )}
      </Container>
      <button className="btn btn-primary" onClick={() => setShowSidebar(true)}>
        Mi Cuenta
      </button>

      {/* Sidebar */}
      <SidebarUsuario
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        onFavoriteUpdate={handleFavoriteUpdate}
      />
    </div>
  );
}
