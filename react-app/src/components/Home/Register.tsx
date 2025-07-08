"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "lucide-react";
import { Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
  Row,
  Col,
  ProgressBar,
  Modal,
} from "react-bootstrap";
import {
  UserPlus,
  Home,
  Eye,
  EyeOff,
  User,
  Lock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  ImageIcon,
} from "lucide-react";

// Country data
const countries = [
  { code: "ES", name: "España" },
  { code: "MX", name: "México" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Perú" },
  { code: "CL", name: "Chile" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "BO", name: "Bolivia" },
  { code: "PY", name: "Paraguay" },
  { code: "UY", name: "Uruguay" },
  { code: "CR", name: "Costa Rica" },
  { code: "PA", name: "Panamá" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "SV", name: "El Salvador" },
  { code: "NI", name: "Nicaragua" },
  { code: "DO", name: "República Dominicana" },
  { code: "CU", name: "Cuba" },
  { code: "US", name: "Estados Unidos" },
];

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    city: "",
    rol: "usuario" as "usuario" | "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    nombre?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    country?: string;
    state?: string;
    city?: string;
  }>({});

  const validateStep1 = () => {
    const newErrors: {
      nombre?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {
      country?: string;
      state?: string;
      city?: string;
    } = {};

    if (!formData.country) {
      newErrors.country = "Selecciona tu país";
    }

    if (!formData.state.trim()) {
      newErrors.state = "La provincia/estado es requerida";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      const payload = {
        nombre_completo: formData.nombre.trim(),
        correo: formData.email.toLowerCase(),
        contrasena: formData.password, // el backend debe encriptar
        pais: formData.country,
        provincia: formData.state,
        ciudad: formData.city,
        recibir_email: true,
      };

      const response = await fetch("http://localhost:8000/api/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al registrar:", errorData);
        alert("Error al registrar el usuario.");
      } else {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setCurrentStep(1); // Reiniciar al paso 1 o redirigir a login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Ocurrió un error al registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información Personal";
      case 2:
        return "Ubicación";
      default:
        return "Crear Cuenta";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Ingresa tus datos básicos y crea una contraseña segura";
      case 2:
        return "Completa tu información de ubicación";
      default:
        return "";
    }
  };

  // Step Indicator Component (reusable)
  const StepIndicator = ({ className = "" }) => (
    <div className={`step-indicator-overlay ${className}`}>
      <div className="d-flex justify-content-center align-items-center gap-3">
        <div className={`step-circle ${currentStep >= 1 ? "active" : ""}`}>
          {currentStep > 1 ? <Check size={16} /> : "1"}
        </div>
        <div className={`step-line ${currentStep >= 2 ? "active" : ""}`}></div>
        <div className={`step-circle ${currentStep >= 2 ? "active" : ""}`}>
          2
        </div>
      </div>
      <div className="step-labels mt-2">
        <small className="text-white-50">
          Paso {currentStep} de 2: {getStepTitle()}
        </small>
      </div>
    </div>
  );

  return (
    <div className="register-page-wrapper">
      <Container fluid className="h-100 p-0">
        <Row className="g-0 h-100 min-vh-100">
          {/* Image Column - Desktop Only */}
          <Col
            lg={6}
            md={5}
            className="d-none d-md-block p-0 register-image-column"
          >
            <div className="register-image-container h-100">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Únete a nuestra comunidad"
                width={800}
                height={600}
                className="register-image w-100 h-100"
              />
              <div className="register-image-overlay">
                <div className="overlay-content text-center text-white p-4">
                  <h3 className="mb-3">Únete a nuestra comunidad</h3>
                  <p className="mb-4">
                    Crea tu cuenta y accede a proyectos de desarrollo que están
                    transformando comunidades en todo el Perú
                  </p>
                  <StepIndicator />
                </div>
              </div>
            </div>
          </Col>

          {/* Register Form Column */}
          <Col
            lg={6}
            md={7}
            className="d-flex align-items-center justify-content-center register-form-column"
          >
            <div className="register-form-container w-100 px-4 px-lg-5">
              <Card className="register-card border-0 shadow-lg">
                <Card.Body className="p-4 p-lg-5">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <NavLink
                      to="/"
                      className="home-button d-flex align-items-center justify-content-center"
                    >
                      <Home size={20} />
                      <span className="visually-hidden">Volver al inicio</span>
                    </NavLink>
                    <h2 className="register-title mb-0 d-flex align-items-center">
                      <UserPlus size={28} className="me-2 register-icon" />
                      Crear Cuenta
                    </h2>
                    {/* Mobile Image Button */}
                    <Button
                      variant="link"
                      className="d-md-none mobile-image-button p-0"
                      onClick={() => setShowImageModal(true)}
                      style={{ width: "40px", height: "40px" }}
                    >
                      <ImageIcon size={20} className="text-white-50" />
                    </Button>
                    <div
                      className="d-none d-md-block"
                      style={{ width: "40px" }}
                    ></div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-white-50">
                        Paso {currentStep} de 2
                      </small>
                      <small className="text-white-50">
                        {Math.round((currentStep / 2) * 100)}%
                      </small>
                    </div>
                    <ProgressBar
                      now={(currentStep / 2) * 100}
                      className="register-progress"
                      style={{ height: "4px" }}
                    />
                  </div>

                  {/* Step Title */}
                  <div className="text-center mb-4">
                    <h3 className="step-title">{getStepTitle()}</h3>
                    <p className="step-description">{getStepDescription()}</p>
                  </div>

                  <Form
                    onSubmit={
                      currentStep === 1
                        ? (e) => {
                            e.preventDefault();
                            handleNextStep();
                          }
                        : handleSubmit
                    }
                  >
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <>
                        {/* Name Field */}
                        <Form.Group className="mb-3" controlId="formBasicName">
                          <Form.Label className="register-form-label">
                            <User size={16} className="me-2" />
                            Nombre Completo
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Introduce tu nombre completo"
                            value={formData.nombre}
                            onChange={(e) =>
                              handleInputChange("nombre", e.target.value)
                            }
                            className={`register-input ${
                              errors.nombre ? "is-invalid" : ""
                            }`}
                            required
                          />
                          {errors.nombre && (
                            <Form.Text className="text-danger">
                              {errors.nombre}
                            </Form.Text>
                          )}
                        </Form.Group>

                        {/* Email Field */}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="register-form-label">
                            Correo Electrónico
                          </Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Introduce tu correo electrónico"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className={`register-input ${
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
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="register-form-label">
                            <Lock size={16} className="me-2" />
                            Contraseña
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              placeholder="Crea una contraseña segura"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              className={`register-input ${
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
                          <Form.Text className="password-requirements">
                            Mínimo 8 caracteres, incluye mayúscula, minúscula y
                            número
                          </Form.Text>
                        </Form.Group>

                        {/* Confirm Password Field */}
                        <Form.Group
                          className="mb-4"
                          controlId="formBasicConfirmPassword"
                        >
                          <Form.Label className="register-form-label">
                            Confirmar Contraseña
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirma tu contraseña"
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              className={`register-input ${
                                errors.confirmPassword ? "is-invalid" : ""
                              }`}
                              required
                            />
                            <Button
                              variant="outline-secondary"
                              className="password-toggle-btn"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              type="button"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </Button>
                          </InputGroup>
                          {errors.confirmPassword && (
                            <Form.Text className="text-danger">
                              {errors.confirmPassword}
                            </Form.Text>
                          )}
                        </Form.Group>

                        {/* Next Button */}
                        <div className="d-grid gap-2">
                          <Button
                            type="submit"
                            className="register-next-button"
                          >
                            Continuar
                            <ArrowRight size={16} className="ms-2" />
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Step 2: Location Information */}
                    {currentStep === 2 && (
                      <>
                        {/* Country Field */}
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCountry"
                        >
                          <Form.Label className="register-form-label">
                            <MapPin size={16} className="me-2" />
                            País
                          </Form.Label>
                          <Form.Select
                            value={formData.country}
                            onChange={(e) =>
                              handleInputChange("country", e.target.value)
                            }
                            className={`register-input ${
                              errors.country ? "is-invalid" : ""
                            }`}
                            required
                          >
                            <option value="">Selecciona tu país</option>
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </Form.Select>
                          {errors.country && (
                            <Form.Text className="text-danger">
                              {errors.country}
                            </Form.Text>
                          )}
                        </Form.Group>

                        {/* State and City Row */}
                        <Row>
                          <Col md={6}>
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicState"
                            >
                              <Form.Label className="register-form-label">
                                Provincia/Estado
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Ej: Madrid, California"
                                value={formData.state}
                                onChange={(e) =>
                                  handleInputChange("state", e.target.value)
                                }
                                className={`register-input ${
                                  errors.state ? "is-invalid" : ""
                                }`}
                                required
                              />
                              {errors.state && (
                                <Form.Text className="text-danger">
                                  {errors.state}
                                </Form.Text>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group
                              className="mb-3"
                              controlId="formBasicCity"
                            >
                              <Form.Label className="register-form-label">
                                Ciudad
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Ej: Barcelona, Los Ángeles"
                                value={formData.city}
                                onChange={(e) =>
                                  handleInputChange("city", e.target.value)
                                }
                                className={`register-input ${
                                  errors.city ? "is-invalid" : ""
                                }`}
                                required
                              />
                              {errors.city && (
                                <Form.Text className="text-danger">
                                  {errors.city}
                                </Form.Text>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Terms and Conditions */}
                        <Form.Group
                          className="mb-4"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            className="terms-checkbox"
                            label={
                              <span className="terms-text">
                                Acepto los{" "}
                                <Link href="/terms" className="terms-link">
                                  términos y condiciones
                                </Link>{" "}
                                y la{" "}
                                <Link href="/privacy" className="terms-link">
                                  política de privacidad
                                </Link>
                              </span>
                            }
                            required
                          />
                        </Form.Group>

                        {/* Navigation Buttons */}
                        <Row className="g-2">
                          <Col>
                            <Button
                              variant="outline-light"
                              className="register-back-button w-100"
                              onClick={handlePrevStep}
                              type="button"
                            >
                              <ArrowLeft size={16} className="me-2" />
                              Atrás
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              type="submit"
                              className="register-submit-button w-100"
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
                                  Creando...
                                </>
                              ) : (
                                "Crear Cuenta"
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}

                    {/* Login Link */}
                    <div className="text-center mt-3">
                      <span className="login-text">¿Ya tienes cuenta? </span>
                      <NavLink to="/login" className="register-link-text">
                        Inicia sesión aquí
                      </NavLink>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Mobile Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="lg"
        centered
        className="mobile-image-modal"
      >
        <Modal.Body className="p-0">
          <div className="mobile-modal-image-container">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
              alt="Únete a nuestra comunidad"
              width={800}
              height={600}
              className="mobile-modal-image w-100"
            />
            <div className="mobile-modal-overlay">
              <Button
                variant="link"
                className="modal-close-btn position-absolute top-0 end-0 m-3"
                onClick={() => setShowImageModal(false)}
              >
                <span className="text-white fs-4">&times;</span>
              </Button>
              <div className="overlay-content text-center text-white p-4">
                <h3 className="mb-3">Únete a nuestra comunidad</h3>
                <p className="mb-4">
                  Crea tu cuenta y accede a proyectos de desarrollo que están
                  transformando comunidades en todo el Perú
                </p>
                <StepIndicator className="mobile-step-indicator" />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
