import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Table, Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import EditClass from "../components/EditClass";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function ClassList() {
  const [classForm, setClassForm] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("all");

  const listClass = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/class-list`);
      setClassForm(response.data);
    } catch (error) {
      console.error("Error fetching class list:", error);
    }
  };

  const handleDelete = async (classId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this class!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/class-delete/${classId}`);
          listClass();
          Swal.fire("Deleted!", "The class has been removed.", "success");
        } catch (error) {
          console.error("Error deleting class:", error);
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
    listClass();
  }, []);

  const uniqueBatches = [...new Set(classForm.map((cls) => cls.batch.year))];

  const filteredClasses =
    selectedBatch === "all"
      ? classForm
      : classForm.filter((cls) => cls.batch.year === selectedBatch);

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row" style={{minHeight:"800px"}}>
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Class List</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="d-flex flex-column gap-2">

                <Form.Group controlId="batchSelect" className="mb-2 d-flex">
                  <Form.Label className="mt-2">Select Batch:</Form.Label>
                  <Form.Select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-50 ms-4"
                  >
                    <option value="all">All Batches</option>
                    {uniqueBatches.map((batch, index) => (
                      <option key={index} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Batch</th>
                      <th>Class</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.map((i, index) => (
                      <tr key={index}>
                        <td className="align-middle">{index + 1}</td>
                        <td className="align-middle">{i.batch.year}</td>
                        <td className="align-middle">{i.classForm}</td>
                        <td className="align-middle">
                          {i.profileImage && (
                            <img
                              src={`${baseURL}/uploads/${i.profileImage}`}
                              alt="Profile"
                              width="100"
                              className="img-fluid"
                            />
                          )}
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center gap-2">
                            
                          <EditClass
                            classData={i}
                            refreshClassList={listClass}
                          />
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(i._id)}
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

export default ClassList;
