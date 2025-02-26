import React, { useEffect, useState } from "react";
import UserNav from "../components/UserNav";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Card } from "react-bootstrap";
import profile from "../assets/profile.jpg";
import group from "../assets/group.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import animation from "../assets/animation.mp4";
import blank from "../assets/blank.jpg";

const baseURL = process.env.REACT_APP_API_URL;

function Classes() {
  const { year } = useParams();

  const [classes, setClasses] = useState([]);
  const [male, setMale] = useState([]);
  const [female, setFemale] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [cls, setCls] = useState({});
  const [batch, setBatch] = useState("");
  const navigate = useNavigate();
  const [batchYear, setBatchYear] = useState("");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/batch-class-list?year=${year}`
        );
        setClasses(response.data);

        if (response.data.length > 0) {
          fetchStudents(response.data[0]._id);
          setSelectedClass(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [year]);

  const fetchStudents = async (classId) => {

    try {
      const response = await axios.get(
        `${baseURL}/admin/class-student-list?year=${year}&classForm=${classId}`
      );
      setMale(response.data.male);
      setFemale(response.data.female);
    } catch (error) {
      console.error("Error listing students:", error.response?.data || error);
    }
  };

  useEffect(() => {
    const fetchClassById = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-class-form/${selectedClass}`
        );
        setCls(response.data);
      } catch (error) {
        console.error("Error listing class:", error.response?.data || error);
      }
    };
    fetchClassById();
  }, [selectedClass]);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/get-batch/${year}`);
        setBatch(response.data.year);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    };
    fetchBatchDetails();
  });

  const fetchBatchData = async () => {
    if (!batchYear) {
      toast.warn("Please enter a batch year!");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/admin/get-batchId/${batchYear}`
      );

      if (response.data[0] && response.data[0]._id) {
        navigate(`/batch/${response.data[0]._id}`);
      } else {
        toast.error("Batch not found!");
      }
    } catch (error) {
      console.error("Error fetching batch details:", error);
      toast.error("Batch not found!");
    }
    setBatchYear("");
  };

  return (
    <>
      <style>
        {`

      .card-hover:hover{
        background-color: #b2d12e
      }

      .add{
        opacity: 0;
        display: none;
        color: #fff;
        cursor: pointer;
        position: absolute;
        top: 0;
        z-index: 20;
        font-size: 14px;
        padding: 9px 35px;
        right: -15px;
        text-decoration: none
      }

      .card-hover:hover .add {
        display: flex;
        opacity: 1;
      }

      .add-icon {
        opacity: 0;
        display: none;
        color: white;
        cursor: pointer;
        position: absolute;
        top: 0;
        z-index: 20;
        font-size: 14px;
        padding: 12px 18px;
        right: -15px;
      }

      .card-hover:hover .add-icon {
        display: flex; 
        opacity: 1;
      }

      .whatsapp-icon {
        display: none; 
        position: absolute;
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        color: #b2d12e;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        font-size: 20px;
        padding: 10px;
        box-shadow: 2px 8px 10px -3px rgba(0, 0, 0, 0.33);
      }

      .card-hover:hover .whatsapp-icon,.card-hover:hover .fb-icon, .card-hover:hover .insta-icon  {
        display: inline-block; 
        opacity: 1;
      }

      .fb-icon {
        display: none; 
        position: absolute;
        top: 80%;
        left: 20%;
        transform: translate(-50%, -50%);
        background-color: white;
        color: #b2d12e;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        font-size: 20px;
        padding: 10px;
        box-shadow: 2px 8px 10px -3px rgba(0, 0, 0, 0.33);
      }

      .insta-icon {
        display: none; 
        position: absolute;
        top: 80%;
        left: 80%;
        transform: translate(-50%, -50%);
        background-color: white;
        color: #b2d12e;
        width: 40px;
        height: 40px;
        border-radius: 20px;
        text-align: center;
        font-size: 20px;
        padding: 10px;
        box-shadow: 2px 8px 10px -3px rgba(0, 0, 0, 0.33);
      }
 .video-container {
      position: relative;
      width: 100%;
      height: 200px; /* Adjust height as needed */
      // overflow: hidden;
    }

    .background-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
      opacity: 0.5
    }

    .nav-overlay {
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 10; /* Ensures UserNav appears above the video */
    }

    .rollno{
    color: #fff;
    width: 30px;
    height: 30px;
    background-color:rgb(0,171,102);
    display: block;
    margin: -10px auto;
    border-radius: 100%;
    padding: 2px 0 0 11px;
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translate(-50%, 0);
    }
      `}
      </style>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="container-fluid rounded mb-5" style={{ width: "85%" }}>
        <div className="video-container">
          <video
            autoPlay
            loop
            muted
            playsInline
            width="10000"
            // height="250"
            className="background-video"
          >
            <source src={animation} type="video/mp4" />
          </video>
          <UserNav className="nav-overlay" />
        </div>
        <Row className="input d-flex justify-content-center mt-4 mx-auto">
          <Col
            sm={10}
            md={4}
            lg={3}
            className="d-flex justify-content-center gap-3 mb-3"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Enter your batch"
              value={batchYear}
              style={{ backgroundColor: "#BED174", color: "black" }}
              onChange={(e) => setBatchYear(e.target.value)}
            />
            <Button
              className="batch-button"
              onClick={fetchBatchData}
              style={{ backgroundColor: "#b2d12e", border: "#b2d12e" }}
            >
              Go
            </Button>
          </Col>
        </Row>

        <Row className="d-flex align-items-center justify-content-center mt-4 mx-auto">
          <Col
            sm={12}
            md={4}
            lg={6}
            className="d-flex align-items-center flex-column justify-content-center mb-3"
          >
            <h1 style={{ color: "#b2d12e" }}>All of you sit down</h1>
            <h3 className="text-center">
              Find your classmates here, add details & regain your childhood
            </h3>
          </Col>
        </Row>

        <Row className="mt-3 g-3 justify-content-center">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <Col
                key={cls._id}
                xs={6}
                sm={6}
                md={4}
                lg={2}
                className="d-flex justify-content-center"
              >
                <Button
                  onClick={() => {
                    fetchStudents(cls._id);
                    setSelectedClass(cls._id);
                  }}
                  className="btn p-3 rounded"
                  style={{
                    border: "2px solid #00AB66",
                    color: selectedClass === cls._id ? "white" : "black",
                    backgroundColor:
                      selectedClass === cls._id ? "#00AB66" : "white",
                    cursor: "pointer",
                    width: "150px",
                    fontSize: "20px",
                  }}
                >
                  Class {cls.classForm}
                </Button>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">No classes</p>
            </Col>
          )}
        </Row>

        <Row className="d-flex justify-content-center align-items-center p-5">
          <Col sm={12} md={6} lg={6}>
            {cls.classForm ? (
              <h1
                className="text-dark"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#00AB66" }}>{cls.classForm},</span>
                &nbsp;&nbsp;
                <span style={{ fontSize: "50px" }}>{batch}</span>
                &nbsp;&nbsp;
                <span style={{ color: "grey" }}> Batch</span>
              </h1>
            ) : (
              <h1
                className="text-dark"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "50px" }}>{batch}</span>
                &nbsp;&nbsp;
                <span style={{ color: "grey" }}> Batch</span>
              </h1>
            )}
          </Col>
        </Row>

        <Row className="d-flex align-items-center justify-content-center">
          <Col
            sm={12}
            md={6}
            lg={6}
            className="d-flex align-items-center justify-content-center"
          >
            {cls.profileImage ? (
              <img
                src={`${baseURL}/uploads/${cls.profileImage}`}
                alt="Profile"
                className="img-fluid"
                style={{
                  border: "5px solid black",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <img
                src={group}
                alt="Group"
                className="img-fluid"
                style={{
                  border: "5px solid black",
                  borderRadius: "10px",
                }}
              />
            )}
          </Col>
        </Row>

        <Row className="mt-5 justify-content-center g-2">
          {male?.length > 0 || female?.length > 0 ? (
            <>
              {male.length > 0 && (
                <>
                  <p className="text-center" style={{ fontSize: "40px" }}>
                    Boys 👦
                  </p>
                  {male.map((student, index) => (
                    <Col
                      key={student._id}
                      xs={6}
                      sm={6}
                      md={4}
                      lg={2}
                      className="d-flex justify-content-center"
                    >
                      <Card
                        className="student-card"
                        style={{ width: "160px", marginBottom: "15px" }}
                      >
                        <Card.Img
                          className="student-img"
                          variant="top"
                          style={{
                            height: "160px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={
                            student.profileImage
                              ? `${baseURL}/uploads/${student.profileImage}`
                              : profile
                          }
                          alt={student.name}
                        />

                        <div
                          className="card-hover"
                          style={{
                            position: "absolute",
                            color: "#fff",
                            top: "0",
                            height: "160px",
                            width: "100%",
                            opacity: "0.9",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingBottom: "10px",
                          }}
                        >
                          <Link to={"/profile"} className="add">
                            Add/Edit
                          </Link>
                          <Link to={"/profile"}>
                            <i className="fa-solid fa-plus add-icon ms-2"></i>
                          </Link>
                          <div>
                            {student.whatsapp &&
                              student.maskNumber === false && (
                                <Link
                                  to={`https://api.whatsapp.com/send/?phone=${student.whatsapp}`}
                                  target="_blank"
                                >
                                  <i className="fa-brands fa-whatsapp whatsapp-icon"></i>
                                </Link>
                              )}
                            {student.facebook && (
                              <Link to={student.facebook} target="_blank">
                                <i className="fa-brands fa-facebook fb-icon"></i>
                              </Link>
                            )}
                            {student.instagram && (
                              <Link to={student.instagram} target="_blank">
                                <i className="fa-brands fa-instagram insta-icon"></i>
                              </Link>
                            )}
                          </div>
                        </div>
                        <Card.Body style={{ height: "90px" }}>
                          <Card.Title
                            className="text-center"
                            style={{ fontSize: "16px" }}
                          >
                            {student.name}
                          </Card.Title>
                        </Card.Body>
                        <span className="rollno">{index+1}</span>
                      </Card>
                    </Col>
                  ))}
                </>
              )}

              {female?.length > 0 && (
                <>
                  <p className="text-center" style={{ fontSize: "40px" }}>
                    Girls 👧
                  </p>
                  {female.map((student, index) => (
                    <Col
                      key={student._id}
                      xs={6}
                      sm={6}
                      md={4}
                      lg={2}
                      className="d-flex justify-content-center"
                    >
                      <Card
                        className="student-card"
                        style={{ width: "160px", marginBottom: "15px" }}
                      >
                        <Card.Img
                          className="student-img"
                          variant="top"
                          style={{
                            height: "160px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={
                            student.profileImage
                              ? `${baseURL}/uploads/${student.profileImage}`
                              : profile
                          }
                          alt={student.name}
                        />

                        <div
                          className="card-hover"
                          style={{
                            position: "absolute",
                            color: "#fff",
                            top: "0",
                            height: "160px",
                            width: "100%",
                            opacity: "0.9",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingBottom: "10px",
                          }}
                        >
                          <Link to={"/profile"} className="add">
                            Add/Edit
                          </Link>
                          <Link to={"/profile"}>
                            <i className="fa-solid fa-plus add-icon ms-2"></i>
                          </Link>
                          <div>
                            {student.whatsapp &&
                              student.maskNumber === false && (
                                <Link
                                  to={`https://api.whatsapp.com/send/?phone=${student.whatsapp}`}
                                  target="_blank"
                                >
                                  <i className="fa-brands fa-whatsapp whatsapp-icon"></i>
                                </Link>
                              )}
                            {student.facebook && (
                              <Link to={student.facebook} target="_blank">
                                <i className="fa-brands fa-facebook fb-icon"></i>
                              </Link>
                            )}
                            {student.instagram && (
                              <Link to={student.instagram} target="_blank">
                                <i className="fa-brands fa-instagram insta-icon"></i>
                              </Link>
                            )}
                          </div>
                        </div>
                        <Card.Body style={{ height: "90px" }}>
                          <Card.Title
                            className="text-center"
                            style={{ fontSize: "16px" }}
                          >
                            {student.name}
                          </Card.Title>
                        </Card.Body>
                        <span className="rollno">{index+1}</span>
                      </Card>
                    </Col>
                  ))}
                </>
              )}
              <hr style={{backgroundColor:"#004526", height:"5px",}}/>
            </>
          ) : (
            <p className="text-center">No students</p>
          )}
          {!userId && (
            <Col lg={12} className="d-flex justify-content-center">
              <Card
                className="student-card"
                style={{
                  width: "160px",
                  marginBottom: "15px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                <Card.Img
                  className="student-img"
                  variant="top"
                  style={{ height: "160px", width: "100%", objectFit: "cover" }}
                  src={blank}
                  alt="Login"
                />
                <Card.Body style={{ height: "90px" }}>
                  <Card.Title
                    className="text-center"
                    style={{ fontSize: "16px", color: "green" }}
                  >
                    Add Student
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}

export default Classes;
