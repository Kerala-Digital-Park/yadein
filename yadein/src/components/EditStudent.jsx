import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditStudent({ studentData, refreshStudentList, batchMap, classMap }) {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
    const [jobs, setJobs] = useState([]);

  const initialState = {
    name: "",
    year: "",
    classForm: "",
    password: "",
    email: "",
    contact: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    gender: "",
    occupation: "",
  };

  const [studentDetails, setStudentDetails] = useState(
    studentData || initialState
  );

  useEffect(() => {
    if (studentData) {
      setStudentDetails(studentData);
    }
  }, [studentData]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setStudentDetails(studentData);
    setShow(true);
  };

  const handleClear = () => {
    setStudentDetails(studentData);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!studentDetails.name || !studentDetails.gender) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", studentDetails.name.trim());
      formData.append("email", studentDetails.email?.trim() || "");
      formData.append(
        "contact",
        studentDetails.contact ? studentDetails.contact : ""
      );
      formData.append(
        "whatsapp",
        studentDetails.whatsapp ? studentDetails.whatsapp : ""
      );
      formData.append("facebook", studentDetails.facebook?.trim() || "");
      formData.append("instagram", studentDetails.instagram?.trim() || "");
      formData.append("gender", studentDetails.gender);
      formData.append("occupation", studentDetails.occupation);
      formData.append("password", studentDetails.password?.trim() || "");

      if (image) {
        formData.append("image", image);
      }

      const result = await axios.put(
        `${baseURL}/admin/student-edit/${studentData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Student edited successfully.",
        });
        handleClose();
        refreshStudentList();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
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
      <Button variant="warning" onClick={handleShow} className="me-3">
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Batch</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      batchMap[studentDetails.batch] || studentData.batch.year
                    }
                    disabled
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      classMap[studentDetails.classForm] ||
                      studentData.classForm.classForm
                    }
                    disabled
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={studentDetails.name}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={studentDetails.email}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter number"
                    value={studentDetails.contact}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        contact: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Whatsapp Number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter whatsapp number"
                    value={studentDetails.whatsapp}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        whatsapp: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter facebook profile link"
                    value={studentDetails.facebook}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        facebook: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter instagram profile link"
                    value={studentDetails.instagram}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        instagram: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={studentDetails.gender}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Select
                    value={studentDetails.occupation}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        occupation: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Occupation</option>
                    {jobs.map((job) => (
                      <option key={job._id} value={job.job}>
                        {job.job}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={studentDetails.password}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        password: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-12">
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {image && <small>{image.name}</small>}
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditStudent;
