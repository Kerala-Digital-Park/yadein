import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditStaff({ staffData, refreshStaffList }) {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);

  const [staffs, setStaffs] = useState(staffData);

  useEffect(() => {
    if (staffData) {
      setStaffs(staffData);
    }
  }, [staffData]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setStaffs(staffData);
    setShow(true);
  };

  const handleClear = () => {
    setStaffs(staffData);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!staffs.name.trim() || !staffs.staffType) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", staffs.name.trim());
      formData.append("staffType", staffs.staffType);
      if (image) {
        formData.append("image", image);
      }

      const result = await axios.put(
        `${baseURL}/admin/staff-edit/${staffData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Staff edited successfully.",
        });
        handleClose();
        refreshStaffList();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
    }
  };
  return (
    <>
      <Button variant="warning" onClick={handleShow} className="me-3">
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={staffs.name}
                    onChange={(e) =>
                      setStaffs({
                        ...staffs,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Staff Type</Form.Label>
                  <Form.Select
                    value={staffs.staffType}
                    onChange={(e) =>
                      setStaffs({
                        ...staffs,
                        staffType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="principal">Principal</option>
                    <option value="teacher">Teacher</option>
                    <option value="non-teaching">Non-teaching Staff</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {image && <small>{image.name}</small>}{" "}
                </Form.Group>
              </div>
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

export default EditStaff;
