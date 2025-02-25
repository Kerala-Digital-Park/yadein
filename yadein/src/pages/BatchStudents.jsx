import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AddStudent from "../components/AddStudent";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AddAdmin from "../components/AddAdmin";
import EditStudent from "../components/EditStudent";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function BatchStudents() {
  const adminType = sessionStorage.getItem("adminType");
  const { year, classForm } = useParams();

  const [students, setStudents] = useState([]);
  const [classFormName, setClassFormName] = useState("");
  const [batch, setBatch] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/admin/class-student-list?year=${year}&classForm=${classForm}`
      );
      setStudents([...response.data]);
    } catch (error) {
      console.error("Error listing students:", error.response?.data || error);
      setStudents([]);
    }
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
      setBatch(response.data.year);
    } catch (error) {
      console.error("Error fetching batch details:", error);
    }
  };

  const handleDelete = async (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/student-delete/${studentId}`);
          await fetchStudents();
          Swal.fire("Deleted!", "Student has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting student:", error);
          Swal.fire("Error!", "Something went wrong. Try again.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchStudents();
    fetchBatchDetails();
  }, [year, classForm, students.length]);

  useEffect(() => {
    fetchClassFormDetails();
  }, [students]);

  return (
    <>
      <Header />
      <div
        className="d-flex flex-column flex-lg-row"
        style={{ minHeight: "800px" }}
      >
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>
                  Students of Class {classFormName}, {batch}
                </h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="d-flex flex-wrap gap-2">
                {(adminType === "batchadmin" || adminType === "superadmin") && (
                  <AddAdmin year={year} classForm={classForm} />
                )}
                <AddStudent refreshStudentList={fetchStudents} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Whatsapp</th>
                      <th>Gender</th>
                      <th>Facebook</th>
                      <th>Instagram</th>
                      <th>Occupation</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map((student, index) => (
                        <tr key={student._id}>
                          <td className="align-middle">{index + 1}</td>
                          <td className="align-middle">{student.name}</td>
                          <td className="align-middle">{student.email}</td>
                          <td className="align-middle">{student.contact}</td>
                          <td className="align-middle">{student.whatsapp}</td>
                          <td className="align-middle">{student.gender}</td>
                          <td className="align-middle text-center ">
                            {student.facebook && (
                              <Link to={student.facebook} target="_blank">
                                <i
                                  className="fa-brands fa-facebook"
                                  style={{ fontSize: "25px" }}
                                ></i>
                              </Link>
                            )}
                          </td>
                          <td className="text-center align-middle">
                            {student.instagram && (
                              <Link to={student.instagram} target="_blank">
                                <i
                                  className="fa-brands fa-instagram"
                                  style={{ color: "#e1306c", fontSize: "25px" }}
                                ></i>
                              </Link>
                            )}
                          </td>
                          <td className="align-middle">{student.occupation}</td>
                          <td className="align-middle">
                            {student.profileImage && (
                              <img
                                src={`${baseURL}/uploads/${student.profileImage}`}
                                alt="Profile"
                                width="100"
                                className="img-fluid"
                              />
                            )}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center gap-2">
                              <EditStudent
                                studentData={student}
                                refreshStudentList={fetchStudents}
                                batchMap={{}}
                                classMap={{}}
                              />
                              <Button
                                variant="danger"
                                onClick={() => handleDelete(student._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="text-center">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default BatchStudents;
