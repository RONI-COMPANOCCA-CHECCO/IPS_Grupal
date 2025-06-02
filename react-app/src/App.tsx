import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Home/Layout";
import { Header } from "./components/Home/Header";
import { Banner } from "./components/Home/Banner";
import { Carousel } from "./components/Home/Carousel";
import { MainContent } from "./components/Home/MainContent";
import { Features } from "./components/Home/Features";
import { Footer } from "./components/Home/Footer";
import { Login } from "./components/Home/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Register from "./components/Home/Register";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Header />
      <Banner />
      <Carousel />
      <MainContent />
      <Features />
      <Footer />
    </Layout>
  );
};
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for your Home page (all main sections) */}
          <Route path="/" element={<HomePage />} />

          {/* Route for the Login page */}
          <Route path="/login" element={<Login />} />

          {/* Add more routes here for other pages like /register, /dashboard, etc. */}
          {/* Example: <Route path="/register" element={<Register />} /> */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
