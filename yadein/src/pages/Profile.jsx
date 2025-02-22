import React, { useEffect, useState } from "react";
import UserNav from "../components/UserNav";
import axios from "axios";
import { Col, Row, Form, Button, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL = process.env.REACT_APP_API_URL;

function Profile() {
  const userId = sessionStorage.getItem("userId");
  const [batch, setBatch] = useState("");
  const [classFormName, setClassFormName] = useState("");
  const [jobs, setJobs] = useState([]);
  const [image, setImage] = useState(null);

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    gender: "",
    email: "",
    contact: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    occupation: "",
    profileImage: "",
    maskNumber: false,
  });
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/${userId}`);
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const classId = studentDetails.classForm;
  const batchId = studentDetails.batch;

  useEffect(() => {
    const fetchClassFormDetails = async () => {
      if (!classId) return;
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-class-form/${classId}`
        );
        setClassFormName(response.data.classForm);
      } catch (error) {
        console.error("Error fetching class form details:", error);
      }
    };
    fetchClassFormDetails();
  }, [classId]);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-batch/${batchId}`
        );
        setBatch(response.data.year);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    };
    fetchBatchDetails();
  }, [batchId]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (
      !studentDetails.name ||
      !studentDetails.gender ||
      !studentDetails.classForm ||
      !studentDetails.batch
    ) {
      toast.warning("Please fill out all required fields before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("batch", studentDetails.batch);
      formData.append("classForm", studentDetails.classForm);
      formData.append("name", studentDetails.name.trim());
      formData.append("email", studentDetails.email?.trim() || "");
      formData.append("contact", studentDetails.contact || "");
      formData.append("whatsapp", studentDetails.whatsapp || "");
      formData.append("facebook", studentDetails.facebook?.trim() || "");
      formData.append("instagram", studentDetails.instagram?.trim() || "");
      formData.append("gender", studentDetails.gender);
      formData.append("occupation", studentDetails.occupation);
      formData.append("maskNumber", studentDetails.maskNumber);
      if (image) {
        formData.append("image", image || null);
      }

      const result = await axios.put(
        `${baseURL}/admin/update-edit/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.status === 200) {
        toast.success(
          "Profile updated successfully! Your changes are pending approval from the owner. We'll notify you once they're reviewed."
        );
        fetchUser();
      }
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/job-list`);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <style>
        {`
.form-check-input:checked {
  background-color: #b2d12e !important;
  border-color: #b2d12e !important;
}

.custom-input {
  background-color: #b2d12e !important;
  border: 1px solid #a2be2c; /* Optional: Adjust border color */
  color: #000; /* Optional: Set text color for contrast */
  width:80%
}

.custom-input:focus {
  background-color: #a2c925 !important; /* Slightly darker green on focus */
  border-color: #8faa22 !important;
}

.custom-dropdown {
  position: relative;
  background-color:white;
  border: 1px solid black;
}

option:hover {
  background-color: #b2d12e;
  border: 1px solid black
  color: black;
}
`}
      </style>
      <UserNav />
      <Container className="rounded mt-3 p-4 w-75">
        <Row className="d-flex align-items-center justify-content-center mx-auto">
          <Col
            sm={12}
            md={4}
            lg={6}
            className="d-flex align-items-center flex-column justify-content-center mb-3"
          >
            <h1 style={{ color: "#b2d12e" }}>
              Wish to make your classroom active?
            </h1>
            <h3 className="text-center">
              Add your details here & start networking with your friends.
            </h3>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col xs={12}>
            <Form onSubmit={handleAdd}>
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Batch</Form.Label>
                    <Form.Control
                      type="text"
                      value={batch}
                      disabled
                      className="custom-input"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Class</Form.Label>
                    <Form.Control
                      type="text"
                      value={classFormName}
                      disabled
                      className="custom-input"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      className="custom-input"
                      required
                      type="text"
                      value={studentDetails.name}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          name: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="email"
                      value={studentDetails.email}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      className="custom-input"
                      required
                      value={studentDetails.gender}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option value="" className="custom-dropdown">
                        Select Gender
                      </option>
                      <option value="male" className="custom-dropdown">
                        Male
                      </option>
                      <option value="female" className="custom-dropdown">
                        Female
                      </option>
                      <option value="other" className="custom-dropdown">
                        Other
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Occupation</Form.Label>
                    <Form.Select
                      className="custom-input"
                      value={studentDetails.occupation}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          occupation: e.target.value,
                        })
                      }
                    >
                      <option value="" className="custom-dropdown">
                        Select Occupation
                      </option>
                      {jobs.map((job) => (
                        <option
                          key={job._id}
                          value={job.job}
                          className="custom-dropdown"
                        >
                          {job.job}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="text"
                      value={studentDetails.contact}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          contact: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>WhatsApp</Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="text"
                      value={studentDetails.whatsapp}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          whatsapp: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Facebook Link</Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="text"
                      value={studentDetails.facebook}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          facebook: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Instagram Link</Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="text"
                      value={studentDetails.instagram}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          instagram: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Profile Image</Form.Label>
                    <Form.Control
                      className="custom-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {image && <small>{image.name}</small>}
                  </Form.Group>
                </Col>
                
                <Col xs={12} md={6}>
                  <Form.Group style={{marginTop:"40px"}}>
                    <Form.Check
                      type="switch"
                      id="maskNumberSwitch"
                      label="Mask Contact & WhatsApp Number"
                      className="custom-switch"
                      checked={studentDetails.maskNumber}
                      onChange={(e) =>
                        setStudentDetails({
                          ...studentDetails,
                          maskNumber: e.target.checked,
                        })
                      }
                    />
                  </Form.Group>
                </Col>

              </Row>

              <Row>
                <Col className="text-center">
                  <Button variant="success" type="submit">
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
