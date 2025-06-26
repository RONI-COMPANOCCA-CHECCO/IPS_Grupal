"use client";

import { useState } from "react";
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
  zona: {
    departamento: string;
    provincia: string;
    distrito: string;
  };
  tipo: string;
  estado: "activo" | "pausado" | "completado";
  presupuesto: number;
  isFavorite: boolean;
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      nombre: "Construcción de Viviendas Sociales Lima Norte",
      descripcion:
        "Proyecto de construcción de 500 viviendas sociales para familias de bajos recursos en la zona norte de Lima.",
      zona: {
        departamento: "Lima",
        provincia: "Lima",
        distrito: "San Martín de Porres",
      },
      tipo: "Vivienda",
      estado: "activo",
      presupuesto: 25000000,
      isFavorite: false,
    },
    {
      id: "2",
      nombre: "Mejoramiento de Infraestructura Educativa Cusco",
      descripcion:
        "Rehabilitación y equipamiento de 15 instituciones educativas rurales en la región de Cusco.",
      zona: {
        departamento: "Cusco",
        provincia: "Cusco",
        distrito: "Pisaq",
      },
      tipo: "Educación",
      estado: "activo",
      presupuesto: 8500000,
      isFavorite: true,
    },
    {
      id: "3",
      nombre: "Sistema de Agua Potable Arequipa",
      descripcion:
        "Instalación de sistema de agua potable y alcantarillado en zonas rurales de Arequipa.",
      zona: {
        departamento: "Arequipa",
        provincia: "Arequipa",
        distrito: "Characato",
      },
      tipo: "Saneamiento",
      estado: "completado",
      presupuesto: 12000000,
      isFavorite: false,
    },
    {
      id: "4",
      nombre: "Centro de Salud Integral Loreto",
      descripcion:
        "Construcción de centro de salud con equipamiento médico moderno para la comunidad de Iquitos.",
      zona: {
        departamento: "Loreto",
        provincia: "Maynas",
        distrito: "Iquitos",
      },
      tipo: "Salud",
      estado: "pausado",
      presupuesto: 15000000,
      isFavorite: false,
    },
    {
      id: "5",
      nombre: "Carretera Rural Amazonas",
      descripcion:
        "Construcción de carretera rural para conectar comunidades aisladas en la región amazónica.",
      zona: {
        departamento: "Amazonas",
        provincia: "Chachapoyas",
        distrito: "Chachapoyas",
      },
      tipo: "Infraestructura",
      estado: "activo",
      presupuesto: 18000000,
      isFavorite: true,
    },
    {
      id: "6",
      nombre: "Programa de Desarrollo Social Huánuco",
      descripcion:
        "Programa integral de desarrollo social enfocado en reducir la pobreza en comunidades rurales.",
      zona: {
        departamento: "Huánuco",
        provincia: "Huánuco",
        distrito: "Amarilis",
      },
      tipo: "Desarrollo Social",
      estado: "activo",
      presupuesto: 6500000,
      isFavorite: false,
    },
  ]);

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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartamento =
      selectedDepartamento === "" ||
      selectedDepartamento === "all" ||
      project.zona.departamento === selectedDepartamento;
    const matchesProvincia =
      selectedProvincia === "" ||
      project.zona.provincia
        .toLowerCase()
        .includes(selectedProvincia.toLowerCase());
    const matchesTipo =
      selectedTipo === "" ||
      selectedTipo === "all" ||
      project.tipo === selectedTipo;

    return (
      matchesSearch && matchesDepartamento && matchesProvincia && matchesTipo
    );
  });

  const toggleFavorite = (projectId: string) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      )
    );
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
                  Se encontraron <strong>{filteredProjects.length}</strong>{" "}
                  proyecto(s)
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedDepartamento &&
                    selectedDepartamento !== "all" &&
                    ` en ${selectedDepartamento}`}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <Row>
            {filteredProjects.map((project) => (
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
                          {project.zona.distrito}, {project.zona.provincia},{" "}
                          {project.zona.departamento}
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
        )}
      </Container>
    </div>
  );
}
