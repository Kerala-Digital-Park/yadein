import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import AddJobs from "../components/AddJobs";
import EditJobs from "../components/EditJobs";
import Swal from "sweetalert2";

const baseURL = process.env.REACT_APP_API_URL;

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const listJob = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/job-list`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching job list:", error);
    }
  };

  const handleDelete = async (jobId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you cannot recover this job entry!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseURL}/admin/job-delete/${jobId}`);
          listJob();
          Swal.fire("Deleted!", "The job has been removed.", "success");
        } catch (error) {
          console.error("Error deleting job:", error);
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
    listJob();
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-lg-row">
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Job List</h3>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col className="d-flex flex-wrap gap-2">
                <AddJobs refreshJobList={listJob} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Jobs</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job, index) => (
                        <tr key={job._id}>
                          <td>{index + 1}</td>
                          <td>{job.job}</td>
                          <td className="d-flex flex-wrap gap-2">
                            <EditJobs jobData={job} refreshJobList={listJob} />
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(job._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No jobs found.
                        </td>
                      </tr>
                    )}
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

export default Jobs;
