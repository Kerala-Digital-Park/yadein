import { React, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_URL;

function AddStudent({ refreshStudentList }) {
  const { year, classForm} = useParams();
  
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [classFormName, setClassFormName] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const [studentDetails, setStudentDetails] = useState(initialState);

  const handleClear = () => {
    setStudentDetails(initialState);
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const fetchClassFormDetails = async () => {
    if (!classForm) return;
    try {
      const response = await axios.get(
        `${baseURL}/admin/get-class-form/${classForm}`
      );
      setClassFormName(response.data.classForm);
    } catch (error) {
      console.error("Error fetching class form details:", error);
    }
  };

  const fetchBatchDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/get-batch/${year}`);
      setBatches(response.data.year);
    } catch (error) {
      console.error("Error fetching batch details:", error);
    }
  };

  const handleAdd = async (e) => {
    
    e.preventDefault();
    
    if (
      !studentDetails.name ||
      !studentDetails.gender
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill name and gender fields before submitting.",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("name", studentDetails.name.trim());
    formData.append("year", year);
    formData.append("classForm", classForm);
    formData.append("password", studentDetails.password);
    formData.append("email", studentDetails.email?.trim() || "");
    formData.append("contact", studentDetails.contact?studentDetails.contact : "");
    formData.append("whatsapp", studentDetails.whatsapp? studentDetails.whatsapp: "");
    formData.append("facebook", studentDetails.facebook?.trim() || "");
    formData.append("instagram", studentDetails.instagram?.trim() || "");
    formData.append("gender", studentDetails.gender);
    formData.append("occupation", studentDetails.occupation);
    
    if (image) {
      formData.append("profileImage", image);
    }
    
    try {
      const result = await axios.post(
        `${baseURL}/admin/add-student`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      if (result.status === 200) {
        console.log("result",result.data);
        Swal.fire({
          icon: "success",
          title: "Student Added",
          text: "Student added successfully!",
        });
        handleClear();
        handleClose();
        refreshStudentList();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Something went wrong!",
      });
      console.error("Error adding student:", error);
    }
  };

  useEffect(() => {
    fetchClassFormDetails();
  }, [year, classForm]);

  useEffect(() => {
    fetchBatchDetails();
  }, [year]);

  useEffect(() => {
    if (studentDetails.year) {
      const filtered = classes.filter(
        (cls) => cls.batch.year === studentDetails.year
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses([]);
    }
  }, [studentDetails.year, classes]);

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
    <div>
      <Button
        style={{ backgroundColor: "#CCDC77", color: "black" }}
        onClick={handleShow}
      >
        Add Student
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Batch</Form.Label>
                  <Form.Control type="text" value={batches} disabled />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Control type="text" value={classFormName} disabled />
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

              <div>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {image && <small>{image.name}</small>}{" "}
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddStudent;
