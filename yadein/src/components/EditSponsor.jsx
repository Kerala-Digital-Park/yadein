import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditSponsor({ sponsorData, refreshSponsorList }) {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);

  const initialState = {
    name: "",
  };

  const [sponsorDetails, setSponsorDetails] = useState(
    sponsorData || initialState
  );

  useEffect(() => {
    if (sponsorData) {
      setSponsorDetails(sponsorData);
    }
  }, [sponsorData]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setSponsorDetails(sponsorData);
    setShow(true);
  };

  const handleClear = () => {
    setSponsorDetails(sponsorData);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!sponsorDetails.name) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", sponsorDetails.name.trim());
     
      if (image) {
        formData.append("image", image);
      }

      const result = await axios.put(
        `${baseURL}/admin/sponsor-edit/${sponsorData._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Sponsor edited successfully.",
        });
        handleClose();
        refreshSponsorList();
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
          <Modal.Title>Edit Sponsor</Modal.Title>
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
                    value={sponsorDetails.name}
                    onChange={(e) =>
                      setSponsorDetails({
                        ...sponsorDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-lg-12">
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {image && <small>{image.name}</small>}
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

export default EditSponsor;
