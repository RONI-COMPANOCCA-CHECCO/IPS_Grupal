import React from "react";
import { Container } from "react-bootstrap";

export const Banner: React.FC = () => {
  return (
    <section id="banner" className="py-5 bg-primary text-white text-center">
      <Container>
        <header>
          <h1 className="display-4 mb-3">
            <a href="/" id="logo" className="text-white text-decoration-none">
              Proyecto Viviendas
            </a>
          </h1>

          <h2 className="display-5 mb-4">
            No pierdas mas tiempo obten ya{" "}
            <strong className="text-warning">TU PROPIO HOGAR</strong>
          </h2>
          <p className="text-white-50">
            Región{" "}
            <a
              href="http://html5up.net"
              className="text-warning text-decoration-none"
            >
              HTML5 UP
            </a>
            . Provincia{" "}
            <a
              href="http://html5up.net/license"
              className="text-warning text-decoration-none"
            >
              CCA
            </a>
            . Distrito{" "}
            <a
              href="http://html5up.net/license"
              className="text-warning text-decoration-none"
            >
              CCA
            </a>
            .
          </p>
          <hr className="mx-auto" style={{ width: "100px" }} />
          <p className="lead text-white-50">
            Tu hogar empieza aquí. ¡Construyamos juntos un Perú que progresa!
          </p>
        </header>
        <footer>
          <a href="/register" className="button circled">
            Aquí
          </a>
        </footer>
      </Container>
    </section>
  );
};
