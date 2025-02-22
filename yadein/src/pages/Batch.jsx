import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNav from "../components/UserNav";
import "../styles/Batch.css";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import img from "../assets/image.png";

const baseURL = process.env.REACT_APP_API_URL;

function Batch() {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
  const [batchYear, setBatchYear] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/batch-list`);
        setBatches(response.data || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, []);

  const fetchBatchDetails = async () => {
    if (!batchYear) {
      toast.warn("Please enter a batch year!");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/admin/get-batchId/${batchYear}`
      );

      if (response.data[0] && response.data[0]._id) {
        navigate(`/batch/${response.data[0]._id}`);
      } else {
        toast.error("Batch not found!");
      }
    } catch (error) {
      console.error("Error fetching batch details:", error);
      toast.error("Batch not found!");
    }
    setBatchYear("");
  };

  return (
    <>
      <style>
        {`
      @media (max-width: 768px) {
        .input{
        width: 75%
        }
      }
      `}
      </style>
      <ToastContainer position="top-center" autoClose={3000} />
      <UserNav />
      <div className="mb-5 mx-auto" style={{width:"80%"}}>
      <Row className="d-flex justify-content-center align-items-center mt-3">
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex justify-content-center align-items-center"
        >
          <img
            src={img}
            alt=""
            className="img-fluid"
            style={{ width: "100%", borderBottom: "5px solid #b2d12e" }}
          />
        </Col>
      </Row>

      <Row className="input d-flex justify-content-center mt-4 mx-auto">
        <Col
          sm={10}
          md={4}
          lg={3}
          className="d-flex justify-content-center gap-3 mb-3"
        >
          <input
            type="text"
            className="form-control"
            placeholder="Enter your batch"
            value={batchYear}
            style={{ backgroundColor: "#BED174", color: "black" }}
            onChange={(e) => setBatchYear(e.target.value)}
          />
          <Button
            className="batch-button"
            onClick={fetchBatchDetails}
            style={{ backgroundColor: "#b2d12e", border: "#b2d12e" }}
          >
            Go
          </Button>
        </Col>
      </Row>
      <div className="container-fluid rounded">
        <Row className="d-flex justify-content-center align-items-center gap-4 mt-4">
          {batches.length > 0 ? (
            batches.map((batch, index) => (
              <div
                key={index}
                className="batch-circle"
                onClick={() => navigate(`/batch/${batch._id}`)}
              >
                {batch.year}
              </div>
            ))
          ) : (
            <p className="text-center">Loading batches...</p>
          )}
        </Row>
      </div>
      </div>
      
    </>
  );
}

export default Batch;
