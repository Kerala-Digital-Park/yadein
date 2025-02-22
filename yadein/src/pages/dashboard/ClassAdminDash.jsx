import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

function ClassAdminDash() {
  const adminId = sessionStorage.getItem("userId");

  const [batch, setBatch] = useState("");
  const [cls, setCls] = useState("")
  const [stats, setStats] = useState({
    studentCountByClass: 0,
  });

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-classadmin-batch/${adminId}`
        );
        setBatch(response.data.batch);
        setCls(response.data.classForm);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };

    if (adminId) {
      fetchClass();
    }
  }, [adminId]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!batch || !cls) return; // Ensure batch and cls are available before making the request
      try {
        const response = await axios.get(`${baseURL}/admin/dashboard-stats?batch=${batch}&&cls=${cls}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
  
    fetchStats();
  }, [batch, cls]); // Runs when batch or cls changes
  

  return (
    <>
      <Header />
      <div className="d-flex" style={{minHeight:"800px"}}>
        <div className="content w-100 p-4">
          <Container>
            <Row className="g-4 d-flex justify-content-center align-items-center">
              {[
                {
                  title: "Student",
                  count: stats.studentCountByClass,
                  link: `/admin/batch/${batch}/${cls}`,
                },
              ].map((item, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                  <Link to={item.link} style={{ textDecoration: "none" }}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
                          Total {item.title} <span>{item.count}</span>
                        </Card.Subtitle>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default ClassAdminDash;
