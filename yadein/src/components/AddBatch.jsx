import { React, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;
function AddBatch({ refreshBatchList }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialState = {
    year: "",
  };

  const [batchDetails, setBatchDetails] = useState(initialState);

  const handleClear = () => {
    setBatchDetails(initialState);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const { year } = batchDetails;

    if (!year || !year.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please enter a batch!",
      });
      return;
    }
  
    try {
      const reqBody = { year: year.trim() };

      const result = await axios.post(`${baseURL}/admin/add-batch`, reqBody);

      if (result.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Batch added successfully.",
        });
        handleClear();
        handleClose();
        refreshBatchList();
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
      console.error("Error adding batch:", error);
    }
  };

  return (
    <>
      <div>
        <Button style={{backgroundColor:"#CCDC77", color:"black"}} onClick={handleShow} className="mb-3">
          Add Batch
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Batch</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
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
    </>
  );
}

export default AddBatch;
