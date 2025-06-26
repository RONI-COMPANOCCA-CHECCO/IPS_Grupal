"use client";
import type React from "react";
import { useState } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { MapPin } from "lucide-react";

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
    <div className="wrapper py-5 main-content-section">
      <Container>
        <article id="main">
          {/* Sección de Bienvenida */}
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
                    ¡Construyamos el Perú contigo! Descubre si estás focalizado
                  </a>
                </h2>
                <p
                  className="lead custom-main-text mx-auto"
                  style={{ maxWidth: "800px" }}
                >
                  El Gobierno del Perú, a través del MIDIS, implementa el
                  Sistema de Focalización de Hogares (SISFOH) como herramienta
                  clave para identificar hogares en situación de pobreza o
                  vulnerabilidad.
                </p>
              </header>
              <p className="custom-main-text mb-4">
                Esta clasificación se denomina Clasificación Socioeconómica
                (CSE) y se utiliza para determinar si un hogar califica para
                programas sociales como Techo Propio, Pensión 65, Juntos, entre
                otros.
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

          {/* Botón de búsqueda de proyectos */}
          <section className="projects-section mt-5 text-center">
            <h3 className="section-title mb-3">
              <MapPin size={28} className="me-2" />
              Explora los proyectos activos
            </h3>
            <p className="section-subtitle mb-4">
              Consulta proyectos por región y tipo
            </p>
            <Button
              href="/Projects/page"
              variant="primary"
              size="lg"
              className="go-to-search-button"
            >
              Ir a la Búsqueda de Proyectos
            </Button>
          </section>
        </article>
      </Container>
    </div>
  );
};
