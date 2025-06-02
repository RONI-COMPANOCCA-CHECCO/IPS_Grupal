"use client";
import type React from "react";
import { useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Card,
} from "react-bootstrap";
import { Search, MapPin, Filter } from "lucide-react";

interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  zona: {
    departamento: string;
    provincia: string;
    distrito: string;
  };
  tipo: string;
  estado: "activo" | "pausado" | "completado";
  presupuesto: number;
}

export const MainContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");

  // Sample projects data - this would come from your database
  const [projects] = useState<Project[]>([
    {
      id: "1",
      nombre: "Construcción de Viviendas Sociales Lima Norte",
      descripcion:
        "Proyecto de construcción de 500 viviendas sociales para familias de bajos recursos",
      zona: {
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Martín de Porres",
      },
      tipo: "Vivienda",
      estado: "activo",
      presupuesto: 25000000,
    },
    {
      id: "2",
      nombre: "Mejoramiento de Infraestructura Educativa Cusco",
      descripcion:
        "Rehabilitación y equipamiento de 15 instituciones educativas rurales",
      zona: {
        departamento: "Cusco",
        provincia: "Cusco",
        distrito: "Pisaq",
      },
      tipo: "Educación",
      estado: "activo",
      presupuesto: 8500000,
    },
    {
      id: "3",
      nombre: "Sistema de Agua Potable Arequipa",
      descripcion:
        "Instalación de sistema de agua potable y alcantarillado en zonas rurales",
      zona: {
        departamento: "Arequipa",
        provincia: "Arequipa",
        distrito: "Characato",
      },
      tipo: "Saneamiento",
      estado: "completado",
      presupuesto: 12000000,
    },
    {
      id: "4",
      nombre: "Centro de Salud Integral Loreto",
      descripcion:
        "Construcción de centro de salud con equipamiento médico moderno",
      zona: {
        departamento: "Loreto",
        provincia: "Maynas",
        distrito: "Iquitos",
      },
      tipo: "Salud",
      estado: "pausado",
      presupuesto: 15000000,
    },
  ]);

  // Peru departments data
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

  const tiposProyecto = [
    "Vivienda",
    "Educación",
    "Salud",
    "Saneamiento",
    "Infraestructura",
    "Desarrollo Social",
  ];

  // Filter projects based on search criteria
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartamento =
      selectedDepartamento === "" ||
      project.zona.departamento === selectedDepartamento;
    const matchesProvincia =
      selectedProvincia === "" ||
      project.zona.provincia
        .toLowerCase()
        .includes(selectedProvincia.toLowerCase());
    const matchesTipo = selectedTipo === "" || project.tipo === selectedTipo;

    return (
      matchesSearch && matchesDepartamento && matchesProvincia && matchesTipo
    );
  });

  const getStatusBadge = (estado: string) => {
    const colors = {
      activo: "#28a745",
      pausado: "#ffc107",
      completado: "#007bff",
    };
    return (
      <span
        className="badge rounded-pill px-3 py-2"
        style={{
          backgroundColor: colors[estado as keyof typeof colors],
          color: "white",
        }}
      >
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="wrapper py-5 main-content-section">
        <Container>
          <article id="main">
            {/* Original Content */}
            <Row className="align-items-center justify-content-center mb-5">
              <Col md={6} className="mb-4 mb-md-0">
                <div className="overflow-hidden rounded">
                  <img
                    src="https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg"
                    alt="Viviendas en Perú"
                    className="img-fluid rounded custom-main-image"
                  />
                </div>
              </Col>
              <Col md={6} className="text-md-start text-center">
                <header className="mb-4">
                  <h2 className="display-5 mb-3">
                    <a
                      href="https://focalizacion.sisfoh.gob.pe/ConsultaCSE/"
                      className="custom-main-title-link text-decoration-none"
                    >
                      ¡Construyamos el Perú contigo! Descubre si estás
                      focalizado
                    </a>
                  </h2>
                  <p
                    className="lead custom-main-text mx-auto"
                    style={{ maxWidth: "800px" }}
                  >
                    El Gobierno del Perú, a través del Ministerio de Desarrollo
                    e Inclusión Social (MIDIS), implementa el Sistema de
                    Focalización de Hogares (SISFOH) como herramienta clave para
                    identificar a los hogares en situación de pobreza o
                    vulnerabilidad. Este sistema permite asignar eficientemente
                    los recursos públicos a quienes más lo necesitan.
                  </p>
                </header>
                <p className="custom-main-text mb-4">
                  El Sistema de Focalización de Hogares (SISFOH) del gobierno
                  del Perú se encarga de clasificar a las familias peruanas
                  según su situación socioeconómica. Esta clasificación se
                  denomina Clasificación Socioeconómica (CSE) y se utiliza para
                  determinar si un hogar califica para acceder a programas
                  sociales como Techo Propio, Pensión 65, Juntos, entre otros.
                  Existen tres niveles de clasificación: No pobre, que
                  corresponde a hogares con condiciones económicas aceptables;
                  Pobre, que incluye a los hogares con recursos limitados y que
                  pueden acceder a ciertos beneficios sociales; y Pobre extremo,
                  que identifica a los hogares en situación de alta
                  vulnerabilidad económica, los cuales acceden a una mayor
                  cantidad de ayudas por parte del Estado.
                </p>
                <footer>
                  <Button
                    href="https://focalizacion.sisfoh.gob.pe/ConsultaCSE/"
                    className="custom-main-button"
                    size="lg"
                  >
                    Haz clic aquí
                  </Button>
                </footer>
              </Col>
            </Row>

            {/* Projects Search Section */}
            <section className="projects-section mt-5">
              <div className="section-header mb-4">
                <h3 className="section-title text-center mb-4">
                  <MapPin size={28} className="me-2" />
                  Buscar Proyectos por Zona
                </h3>
                <p className="section-subtitle text-center">
                  Encuentra proyectos de desarrollo social y infraestructura en
                  tu región
                </p>
              </div>

              {/* Search and Filter Bar */}
              <Card className="search-card mb-4">
                <Card.Body>
                  <Row className="g-3">
                    {/* Search Input */}
                    <Col lg={4}>
                      <Form.Group>
                        <Form.Label className="search-label">
                          <Search size={16} className="me-2" />
                          Buscar Proyecto
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

                    {/* Department Filter */}
                    <Col lg={2}>
                      <Form.Group>
                        <Form.Label className="search-label">
                          Departamento
                        </Form.Label>
                        <Form.Select
                          value={selectedDepartamento}
                          onChange={(e) =>
                            setSelectedDepartamento(e.target.value)
                          }
                          className="filter-select"
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

                    {/* Province Filter */}
                    <Col lg={2}>
                      <Form.Group>
                        <Form.Label className="search-label">
                          Provincia
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Provincia..."
                          value={selectedProvincia}
                          onChange={(e) => setSelectedProvincia(e.target.value)}
                          className="filter-input"
                        />
                      </Form.Group>
                    </Col>

                    {/* Project Type Filter */}
                    <Col lg={2}>
                      <Form.Group>
                        <Form.Label className="search-label">Tipo</Form.Label>
                        <Form.Select
                          value={selectedTipo}
                          onChange={(e) => setSelectedTipo(e.target.value)}
                          className="filter-select"
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

                    {/* Clear Filters Button */}
                    <Col lg={2} className="d-flex align-items-end">
                      <Button
                        variant="outline-secondary"
                        className="clear-filters-btn w-100"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedDepartamento("");
                          setSelectedProvincia("");
                          setSelectedTipo("");
                        }}
                      >
                        <Filter size={16} className="me-1" />
                        Limpiar
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Results Summary */}
              <div className="results-summary mb-3">
                <p className="results-text">
                  Se encontraron <strong>{filteredProjects.length}</strong>{" "}
                  proyecto(s)
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedDepartamento && ` en ${selectedDepartamento}`}
                </p>
              </div>

              {/* Projects Results */}
              <Row>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <Col lg={6} className="mb-4" key={project.id}>
                      <Card className="project-card h-100">
                        <Card.Header className="project-card-header">
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 className="project-title mb-0">
                              {project.nombre}
                            </h5>
                            {getStatusBadge(project.estado)}
                          </div>
                        </Card.Header>
                        <Card.Body className="project-card-body">
                          <p className="project-description">
                            {project.descripcion}
                          </p>

                          <div className="project-details">
                            <div className="detail-item">
                              <MapPin size={16} className="detail-icon" />
                              <span className="detail-text">
                                {project.zona.distrito},{" "}
                                {project.zona.provincia},{" "}
                                {project.zona.departamento}
                              </span>
                            </div>

                            <div className="detail-item">
                              <span className="detail-label">Tipo:</span>
                              <span className="detail-value">
                                {project.tipo}
                              </span>
                            </div>

                            <div className="detail-item">
                              <span className="detail-label">Presupuesto:</span>
                              <span className="detail-value budget">
                                {formatCurrency(project.presupuesto)}
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="project-card-footer">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="view-project-btn"
                          >
                            Ver Detalles
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Card className="no-results-card">
                      <Card.Body className="text-center py-5">
                        <Search size={48} className="no-results-icon mb-3" />
                        <h5 className="no-results-title">
                          No se encontraron proyectos
                        </h5>
                        <p className="no-results-text">
                          Intenta ajustar los filtros de búsqueda o buscar con
                          términos diferentes.
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </section>
          </article>
        </Container>
      </div>
    </>
  );
};
