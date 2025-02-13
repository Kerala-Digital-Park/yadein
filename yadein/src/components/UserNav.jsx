import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/logoc.png";
import { Link } from "react-router-dom";

function UserNav() {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container
          className="d-flex "
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logo}
                width="120"
                height="60"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>
          </div>
          <div>
            <Nav className="me-auto">
              <Button className="me-5">
                <Link to={"/class"} style={{color:"white", textDecoration:"none"}}>Classes</Link>
              </Button>
              <Button className="me-5">
                <Link to={"/staff"} style={{color:"white", textDecoration:"none"}}>Teachers</Link>
              </Button>
              <Button className="me-5">
                <Link to={"/login"} style={{color:"white", textDecoration:"none"}}>Login</Link>
              </Button>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default UserNav;
