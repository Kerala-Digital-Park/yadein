import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Container, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNav from "../components/UserNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL;

function StudentAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const initialState = {
    name: "",
    email: "",
    password: "",
    year: "",
    classForm: "",
    gender: "",
  };
  const [studentDetails, setStudentDetails] = useState(initialState);

  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/batch-list`);
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/class-list`);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !isLogin &&
      (!studentDetails.name ||
        !studentDetails.year ||
        !studentDetails.classForm ||
        !studentDetails.gender)
    ) {
      toast.warn("Please fill in all fields!");
      return;
    }

    const reqBody = isLogin
      ? { email: studentDetails.email, password: studentDetails.password }
      : { ...studentDetails, classForm: studentDetails.classForm };

    try {
      const url = isLogin ? `${baseURL}/user/login` : `${baseURL}/user/signup`;
      const response = await axios.post(url, reqBody);

      if (response.status === 201) {
        setStudentDetails(initialState);
        sessionStorage.setItem("userId", response.data.userId);
        sessionStorage.setItem("token", response.data.token);

        toast.success(isLogin ? "Login Successful!" : "Signup complete!");
        navigate("/profile");
      } else {
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Signup/Login error:", error);

      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong.");
      } else {
        toast.error("Server error. Please try again later.");
      }
    }
  };

  return (
    <>
      <UserNav />
      <ToastContainer position="top-center" autoClose={3000} />
      <Container
        className="d-flex justify-content-center"
        style={{ marginTop: "100px"}}
      >
        <Card className="p-4 shadow" style={{ width: "420px", marginBottom:"15vh" }}>
          <h3 className="text-center">
            {isLogin ? "Student Login" : "Student Signup"}
          </h3>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={studentDetails.name}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Batch</Form.Label>
                  <Form.Select
                    name="year"
                    value={studentDetails.year}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        year: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select...</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch.year}>
                        {batch.year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    name="classForm"
                    value={studentDetails.classForm}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        classForm: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select...</option>
                    {filteredClasses.map((cls) => (
                      <option key={cls._id} value={cls.classForm}>
                        {cls.classForm}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={studentDetails.gender}
                    onChange={(e) =>
                      setStudentDetails({
                        ...studentDetails,
                        gender: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={studentDetails.email}
                onChange={(e) =>
                  setStudentDetails({
                    ...studentDetails,
                    email: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={studentDetails.password}
                onChange={(e) =>
                  setStudentDetails({
                    ...studentDetails,
                    password: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              style={{ backgroundColor: "#b2d12e", border: "#b2d12e" }}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form>
          <p className="text-center mt-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </p>
        </Card>
      </Container>
    </>
  );
}

export default StudentAuth;
