import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function AddStaff({ refreshStaffList }) {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialState = {
    name: "",
    staffType: "",
  };

  const [staffs, setStaffs] = useState(initialState);

  const handleClear = () => {
    setStaffs(initialState);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!staffs.name || !staffs.staffType) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
        return;
      }

    const formData = new FormData();
    formData.append("name", staffs.name);
    formData.append("staffType", staffs.staffType);

    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const result = await axios.post(`${baseURL}/admin/add-staff`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Staff Added",
          text: "Staff member added successfully!",
        });
        handleClear();
        handleClose();
        refreshStaffList();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
      console.error("Error adding staff:", error);
    }
  };
  return (
    <div>
      <Button style={{backgroundColor:"#CCDC77", color:"black"}} onClick={handleShow}>
        Add Staff
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Staff</Modal.Title>
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
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddStaff;
