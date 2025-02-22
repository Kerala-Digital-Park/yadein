import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import EditSponsor from '../components/EditSponsor'
import axios from "axios";
import Swal from 'sweetalert2';
import AddSponsor from '../components/AddSponsor';

const baseURL = process.env.REACT_APP_API_URL;

function Sponsors() {
    const [sponsors, setSponsors] = useState([]);
    const listSponsors = async () => {
        try {
          const response = await axios.get(`${baseURL}/admin/sponsor-list`);
          setSponsors(response.data);
        } catch (error) {
          console.error("Error fetching sponsor:", error);
        }
      };

      const handleDelete = async (sponsorId) => {
        Swal.fire({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this sponsor's data!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.delete(`${baseURL}/admin/sponsor-delete/${sponsorId}`);
              listSponsors();
              Swal.fire("Deleted!", "The sponsor has been removed.", "success");
            } catch (error) {
              console.error("Error deleting sponsor:", error);
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
        listSponsors();
      }, []);
    
  return (
    <>
    <Header/>
    <div className="d-flex flex-column flex-lg-row" style={{minHeight:"800px"}}>
        <div className="content w-100 p-3">
          <Container>
            <Row className="mb-3">
              <Col>
                <h3>Sponsor List</h3>
              </Col>
            </Row>        
            <Row className="mb-3">
              <Col>
                <AddSponsor refreshSponsorList={listSponsors} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsors.map((sponsor, index) => (
                      <tr key={sponsor._id}>
                        <td className="align-middle">{index + 1}</td>
                        <td className="align-middle">{sponsor.name}</td>
                        <td className="align-middle">
                          {sponsor.profileImage && (
                            <img
                              src={`${baseURL}/uploads/${sponsor.profileImage}`}
                              alt="Profile"
                              width="80"
                              height="80"
                              className="img-fluid rounded"
                            />
                          )}
                        </td>

                        <td className="align-middle">
                          <div className="d-flex align-items-center gap-2">
                            <EditSponsor
                              sponsorData={sponsor}
                              refreshSponsorList={listSponsors}
                            />
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(sponsor._id)}
                            >
                              Delete
                            </Button>
                          </div>
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
  )
}

export default Sponsors
