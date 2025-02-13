import { React, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;
function AddJobs({ refreshJobList }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialState = {
    job: "",
  };

  const [jobDetails, setJobDetails] = useState(initialState);

  const handleClear = () => {
    setJobDetails(initialState);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const { job } = jobDetails;

    if (!jobDetails.job) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please enter a job name.",
      });
    }
    try {
      const reqBody = { job };

      const result = await axios.post(`${baseURL}/admin/add-job`, reqBody);
      if (result.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Job added successfully.",
        });
        handleClear();
        handleClose();
        refreshJobList();
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
      console.error("Error adding job:", error);
    }
  };

  return (
    <>
      <div>
        <Button style={{backgroundColor:"#CCDC77", color:"black"}} onClick={handleShow}>
          Add Job
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Job</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Job</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Job Name"
                      value={jobDetails.job}
                      onChange={(e) =>
                        setJobDetails({
                          ...jobDetails,
                          job: e.target.value,
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

export default AddJobs;
