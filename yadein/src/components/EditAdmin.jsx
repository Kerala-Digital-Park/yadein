import { React, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditAdmin({ adminData, refreshAdminList }) {
  const [show, setShow] = useState(false);
  const [adminDetails, setAdminDetails] = useState(adminData);
  const [classFormName, setClassFormName] = useState("");

  const classForm = adminData.classForm;

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

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setAdminDetails(adminData);
    setShow(true);
  };

  const handleClear = () => setAdminDetails({ password: "" });

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!adminDetails.password) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }
    try {
      const result = await axios.put(
        `${baseURL}/admin/admin-edit/${adminData.adminType}/${adminData._id}`,
        adminDetails
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Admin edited successfully.",
        });
        handleClose();
        refreshAdminList();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    fetchClassFormDetails();
  });

  return (
    <>
      <Button variant="warning" onClick={handleShow} className="me-3">
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Class</Modal.Title>
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
                    disabled
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
          <Button variant="primary" onClick={handleEdit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditAdmin;
