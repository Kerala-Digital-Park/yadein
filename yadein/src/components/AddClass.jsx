import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function AddClass({ refreshClassList, year }) {
  console.log(year);

  const [show, setShow] = useState(false);
  const [batches, setBatches] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initialState = {
    year: "",
    classForm: "",
  };

  const [classDetails, setClassDetails] = useState(initialState);

  const handleClear = () => {
    setClassDetails(initialState);
  };

  const fetchBatchDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/get-batch/${year}`);
      setBatches(response.data.year);
    } catch (error) {
      console.error("Error fetching batch details:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const { classForm } = classDetails;
    const year = batches;
    if ( !classForm) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in the form completely.",
      });
      return;
    }
    try {
      const reqBody = { year, classForm };

      const result = await axios.post(`${baseURL}/admin/add-class`, reqBody);
      if (result.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Class added successfully.",
        });
        handleClear();
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
      console.error("Error adding class:", error);
    }
  };

  // useEffect(() => {
  //   const fetchBatches = async () => {
  //     try {
  //       const response = await axios.get(`${baseURL}/admin/batch-list`);
  //       setBatches(response.data);
  //     } catch (error) {
  //       console.error("Error fetching batches:", error);
  //     }
  //   };
  //   fetchBatches();
  // }, []);

  useEffect(() => {
    fetchBatchDetails();
  }, [year]);
  return (
    <div>
      <Button
        style={{ backgroundColor: "#CCDC77", color: "black" }}
        onClick={handleShow}
      >
        Add Class
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-lg-6">
                <Form.Group className="mb-3">
                  <Form.Label>Batch</Form.Label>
                  <Form.Control
                    type="text"
                    value={batches}
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

export default AddClass;
