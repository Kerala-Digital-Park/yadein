import React, { useEffect, useState } from "react";
import logo from "../assets/logoc.png";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Header.css";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminType = sessionStorage.getItem("adminType");
  const adminId = sessionStorage.getItem("userId");
  const [batch, setBatch] = useState("");
  const [year, setYear] = useState("");
  const [cls, setCls] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("adminType");
    navigate("/admin");
  };

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-batchadmin-batch/${adminId}`
        );
        setBatch(response.data.batch);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };
    fetchBatch();
  });

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-classadmin-batch/${adminId}`
        );
        setYear(response.data.batch);
        setCls(response.data.classForm);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };
    fetchClass();
  });

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{
        height: "90px",
        backgroundColor: "#C7D2A0",
        zIndex: "1050",
        position: "relative",
      }}
    >
      <div
        className="container-fluid d-flex justify-content-between align-items-center"
        style={{ padding: "0" }}
      >
        <a
          className="navbar-brand"
          href="/admin"
          style={{ paddingLeft: "40px" }}
        >
          <img
            src={logo}
            alt="Logo"
            width="100"
            height="45"
            className="d-inline-block align-text-top"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ marginRight: "40px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse text-center"
          id="navbarNav"
          style={{
            zIndex: "1051",
            position: "relative",
            left: "0",
            width: "100%",
            background: "#C7D2A0",
            borderRadius: "8px",
          }}
        >
          <ul className="navbar-nav mx-auto" style={{ gap: "20px" }}>
            <li
              className="nav-item"
              style={{ fontSize: "20px", fontWeight: "600" }}
            >
              <a
                className={`nav-link ${
                  location.pathname === "/dashboard" ? "active" : ""
                }`}
                href="/dashboard"
              >
                Dashboard
              </a>
            </li>

            {adminType === "superadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === "/admin/admin-list" ? "active" : ""
                  }`}
                  href="/admin/admin-list"
                >
                  Admins
                </a>
              </li>
            )}

            {adminType === "superadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === "/admin/batch-list" ? "active" : ""
                  }`}
                  href="/admin/batch-list"
                >
                  Batches
                </a>
              </li>
            )}

            {adminType === "superadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === "/admin/class-list" ? "active" : ""
                  }`}
                  href="/admin/class-list"
                >
                  Classes
                </a>
              </li>
            )}

            {adminType === "batchadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === `/admin/batch/${batch}`
                      ? "active"
                      : ""
                  }`}
                  href={`/admin/batch/${batch}`}
                >
                  Classes
                </a>
              </li>
            )}

            {adminType === "superadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === "/admin/student-list" ? "active" : ""
                  }`}
                  href="/admin/student-list"
                >
                  Students
                </a>
              </li>
            )}

            {adminType === "classadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === `/admin/batch/${year}/${cls}`
                      ? "active"
                      : ""
                  }`}
                  href={`/admin/batch/${year}/${cls}`}
                >
                  Students
                </a>
              </li>
            )}

            {(adminType === "superadmin" || adminType === "batchadmin") && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === "/admin/staff-list" ? "active" : ""
                  }`}
                  href="/admin/staff-list"
                >
                  Staffs
                </a>
              </li>
            )}

            {adminType === "superadmin" && (
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <a
                  className={`nav-link ${
                    location.pathname === "/admin/jobs" ? "active" : ""
                  }`}
                  href="/admin/jobs"
                >
                  Jobs
                </a>
              </li>
            )}
          </ul>

          <Button
            onClick={handleLogout}
            style={{ backgroundColor: "#B2D12E", borderColor: "#B2D12E" }}
            className="logout"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
