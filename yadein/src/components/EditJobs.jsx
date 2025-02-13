import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditJobs({ jobData, refreshJobList }) {
  const [show, setShow] = useState(false);
  const [jobDetails, setJobDetails] = useState({ job: "" });

  useEffect(() => {
    if (jobData) {
      setJobDetails(jobData);
    }
  }, [jobData]);

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setJobDetails(jobData);
    setShow(true);
  };

  const handleClear = () => {
    setJobDetails({ job: "" });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!jobDetails.job) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      const result = await axios.put(
        `${baseURL}/admin/job-edit/${jobData._id}`,
        jobDetails
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Job edited successfully.",
        });
        handleClose();
        refreshJobList();
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
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Job</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Job Name"
                value={jobDetails.job}
                onChange={(e) =>
                  setJobDetails({ ...jobDetails, job: e.target.value })
                }
              />
            </Form.Group>
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

export default EditJobs;
