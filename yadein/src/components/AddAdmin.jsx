import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function AddAdmin({ year, classForm }) {
  const [show, setShow] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    email: "",
    password: "",
  });
  
  const [existingAdmin, setExistingAdmin] = useState(null);

  useEffect(() => {
    if (!classForm && year) {
      fetchBatchAdmin();
    }
  }, [year, classForm]);

  useEffect(() => {
    if (classForm && year) {
      fetchClassAdmin();
    }
  }, [year, classForm]);

  const fetchBatchAdmin = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/admin/get-batch-admin/${year}`
      );
      if (response.data) {
        setExistingAdmin(response.data);
      }
    } catch (error) {
      console.error("Error fetching batch admin:", error);
    }
  };

  const fetchClassAdmin = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/admin/get-class-admin/${year}/${classForm}`
      );
      if (response.data) {
        setExistingAdmin(response.data);
      }
    } catch (error) {
      console.error("Error fetching class admin:", error);
    }
  };

  const [classFormName, setClassFormName] = useState("");

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

  useEffect(() => {
    fetchClassFormDetails();
  }, [adminDetails]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClear = () => setAdminDetails({ email: "", password: "" });

  const handleAdd = async (e) => {
    e.preventDefault();

    const { email, password } = adminDetails;
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all fields!",
      });
      return;
    }

    try {
      const reqBody = { email, password };

      const url = classForm
        ? `${baseURL}/admin/add-class-admin/${year}/${classForm}`
        : `${baseURL}/admin/add-batch-admin/${year}`;

      const result = await axios.post(url, reqBody);

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Admin added successfully.",
        });
        handleClear();
        handleClose();
        fetchBatchAdmin();
        fetchClassAdmin();
      }
    } catch (error) {
      const errorMsg = error.response?.data || "Something went wrong!";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
      console.error("Error adding admin:", error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column">
        <Button
          // variant="primary"
          onClick={handleShow}
          className="me-5 mb-3"
          disabled={!!existingAdmin}
          style={{backgroundColor:"#CCDC77", color:"black"}}
        >
          {classForm ? "Add Class Admin" : "Add Batch Admin"}
        </Button>
        {existingAdmin && !classForm && (
          <p>
            <strong>Batch Admin:</strong> {existingAdmin.email}
          </p>
        )}

        {existingAdmin && classForm && (
          <p>
            <strong>Class Admin:</strong> {existingAdmin.email}
          </p>
        )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {classForm ? "Add Class Admin" : "Add Batch Admin"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={adminDetails.email}
                    onChange={(e) =>
                      setAdminDetails({
                        ...adminDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={adminDetails.password}
                    onChange={(e) =>
                      setAdminDetails({
                        ...adminDetails,
                        password: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              {classForm && (
                <div className="col-lg-12">
                  <Form.Group className="mb-3">
                    <Form.Label>Class Form</Form.Label>
                    <Form.Control
                      type="text"
                      value={classFormName || "N/A"}
                      disabled
                    />
                  </Form.Group>
                </div>
              )}
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
    </>
  );
}

export default AddAdmin;
