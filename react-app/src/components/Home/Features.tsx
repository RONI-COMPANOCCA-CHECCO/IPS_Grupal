import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const features = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg",
    title: "Asesoría en la compra de viviendas",
    description:
      "Ofrecemos orientación profesional para ayudarte a tomar la mejor decisión en la compra de tu vivienda, considerando ubicación, precio y características.",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg",
    title: "Programas sociales de vivienda",
    description:
      "Información actualizada sobre los diferentes programas gubernamentales que facilitan el acceso a una vivienda digna para familias peruanas.",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/2988232/pexels-photo-2988232.jpeg",
    title: "Financiamiento accesible",
    description:
      "Conoce las diferentes opciones de financiamiento disponibles y cómo acceder a tasas preferenciales para la adquisición de tu nuevo hogar.",
  },
];

export const Features: React.FC = () => {
  return (
    <div className="wrapper py-5 bg-light">
      <Container>
        <section id="features">
          <header className="text-center mb-5">
            <h2 className="display-5 text-primary mb-3">Nuestros Servicios</h2>
            <p
              className="lead text-muted mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Ofrecemos soluciones integrales para ayudarte a encontrar y
              adquirir la vivienda que mejor se adapte a tus necesidades y
              posibilidades.
            </p>
          </header>

          <Row className="g-4">
            {features.map((feature) => (
              <Col key={feature.id} md={4}>
                <Card className="h-100 border-0 shadow-sm transition-transform hover-lift">
                  <Card.Img
                    variant="top"
                    src={feature.image}
                    alt={feature.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="h4 text-primary mb-3">
                      <a href="#" className="text-decoration-none">
                        {feature.title}
                      </a>
                    </Card.Title>
                    <Card.Text className="text-muted">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </div>
  );
};
