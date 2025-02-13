import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Table, Tabs, Tab, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import AddStaff from "../components/AddStaff";
import EditStaff from "../components/EditStaff";
import Swal from "sweetalert2";
import '../styles/AdminList.css'

const baseURL = process.env.REACT_APP_API_URL;

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [key, setKey] = useState("all");

  const listStaff = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/staff-list`);
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleDelete = async (staffId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this staff member!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/staff-delete/${staffId}`);
          listStaff();
          Swal.fire(
            "Deleted!",
            "The staff member has been removed.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting staff:", error);
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
    listStaff();
  }, []);

  const filteredStaff =
    key === "all" ? staff : staff.filter((s) => s.staffType === key);

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row">
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Staff List</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <AddStaff refreshStaffList={listStaff} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Tabs
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3 mt-3"
                >
                  <Tab eventKey="all" title="All" />
                  <Tab eventKey="principal" title="Principal" />
                  <Tab eventKey="teacher" title="Teacher" />
                  <Tab eventKey="non-teaching" title="Non-teaching Staff" />
                </Tabs>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((i, index) => (
                      <tr key={index}>
                        <td className="align-middle">{index + 1}</td>
                        <td className="align-middle">{i.name}</td>
                        <td className="align-middle">{i.staffType}</td>
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
                            <EditStaff
                              staffData={i}
                              refreshStaffList={listStaff}
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

export default StaffList;
