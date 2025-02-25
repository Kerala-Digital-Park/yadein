import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import AddAdmin from "../components/AddAdmin";
import AddClass from "../components/AddClass";
import EditClass from "../components/EditClass";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function BatchClasses() {
  const adminType = sessionStorage.getItem("adminType");
  const { year } = useParams();
  const [classes, setClasses] = useState([]);
  const [batch, setBatch] = useState("");
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/admin/batch-class-list?year=${year}`
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
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

  const handleDelete = async (classId) => {
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
          await axios.delete(`${baseURL}/admin/class-delete/${classId}`);
          
          if (classes.length === 1) {
            setClasses([]);
          } else {
            await fetchClasses();
          }

          Swal.fire("Deleted!", "Class has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting class:", error);
          Swal.fire("Error!", "Something went wrong. Try again.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchClasses();
    fetchBatchDetails();
  }, [year]);

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row" style={{minHeight:"800px"}}>
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Classes of Batch {batch}</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="d-flex flex-wrap gap-2">
                {adminType === "superadmin" && <AddAdmin year={year} />}
                <AddClass refreshClassList={fetchClasses} year={year} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Class Name</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length > 0 ? (
                      classes.map((c, index) => (
                        <tr key={c._id}>
                          <td className="align-middle">
                            {index + 1}
                          </td>
                          <td className="align-middle">
                            {c.classForm}
                          </td>
                          <td className="align-middle">
                          {c.profileImage && (
                            <img
                              src={`${baseURL}/uploads/${c.profileImage}`}
                              alt="Profile"
                              width="100"
                              className="img-fluid"
                            />
                          )}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center gap-2">
                            <EditClass
                              classData={c}
                              refreshClassList={fetchClasses}
                            />
                            <Button variant="success" onClick={() =>
                              navigate(`/admin/batch/${c.batch._id}/${c._id}`)
                            }
                            style={{ cursor: "pointer" }}
                            className="ms-4">
                              Students
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(c._id)}
                               className="ms-4"
                            >
                              Delete
                            </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No classes found.
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

export default BatchClasses;
