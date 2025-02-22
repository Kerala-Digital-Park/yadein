import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/Batch.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_URL;

function Batch({ batches }) {
  const [batchYear, setBatchYear] = useState("");
  const navigate = useNavigate();

  if (!batches || batches.length === 0) {
    return <p>No batch data available</p>;
  }

  const fetchBatchDetails = async () => {
    if (!batchYear) {
      alert("Please enter a batch year!");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/admin/get-batchId/${batchYear}`
      );

      if (response.data[0] && response.data[0]._id) {
        navigate(`/batch/${response.data[0]._id}`);
      } else {
        alert("Batch not found!!!!");
      }
    } catch (error) {
      console.error("Error fetching batch details:", error);
      alert("Batch not found!");
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center">
        <Row className="d-flex justify-content-center mt-4">
          <Col
            sm={6}
            md={4}
            lg={3}
            className="d-flex justify-content-center gap-3"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Enter your batch"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
            />
            <Button onClick={fetchBatchDetails}>Go</Button>
          </Col>
        </Row>

        <Row>
          {batches.map((batch, index) => (
            <Col key={index}>
              <div className="batch-circle">{batch.year}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Batch;
