import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import useFetchMappings from "../components/useFetchMappings";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function Updates() {
  const [students, setStudents] = useState([]);

  const listUpdates = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/update-list`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleReject = async (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once rejected, you will not be able to recover this student's data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/update-delete/${studentId}`);
          listUpdates();
          Swal.fire("Rejected!", "The update has been rejected.", "success");
        } catch (error) {
          console.error("Error rejecting update:", error);
          Swal.fire(
            "Error!",
            "Something went wrong. Try again later.",
            "error"
          );
        }
      }
    });
  };

  const handleAccept = async (student) => {
    
    try {
      const studentData = {
        studentId:student._id,
        name: student.name,
        batch: student.batch,
        classForm: student.classForm,
        password: student.password,
        email: student.email,
        contact: student.contact,
        whatsapp: student.whatsapp,
        facebook: student.facebook,
        instagram: student.instagram,
        gender: student.gender,
        occupation: student.occupation,
        maskNumber: student.maskNumber,
        profileImage: student.profileImage,
      };
  
      const result = await axios.post(
        `${baseURL}/admin/add-student-update`,
        studentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Student Updated",
          text: "Student updated successfully!",
        });
  
        listUpdates(); 
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
      console.error("Error adding student:", error);
    }
  };
  
  
  useEffect(() => {
    listUpdates();
  }, []);

  const { classMap, batchMap } = useFetchMappings(students);

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row" style={{minHeight:"800px"}}>
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Updates List</h3>
              </Col>
            </Row>

            <Row>
              <Col>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Batch</th>
                      <th>Class</th>
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
                    {students.map((student, index) => (
                      <tr key={student._id}>
                        <td className="align-middle">{index + 1}</td>
                        <td className="align-middle">{student.name}</td>
                        <td className="align-middle">
                          {batchMap[student.batch]}
                        </td>
                        <td className="align-middle">
                          {classMap[student.classForm]}
                        </td>
                        <td className="align-middle">{student.email}</td>
                        <td className="align-middle">{student.contact}</td>
                        <td className="align-middle">{student.whatsapp}</td>
                        <td className="align-middle">{student.gender}</td>
                        <td className="align-middle">{student.facebook}</td>
                        <td className="align-middle">{student.instagram}</td>
                        <td className="align-middle">{student.occupation}</td>

                        <td className="align-middle">
                          {student.profileImage && (
                            <img
                              src={`${baseURL}/uploads/${student.profileImage}`}
                              alt="Profile"
                              width="80"
                              height="80"
                              className="img-fluid rounded"
                            />
                          )}
                        </td>

                        <td className="align-middle">
                          <div className="d-flex align-items-center gap-2">
                          <Button
                              variant="success"
                              onClick={() => handleAccept(student)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleReject(student._id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default Updates;
