import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditClass({ classData, refreshClassList }) {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);

  const initialState = {
    year: "",
    classForm: "",
  };

  const [classDetails, setClassDetails] = useState(initialState);

  useEffect(() => {
    if (classData) {
      setClassDetails(classData);
    }
  }, [classData]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setClassDetails(classData);
    setShow(true);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleClear = () => {
    setClassDetails(initialState);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!classDetails.classForm) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("year", classDetails.batch._id);
      formData.append("classForm", classDetails.classForm);
      if (image) {
        formData.append("image", image);
      }

      const result = await axios.put(
        `${baseURL}/admin/class-edit/${classData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Class edited successfully.",
        });
        handleClose();
        refreshClassList();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.data || "Something went wrong!",
        });
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
      <Button variant="warning" onClick={handleShow}>
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="col-lg-6">
              <Form.Group className="mb-3">
                <Form.Label>Batch</Form.Label>
                <Form.Control
                  value={classData.batch.year}
                  onLoad={(e) =>
                    setClassDetails({
                      ...classDetails,
                      year: classData.batch.year,
                    })
                  }
                  disabled
                />
              </Form.Group>
            </div>

            <div className="col-lg-6">
              <Form.Group className="mb-3">
                <Form.Label>Class</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Class"
                  value={classDetails.classForm}
                  onChange={(e) =>
                    setClassDetails({
                      ...classDetails,
                      classForm: e.target.value,
                    })
                  }
                />
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

export default EditClass;
