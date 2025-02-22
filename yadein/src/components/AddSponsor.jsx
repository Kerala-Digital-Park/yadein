import { React, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function AddSponsor({ refreshSponsorList }) {
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialState = {
    name: "",
  };

  const [sponsorDetails, setSponsorDetails] = useState(initialState);

  const handleClear = () => {
    setSponsorDetails(initialState);
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!sponsorDetails.name) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", sponsorDetails.name);

    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const result = await axios.post(
        `${baseURL}/admin/add-sponsor`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Sponsor Added",
          text: "Sponsor added successfully!",
        });
        handleClear();
        handleClose();
        refreshSponsorList();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
      console.error("Error adding sponsor:", error);
    }
  };

  return (
    <div>
      <Button
        style={{ backgroundColor: "#CCDC77", color: "black" }}
        onClick={handleShow}
      >
        Add Sponsor
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Sponsor</Modal.Title>
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

export default AddSponsor;
