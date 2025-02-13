import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Button, Table, Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import EditStudent from "../components/EditStudent";
import useFetchMappings from "../components/useFetchMappings";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function StudentList() {
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedOccupation, setSelectedOccupation] = useState("all");

  const listStudents = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/student-list`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this student's data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/student-delete/${studentId}`);
          listStudents();
          Swal.fire("Deleted!", "The student has been removed.", "success");
        } catch (error) {
          console.error("Error deleting student:", error);
          Swal.fire(
            "Error!",
            "Something went wrong. Try again later.",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    listStudents();
  }, []);

  const { classMap, batchMap } = useFetchMappings(students);

  const uniqueBatches = [...new Set(students.map((s) => s.batch))];
  const uniqueClasses = [...new Set(students.map((s) => s.classForm))];
  const uniqueOccupations = [
    "Unspecified",
    ...new Set(students.map((s) => s.occupation).filter((o) => o)),
  ];

  const filteredStudents = students.filter((student) => {
    const batchMatch =
      selectedBatch === "all" || student.batch === selectedBatch;
    const classMatch =
      selectedClass === "all" || student.classForm === selectedClass;
    const occupationMatch =
      selectedOccupation === "all" ||
      (selectedOccupation === "Unspecified" && !student.occupation) ||
      student.occupation === selectedOccupation;
      
    return batchMatch && classMatch && occupationMatch;
  });

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row">
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Student List</h3>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="batchSelect" className="d-flex">
                  <Form.Label className="mt-2">Select Batch:</Form.Label>
                  <Form.Select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="ms-3"
                  >
                    <option value="all">All Batches</option>
                    {uniqueBatches.map((batch, index) => (
                      <option key={index} value={batch}>
                        {batchMap[batch] || batch}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="classSelect" className="d-flex">
                  <Form.Label className="mt-2">Select Class:</Form.Label>
                  <Form.Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="ms-3 mt-3"
                  >
                    <option value="all">All Classes</option>
                    {uniqueClasses.map((cls, index) => (
                      <option key={index} value={cls}>
                        {classMap[cls] || cls}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="occupationSelect" className="d-flex">
                  <Form.Label className="mt-2">Select Occupation:</Form.Label>
                  <Form.Select
                    value={selectedOccupation}
                    onChange={(e) => setSelectedOccupation(e.target.value)}
                    className="ms-3 mt-3"
                  >
                    <option value="all">All Occupations</option>
                    {uniqueOccupations.map((occupation, index) => (
                      <option key={index} value={occupation}>
                        {occupation}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
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
                    {filteredStudents.map((student, index) => (
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
                            <EditStudent
                              studentData={student}
                              refreshStudentList={listStudents}
                              batchMap={batchMap}
                              classMap={classMap}
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

export default StudentList;
