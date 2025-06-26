"use client";

import type React from "react";
import { useState } from "react";
import { Link } from "lucide-react";
import { Image } from "lucide-react";
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
      const userData = {
        nombre: formData.nombre.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        preferencias: {
          ubicacion: {
            pais: formData.country,
            estado_provincia: formData.state.trim(),
            ciudad: formData.city.trim(),
          },
          idioma: "es",
          notificaciones: {
            email: true,
            push: true,
          },
          tema: "light",
        },
        rol: formData.rol,
      };

      console.log("Registration attempt:", userData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (error) {
      console.error("Registration error:", error);
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
                    <Link
                      href="/"
                      className="home-button d-flex align-items-center justify-content-center"
                    >
                      <Home size={20} />
                      <span className="visually-hidden">Volver al inicio</span>
                    </Link>
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

                    {/* Divider - Only show on step 1 */}
                    {currentStep === 1 && (
                      <>
                        <div className="divider-container my-4">
                          <hr className="divider-line" />
                          <span className="divider-text">O regístrate con</span>
                        </div>

                        {/* Google Sign-up Button */}
                        <div className="d-grid gap-2 mb-3">
                          <Button variant="light" className="google-signup-btn">
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
                      </>
                    )}

                    {/* Login Link */}
                    <div className="text-center mt-3">
                      <span className="login-text">¿Ya tienes cuenta? </span>
                      <Link href="/login" className="register-link-text">
                        Inicia sesión aquí
                      </Link>
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
