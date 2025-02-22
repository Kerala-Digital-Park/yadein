import React, { useEffect, useState } from "react";
import UserNav from "../components/UserNav";
import { Col, Row, Button, Card, Form } from "react-bootstrap";
import axios from "axios";
import profile from "../assets/profile.jpg";
import img from "../assets/class.png"

const baseURL = process.env.REACT_APP_API_URL;

function Staffs() {
  const [staff, setStaff] = useState([]);
  const [key, setKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    const listStaff = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/staff-list`);
        setStaff(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    listStaff();
  }, []);

  useEffect(() => {
    if (staff.length > 0 && !key) {
      const firstCategory = ["principal", "teacher", "non-teaching"].find(
        (cat) => staff.some((s) => s.staffType === cat)
      );
      if (firstCategory) setKey(firstCategory);
    }
  }, [staff, key]);

  useEffect(() => {
    const dropdownElements = document.querySelectorAll(".dropdown-toggle");
    dropdownElements.forEach((dropdown) => {
      new window.bootstrap.Dropdown(dropdown);
    });
  }, []);

  const filteredStaff = selectedStaff
    ? staff.filter((s) => s.name === selectedStaff && s.staffType === key)
    : staff.filter(
        (s) =>
          (!key || s.staffType === key) &&
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const staffNames = key
    ? staff.filter((s) => s.staffType === key).map((s) => s.name)
    : [];

  return (
    <>
      <style>
        {`
      .dropdown-toggle{
      
      }
      `}
      </style>
      <UserNav />
      <div className="container-fluid w-75 rounded mb-5">
        <Row className="d-flex flex-column justify-content-center align-items-center mt-4">
        <Col
            sm={12}
            md={6}
            lg={8}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <img src={img} alt="" className="img-fluid" style={{width:"100%", borderBottom:"5px solid #b2d12e"}}/>
          </Col>
        </Row>
        <Row className="d-flex flex-column justify-content-center align-items-center mt-4">
          <Col
            sm={12}
            md={6}
            lg={6}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <h1>ജ്ഞാനത്തിന്റെ മാർഗദീപങ്ങൾ</h1>
            <h2>The Guiding Lamps of <span style={{color:"#b2d12e"}}>Wisdom</span></h2>
          </Col>
        </Row>

        <Row className="mb-5 d-flex justify-content-center mt-5">
          <Col
            xs={12}
            lg={6}
            className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center"
          >
            {["principal", "teacher", "non-teaching"].map((category) => (
              <Button
                key={category}
                onClick={() => {
                  setKey(category);
                  setSearchTerm("");
                  setSelectedStaff("");
                }}
                className="btn p-3 rounded"
                style={{
                  width: "180px",
                  fontSize: "16px",
                  border: "2px solid #00AB66",
                  color: key === category ? "white" : "black",
                  backgroundColor: key === category ? "#00AB66" : "white",
                  cursor: "pointer",
                }}
              >
                {category.charAt(0).toUpperCase() +
                  category.slice(1).replace("-", " ")}
              </Button>
            ))}
          </Col>
        </Row>

        <Row className="search mb-3 d-flex align-items-center justify-content-center">
          <Col s={6}  md={6} lg={6} className="d-flex gap-3 ">
            {key && staffNames.length > 0 && (
              <div className="dropdown w-100 d-flex ">
                <button
                  className="btn w-75 mx-auto text-start dropdown-toggle d-flex justify-content-between align-items-center"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "#b2d12e",
                    border: "#b2d12e",
                    color: "black",
                  }}
                >
                  {selectedStaff || "Search Staffs"}
                </button>
                <ul
                  className="dropdown-menu w-75"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li className=" d-flex align-items-center justify-content-center">
                    <Form.Control
                      type="text"
                      placeholder="Search staff by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2 dropdown-item"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: "#b2d12e",
                        border: "#b2d12e",
                        color: "black",
                        width:"95%",
                        borderRadius: "5px",
                      }}
                    />
                  </li>
                  {staffNames
                    .filter((name) =>
                      name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((name, index) => (
                      <li key={index}>
                        <button
                          className="dropdown-item"
                          onClick={() => setSelectedStaff(name)}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  {staffNames.length === 0 && (
                    <li>
                      <span className="dropdown-item disabled">
                        No staff found
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Col>
        </Row>

        <Row className="mt-5 d-flex align-items-center justify-content-center">
          <Col className="d-flex gap-5 flex-wrap align-items-center justify-content-center">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <Card
                  className="staff-card"
                  key={staff._id}
                  style={{ width: "10rem", height: "270px" }}
                >
                  <Card.Img
                    className="staff-img"
                    variant="top"
                    style={{ height: "70%" }}
                    src={
                      staff.profileImage
                        ? `${baseURL}/uploads/${staff.profileImage}`
                        : profile
                    }
                    alt={staff.name}
                  />
                  <Card.Body>
                    <Card.Title className="text-center">
                      {staff.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-center">No staff </p>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Staffs;
