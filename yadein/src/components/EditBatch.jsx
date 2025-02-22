import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function EditBatch({ batchData, refreshBatchList }) {
  const [show, setShow] = useState(false);

  const initialState = {
    year: "",
  };

  const [batchDetails, setBatchDetails] = useState(initialState);

  useEffect(() => {
    if (batchData) {
      setBatchDetails(batchData);
    }
  }, [batchData]);

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setBatchDetails(batchData);
    setShow(true);
  };

  const handleClear = () => {
    setBatchDetails(initialState);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!batchDetails.year) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      const result = await axios.put(
        `${baseURL}/admin/batch-edit/${batchData._id}`,
        batchDetails
      );

      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Batch edited successfully.",
        });
        handleClose();
        refreshBatchList();
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
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="col-lg-6">
              <Form.Group className="mb-3">
                <Form.Label>Batch</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Year"
                  value={batchDetails.year}
                  onChange={(e) =>
                    setBatchDetails({
                      ...batchDetails,
                      year: e.target.value,
                    })
                  }
                />
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

export default EditBatch;
