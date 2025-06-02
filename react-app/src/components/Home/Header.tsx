import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap"; // Import Form, FormControl, Button
import { Home, Search, LogIn, UserPlus } from "lucide-react"; // Import Home, Search, LogIn, UserPlus icons

export const Header: React.FC = () => {
  return (
    <div id="header" className="custom-header-bg custom-header-text">
      {" "}
      {/* Use custom classes for colors */}
      <Navbar expand="lg" className="py-2 custom-navbar-styles">
        {" "}
        {/* Use custom class here */}
        <Container>
          {/* Brand/Logo - House Icon and Project Name */}
          <Navbar.Brand
            href="/"
            className="d-flex align-items-center custom-navbar-brand"
          >
            <Home size={30} className="me-2 custom-house-icon" />{" "}
            {/* House icon */}
            <span id="logo" className="h4 mb-0 custom-logo-text">
              Proyecto Viviendas
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {/* Main Navigation Links */}
            <Nav className="mx-auto custom-nav-links">
              {" "}
              {/* Centered navigation */}
              <Nav.Link href="lista_proyectos.html">Proyectos</Nav.Link>{" "}
              {/* Changed "Casa" to "Proyectos" for clarity */}
              <NavDropdown
                title="Menú desplegable"
                id="basic-nav-dropdown"
                className="custom-nav-dropdown"
              >
                <NavDropdown.Item href="#" className="custom-dropdown-item">
                  Item 1
                </NavDropdown.Item>
                <NavDropdown.Item href="#" className="custom-dropdown-item">
                  Item 2
                </NavDropdown.Item>
                <NavDropdown.Item href="#" className="custom-dropdown-item">
                  Item 3
                </NavDropdown.Item>
                <NavDropdown.Divider className="custom-dropdown-divider" />
                <NavDropdown
                  title="Submenú"
                  id="submenu-dropdown"
                  className="custom-nav-dropdown"
                >
                  <NavDropdown.Item href="#" className="custom-dropdown-item">
                    Subitem A
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#" className="custom-dropdown-item">
                    Subitem B
                  </NavDropdown.Item>
                </NavDropdown>
              </NavDropdown>
              <Nav.Link href="left-sidebar.html">Acerca de</Nav.Link>
              <Nav.Link href="right-sidebar.html">Contacto</Nav.Link>
            </Nav>

            {/* Search Bar */}
            <Form className="d-flex my-2 my-lg-0 custom-search-form">
              <FormControl
                type="search"
                placeholder="Buscar proyectos..."
                className="me-2 custom-search-input"
                aria-label="Search"
              />
              <Button
                variant="outline-success"
                className="custom-search-button"
              >
                <Search size={20} />
              </Button>
            </Form>

            {/* Login/Register Links */}
            <Nav className="ms-auto custom-auth-links">
              {" "}
              {/* Aligned to the right */}
              <Nav.Link href="/login" className="custom-auth-link">
                <LogIn size={18} className="me-1" /> Login
              </Nav.Link>
              <Nav.Link href="/register" className="custom-auth-link">
                <UserPlus size={18} className="me-1" /> Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
