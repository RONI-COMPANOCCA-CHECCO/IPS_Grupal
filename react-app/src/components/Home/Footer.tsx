import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react"; // Importa algunos íconos para ejemplo

export const Footer: React.FC = () => {
  return (
    <footer id="footer-section" className="py-5 footer-custom-bg">
      <Container>
        <Row className="justify-content-center text-center text-md-start">
          {/* Columna de Contacto */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading mb-3">Contáctanos</h5>
            <ul className="list-unstyled footer-link-list">
              <li>
                <a
                  href="mailto:info@proyectoviviendas.com"
                  className="footer-link"
                >
                  <Mail size={16} className="me-2" /> info@proyectoviviendas.com
                </a>
              </li>
              <li>
                <a href="tel:+51123456789" className="footer-link">
                  <Phone size={16} className="me-2" /> +51 123 456 789
                </a>
              </li>
              <li className="footer-address mt-3">
                Av. Principal 123, Urb. Centro, Arequipa, Perú
              </li>
            </ul>
          </Col>

          {/* Columna de Navegación (Enlaces Útiles) */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading mb-3">Enlaces Rápidos</h5>
            <ul className="list-unstyled footer-link-list">
              <li>
                <a href="/proyectos" className="footer-link">
                  Nuestros Proyectos
                </a>
              </li>
              <li>
                <a href="/servicios" className="footer-link">
                  Servicios
                </a>
              </li>
              <li>
                <a href="/nosotros" className="footer-link">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/contacto" className="footer-link">
                  Contacto
                </a>
              </li>
            </ul>
          </Col>

          {/* Columna de Redes Sociales */}
          <Col md={4}>
            <h5 className="footer-heading mb-3">Síguenos</h5>
            <ul className="list-inline mb-0 social-icons-list">
              <li className="list-inline-item">
                <a href="#" aria-label="Facebook">
                  <Facebook size={28} />
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" aria-label="Twitter">
                  <Twitter size={28} />
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" aria-label="Instagram">
                  <Instagram size={28} />
                </a>
              </li>
            </ul>
            <p className="footer-tagline mt-3">
              Tu hogar empieza aquí. ¡Construyamos juntos un Perú que progresa!
            </p>
          </Col>
        </Row>

        <hr className="footer-divider my-4" />

        {/* Sección de Copyright */}
        <Row>
          <Col className="text-center footer-copyright-text">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Proyecto Viviendas. Todos los
              derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
