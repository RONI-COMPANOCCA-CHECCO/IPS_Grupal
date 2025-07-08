"use client";

import type React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { LogIn, Home, Eye, EyeOff } from "lucide-react";
import { Link } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorText = data?.error || "Credenciales inválidas";
        setErrors({ password: errorText });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      console.log("data usuariio", data.usuario);

      // ✅ Redirigir usando navigate (más limpio que window.location)
      navigate("/Projects/page");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ password: "Error al conectar con el servidor" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Container fluid className="h-100 p-0">
        <Row className="g-0 h-100 min-vh-100">
          {/* Login Form Column */}
          <Col
            lg={6}
            md={7}
            className="d-flex align-items-center justify-content-center login-form-column"
          >
            <div className="login-form-container w-100 px-4 px-lg-5">
              <Card className="login-card border-0 shadow-lg">
                <Card.Body className="p-4 p-lg-5">
                  {/* Header with Home Button and Title */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <NavLink
                      to="/"
                      className="home-button d-flex align-items-center justify-content-center"
                    >
                      <Home size={20} />
                      <span className="visually-hidden">Volver al inicio</span>
                    </NavLink>
                    <h2 className="login-title mb-0 d-flex align-items-center">
                      <LogIn size={28} className="me-2 login-icon" />
                      Iniciar Sesión
                    </h2>
                    <div style={{ width: "40px" }}></div>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label className="login-form-label">
                        Correo Electrónico
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Introduce tu correo"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email)
                            setErrors((prev) => ({
                              ...prev,
                              email: undefined,
                            }));
                        }}
                        className={`login-input ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        required
                      />
                      {errors.email && (
                        <Form.Text className="text-danger">
                          {errors.email}
                        </Form.Text>
                      )}
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label className="login-form-label">
                        Contraseña
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password)
                              setErrors((prev) => ({
                                ...prev,
                                password: undefined,
                              }));
                          }}
                          className={`login-input ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </Button>
                      </InputGroup>
                      {errors.password && (
                        <Form.Text className="text-danger">
                          {errors.password}
                        </Form.Text>
                      )}
                    </Form.Group>

                    {/* Forgot Password Link */}
                    <div className="d-flex justify-content-end mb-3">
                      <Link
                        href="/forgot-password"
                        className="forgot-password-link"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2 mt-4">
                      <Button
                        type="submit"
                        className="login-submit-button"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Accediendo...
                          </>
                        ) : (
                          "Acceder"
                        )}
                      </Button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center mt-3">
                      <span className="register-text">¿No tienes cuenta? </span>
                      <NavLink to="/register" className="login-link-text">
                        Regístrate aquí
                      </NavLink>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Image Column */}
          <Col
            lg={6}
            md={5}
            className="d-none d-md-block p-0 login-image-column"
          >
            <div className="login-image-container h-100">
              <img
                src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                alt="Proyecto de Desarrollo"
                className="login-image w-100 h-100"
              />
              <div className="login-image-overlay">
                <div className="overlay-content text-center text-white p-4">
                  <h3 className="mb-3">Bienvenido de vuelta</h3>
                  <p className="mb-0">
                    Accede a tu cuenta para explorar proyectos de desarrollo en
                    todo el Perú
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
