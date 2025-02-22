import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logoc.png";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminType = sessionStorage.getItem("adminType");
    if (storedAdminType) {
      redirectToDashboard(storedAdminType);
    }
  }, []);

  const redirectToDashboard = (role) => {
    if (role === "superadmin") {
      navigate("/admin/dashboard-superadmin");
    } else if (role === "batchadmin") {
      navigate("/admin/dashboard-batchadmin");
    } else if (role === "classadmin") {
      navigate("/admin/dashboard-classadmin");
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();

    if (!adminType) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please select an Admin Type.",
      });
      return;
    }

    const reqBody = { email, password, adminType };

    try {
      const response = await axios.post(`${baseURL}/admin/login`, reqBody);

      if (response?.status === 200) {
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("adminToken", response.data.token);
        sessionStorage.setItem("adminType", response.data.adminType);
        redirectToDashboard(response.data.adminType);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Login failed",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.message || "Login Failed!",
        });
      } else {
        Swal.fire("Server is unreachable. Please try again later.");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#D1D2AF",
        // minHeight:"800px"
      }}
    >
      <Card
        className="shadow p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency
          // backdropFilter: "blur(8px)",
        }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "60px", width: "150px" }}
          />
        </div>
        <h3 className="text-center fw-bold text-dark mb-4">Admin Login</h3>
        <Form onSubmit={handleAuth}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border rounded"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border rounded"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Admin Type</Form.Label>
            <Form.Select
              value={adminType}
              onChange={(e) => setAdminType(e.target.value)}
              required
              className="p-2 border rounded"
            >
              <option value="">Choose...</option>
              <option value="superadmin">Super Admin</option>
              <option value="batchadmin">Batch Admin</option>
              <option value="classadmin">Class Admin</option>
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 p-2 fw-bold"
            disabled={!adminType}
            style={{
              backgroundColor: "#C2D18A",
              borderColor: "#BED174",
              transition: "0.3s",
              color: "black",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#BFD168")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#BED174")}
          >
            Login
          </Button>
        </Form>
      </Card>
      <p className="text-center mt-5" style={{
        color: "black"
      }}>
        &copy; 2025 Yadein. All Rights Reserved.
      </p>
    </Container>
  );
};

export default AuthPage;
