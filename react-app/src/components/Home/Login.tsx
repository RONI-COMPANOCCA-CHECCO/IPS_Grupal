"use client";

import type React from "react";
import { useState } from "react";
import { NavLink } from "react-bootstrap";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { LogIn, Home, Eye, EyeOff } from "lucide-react";

export const Login: React.FC = () => {
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
      console.log("Login attempt:", { email, password });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Here you would typically send these credentials to your backend
      // and handle authentication (e.g., set a token, redirect user)
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-page-wrapper py-5">
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "80vh" }}
        >
          <Card className="login-card p-4">
            <Card.Body>
              {/* Header with Home Button and Title */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <NavLink
                  href="/"
                  className="home-button d-flex align-items-center justify-content-center"
                >
                  <Home size={20} />
                  <span className="visually-hidden">Volver al inicio</span>
                </NavLink>
                <h2 className="login-title mb-0 d-flex align-items-center">
                  <LogIn size={32} className="me-2 login-icon" />
                  Iniciar Sesión
                </h2>
                <div style={{ width: "40px" }}></div>{" "}
                {/* Spacer for centering */}
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
                        setErrors((prev) => ({ ...prev, email: undefined }));
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </InputGroup>
                  {errors.password && (
                    <Form.Text className="text-danger">
                      {errors.password}
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Forgot Password NavLink */}
                <div className="d-flex justify-content-end mb-3">
                  <NavLink
                    href="/forgot-password"
                    className="forgot-password-Link"
                  >
                    ¿Olvidaste tu contraseña?
                  </NavLink>
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

                {/* Divider */}
                <div className="divider-container my-4">
                  <hr className="divider-line" />
                  <span className="divider-text">O continúa con</span>
                </div>

                {/* Google Sign-in Button */}
                <div className="d-grid gap-2">
                  <Button variant="light" className="google-signin-btn">
                    <svg
                      className="me-2"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </Button>
                </div>

                {/* Register NavLink */}
                <div className="text-center mt-3">
                  <span className="register-text">¿No tienes cuenta? </span>
                  <NavLink href="/register" className="login-Link-text">
                    Regístrate aquí
                  </NavLink>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};
