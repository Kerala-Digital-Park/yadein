import React, { useEffect, useState } from "react";
import logo from "../assets/logoc.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
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
    sessionStorage.clear();
    navigate("/admin");
  };

  useEffect(() => {
    if (adminType === "batchadmin") {
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
    }
  });

  useEffect(() => {
    if (adminType === "classadmin") {
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
    }
  });

  return (
    <>
      <style>
        {`
        body{
        background-image:none;
        }
        @media (max-width: 991px) {
    #navbarNav.show {
      background: rgba(255, 255, 255, 10);
      border-radius: 10px;
      top: 25px;
    }
    .navbar{
      padding: 0px;
    }
    .logout{
      /* margin-left: 24px; */
      margin: 20px 20px;
      float: inline-start;
    }
    .link{
      float: inline-start;
      margin-left: 20px;
    }
    
  }`}
      </style>
      <nav
        className="navbar navbar-expand-lg navbar-light shadow-sm $"
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
          <Link
            className="navbar-brand"
            style={{ paddingLeft: "40px" }}
            to={"/admin"}
          >
            <img
              src={logo}
              alt="Logo"
              width="100"
              height="45"
              className="d-inline-block align-text-top"
            />
          </Link>

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
            <ul
              className="navbar-nav mx-auto dropdown-menu-end"
              style={{ gap: "10px" }}
            >
              <li
                className="nav-item"
                style={{ fontSize: "20px", fontWeight: "600" }}
              >
                <Link
                  className={`nav-link ${
                    location.pathname === "/dashboard" ? "active" : ""
                  }`}
                  to={"/dashboard"}
                >
                  Dashboard
                </Link>
              </li>

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/admin-list" ? "active" : ""
                    }`}
                    to={"/admin/admin-list"}
                  >
                    Admins
                  </Link>
                </li>
              )}

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/batch-list" ? "active" : ""
                    }`}
                    to={"/admin/batch-list"}
                  >
                    Batches
                  </Link>
                </li>
              )}

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/class-list" ? "active" : ""
                    }`}
                    to={"/admin/class-list"}
                  >
                    Classes
                  </Link>
                </li>
              )}

              {adminType === "batchadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === `/admin/batch/${batch}`
                        ? "active"
                        : ""
                    }`}
                    to={`/admin/batch/${batch}`}
                  >
                    Classes
                  </Link>
                </li>
              )}

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/student-list"
                        ? "active"
                        : ""
                    }`}
                    to={"/admin/student-list"}
                  >
                    Students
                  </Link>
                </li>
              )}

              {adminType === "classadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === `/admin/batch/${year}/${cls}`
                        ? "active"
                        : ""
                    }`}
                    to={`/admin/batch/${year}/${cls}`}
                  >
                    Students
                  </Link>
                </li>
              )}

              {(adminType === "superadmin" || adminType === "batchadmin") && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/staff-list" ? "active" : ""
                    }`}
                    to={"/admin/staff-list"}
                  >
                    Staffs
                  </Link>
                </li>
              )}

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/jobs" ? "active" : ""
                    }`}
                    to={"/admin/jobs"}
                  >
                    Jobs
                  </Link>
                </li>
              )}

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/sponsors" ? "active" : ""
                    }`}
                    to={"/admin/sponsors"}
                  >
                    Sponsors
                  </Link>
                </li>
              )}

              {adminType === "superadmin" && (
                <li
                  className="nav-item"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  <Link
                    className={`nav-link ${
                      location.pathname === "/admin/updates" ? "active" : ""
                    }`}
                    to={"/admin/updates"}
                  >
                    Updates
                  </Link>
                </li>
              )}

              <Button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#B2D12E",
                  borderColor: "#B2D12E",
                  marginRight: "40px",
                }}
                className="logout"
              >
                Logout
              </Button>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
