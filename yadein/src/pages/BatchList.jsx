import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import AddBatch from "../components/AddBatch";
import axios from "axios";
import EditBatch from "../components/EditBatch";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function BatchList() {
  const adminType = sessionStorage.getItem("adminType");
  const [batch, setBatch] = useState([]);
  const navigate = useNavigate();

  const listBatch = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/batch-list`);
      setBatch(response.data);
    } catch (error) {
      console.error("Error fetching batch list:", error);
    }
  };

  const handleDelete = async (batchId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this batch!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/batch-delete/${batchId}`);
          listBatch();
          Swal.fire("Deleted!", "The batch has been removed.", "success");
        } catch (error) {
          console.error("Error deleting batch:", error);
          Swal.fire(
            "Error!",
            "Something went wrong. Try again later.",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    listBatch();
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row">
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Batch List</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                {(adminType === "superadmin" || adminType === "batchadmin") && (
                  <AddBatch refreshBatchList={listBatch} />
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Year</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.map((i, index) => (
                      <tr key={i._id}>
                        <td
                          onClick={() => navigate(`/admin/batch/${i._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          onClick={() => navigate(`/admin/batch/${i._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {i.year}
                        </td>
                        <td className="d-flex">
                          <EditBatch
                            batchData={i}
                            refreshBatchList={listBatch}
                          />
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(i._id)}
                            className="ms-2"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default BatchList;
