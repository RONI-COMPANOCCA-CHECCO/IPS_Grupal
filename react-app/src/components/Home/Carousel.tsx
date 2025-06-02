import React, { useRef } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    region: "AREQUIPA",
    title: "Las Lomas de Yura",
    description:
      "Las Lomas de Yura se ubica en el Km 17 de la carretera Arequipa - Puno, en el sector Las Laderas.",
    link: "https://suvivienda.pe/properties/gpr-las-lomas-de-yura",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    region: "LIMA",
    title: "Villa María del Triunfo",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    region: "Cusco",
    title: "Distrito de Wanchaq",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
    region: "Piura",
    title: "Castilla",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
    region: "Trujillo (La Libertad)",
    title: "Florencia de Mora",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg",
    region: "Chiclayo (Lambayeque)",
    title: "José Leonardo Ortiz",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
    region: "Huancayo (Junín)",
    title: "El Tambo y Chilca",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/3958958/pexels-photo-3958958.jpeg",
    region: "Tacna",
    title: "Zona Alto de la Alianza",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 9,
    image: "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg",
    region: "Lima Metropolitana",
    title: "Carabayllo",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
  {
    id: 10,
    image: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg",
    region: "Arequipa",
    title: "Villa Hermosa",
    description:
      "Commodo id natoque malesuada sollicitudin elit suscipit magna.",
    link: "#",
  },
];

export const Carousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="carousel py-5 bg-light position-relative">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 text-secundary">Proyectos de Vivienda</h2>
          <div className="d-flex gap-2">
            <Button
              onClick={scrollLeft}
              variant="primary"
              className="rounded-circle p-2"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={scrollRight}
              variant="primary"
              className="rounded-circle p-2"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="reel d-flex overflow-auto gap-3 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {carouselItems.map((item) => (
            <Card
              key={item.id}
              className="flex-shrink-0"
              style={{ width: "18rem" }}
            >
              <Card.Img
                variant="top"
                src={item.image}
                alt={item.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Subtitle className="mb-2 text-primary">
                  {item.region}
                </Card.Subtitle>
                <Card.Title>
                  <a
                    href={item.link}
                    className="text-decoration-none text-dark"
                  >
                    {item.title}
                  </a>
                </Card.Title>
                <Card.Text className="text-muted">{item.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
