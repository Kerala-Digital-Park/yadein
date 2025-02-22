import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Table,
  Nav,
  Tab,
  Button,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import axios from "axios";
import useFetchMappings from "../components/useFetchMappings";
import EditAdmin from "../components/EditAdmin";
import Swal from "sweetalert2";
import "../styles/AdminList.css";

const baseURL = process.env.REACT_APP_API_URL;

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState("batchadmin");

  const [searchEmail, setSearchEmail] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const listAdmins = async (adminType) => {
    try {
      const response = await axios.get(
        `${baseURL}/admin/admin-list/${adminType}`
      );
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const { classMap, batchMap } = useFetchMappings(admins);

  const handleDelete = async (adminType, adminId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${baseURL}/admin/admin-delete/${adminType}/${adminId}`
          );
          listAdmins(activeTab);
          Swal.fire("Deleted!", "The admin has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting admin:", error);
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
    listAdmins(activeTab);
    setSearchEmail("");
    setSearchBatch("");
    setSearchClass("");
  }, [activeTab]);

  const filteredAdmins = admins.filter((admin) => {
    const matchesEmail = admin.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    const matchesBatch = searchBatch === "" || admin.batch === searchBatch;
    const matchesClass = searchClass === "" || admin.classForm === searchClass;

    return activeTab === "batchadmin"
      ? matchesEmail && matchesBatch
      : matchesEmail && matchesBatch && matchesClass;
  });

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row" style={{minHeight:"800px"}}>
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Admin List</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Tab.Container
                  id="admin-tabs"
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                >
                  <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                      <Nav.Link eventKey="batchadmin">Batch Admin</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="classadmin">Class Admin</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="batchadmin">
                      <Row className="mb-3">
                        <Col md={4}>
                          <Form.Control
                            type="text"
                            placeholder="Search by Email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="mb-3"
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            value={searchBatch}
                            onChange={(e) => setSearchBatch(e.target.value)}
                          >
                            <option value="">All Batches</option>
                            {Object.keys(batchMap).map((batch) => (
                              <option key={batch} value={batch}>
                                {batchMap[batch]}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>

                      <Table responsive striped>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Batch</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdmins.map((admin, index) => (
                            <tr key={admin._id}>
                              <td>{index + 1}</td>
                              <td>{admin.email}</td>
                              <td>{batchMap[admin.batch]}</td>
                              <td className="d-flex">
                                <EditAdmin
                                  adminData={admin}
                                  refreshAdminList={listAdmins}
                                />
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDelete(admin.adminType, admin._id)
                                  }
                                  className="ms-2"
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>

                    <Tab.Pane eventKey="classadmin">
                      <Row className="mb-3">
                        <Col md={4}>
                          <Form.Control
                            type="text"
                            placeholder="Search by Email"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="mt-3"
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            value={searchBatch}
                            onChange={(e) => setSearchBatch(e.target.value)}
                            className="mt-3"
                          >
                            <option value="">All Batches</option>
                            {Object.keys(batchMap).map((batch) => (
                              <option key={batch} value={batch}>
                                {batchMap[batch]}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            value={searchClass}
                            onChange={(e) => setSearchClass(e.target.value)}
                            className="mt-3"
                          >
                            <option value="">All Classes</option>
                            {Object.keys(classMap).map((cls) => (
                              <option key={cls} value={cls}>
                                {classMap[cls]}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>

                      <Table responsive striped>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Batch</th>
                            <th>Class</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAdmins.map((admin, index) => (
                            <tr key={admin._id}>
                              <td>{index + 1}</td>
                              <td>{admin.email}</td>
                              <td>{batchMap[admin.batch]}</td>
                              <td>{classMap[admin.classForm]}</td>
                              <td className="d-flex">
                                <EditAdmin
                                  adminData={admin}
                                />
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDelete(admin.adminType, admin._id)
                                  }
                                  className="ms-2"
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default AdminList;
