import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import logo from "../assets/logoc.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Nav.module.css";

function UserNav() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <>
      <style>
        {`
      
      @media (max-width: 990px) {
    .navbar-nav {
        position: absolute;
        padding: 25px 25px;
        left: 0;
        top: 70px;
        width: 100%;
        background: white;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ;
        transform: translateY(-20px);
        opacity: 0;
        visibility: hidden;
        text-align: center;
        z-index: 1;

    }

    .navbar-collapse.show .navbar-nav {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }

    .btn {
        width: 50%;
        transition: background-color 0.3s ease, transform 0.2s ease-in-out;
    }

    .nav-item {
        width: 100%; /* Make each item take full width */
        display: flex;
        justify-content: center;
        margin-top: 15px;
        
    }

    .btn:hover {
        transform: scale(1.05);
    }
}
`}
      </style>

      <nav className="navbar navbar-light navbar-expand-lg w-100">
        <div className="container w-100 d-flex justify-content-between">
          <div>
            <Link to="/">
              <img
                alt="logo"
                src={logo}
                width="120"
                height="60"
                className="d-inline-block align-top"
              />
            </Link>
          </div>
          <div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mb-2 mb-lg-0 w-100">
                <li className="nav-item">
                  <Button
                    as={Link}
                    to="/batches"
                    className="btn me-3 mb-2 mb-lg-0"
                    style={{
                      backgroundColor: "#b2d12e",
                      border: "#b2d12e",
                      color: "black",
                    }}
                  >
                    Go to your Class
                  </Button>
                </li>
                <li className="nav-item">
                  <Button
                    as={Link}
                    to="/staff"
                    style={{
                      backgroundColor: "#b2d12e",
                      border: "#b2d12e",
                      color: "black",
                    }}
                    className="btn me-3 mb-2 mb-lg-0"
                  >
                    Thank you Teachers
                  </Button>
                </li>

                <li className="nav-item">
                  <Button
                    as={Link}
                    to="/about"
                    style={{
                      backgroundColor: "#b2d12e",
                      border: "#b2d12e",
                      color: "black",
                    }}
                    className="btn me-3 mb-2 mb-lg-0"
                  >
                    About
                  </Button>
                </li>

                {isLogin ? (
                  <>
                    <li className="nav-item">
                      <Button
                        as={Link}
                        to="/profile"
                        style={{
                          backgroundColor: "#b2d12e",
                          border: "#b2d12e",
                          color: "black",
                        }}
                        className="btn me-3 mb-2 mb-lg-0"
                      >
                        Profile
                      </Button>
                    </li>
                    <li className="nav-item">
                      <Button
                        variant="danger"
                        className="btn me-3 mb-2 mb-lg-0"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Button
                      as={Link}
                      to="/login"
                      variant="success"
                      className="btn me-3 mb-2 mb-lg-0"
                    >
                      Add your Details
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default UserNav;
