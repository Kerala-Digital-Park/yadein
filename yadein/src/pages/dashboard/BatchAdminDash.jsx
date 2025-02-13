import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

function BatchAdminDash() {
  const adminId = sessionStorage.getItem("userId");

  const [batch, setBatch] = useState("");
  const [stats, setStats] = useState({
    staffCount: 0,
    classCountByBatch: 0,
  });

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/admin/get-batchadmin-batch/${adminId}`
        );
        setBatch(response.data.batch);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };

    if (adminId) {
      fetchBatch();
    }
  }, [adminId]);

  useEffect(() => {
    if (batch) {
      const fetchStats = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/admin/dashboard-stats?batch=${batch}`
          );
          setStats(response.data);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };

      fetchStats();
    }
  }, [batch]);

  return (
    <>
      <Header />
      <div className="d-flex">
        <div className="content w-100 p-4">
          <Container>
            <Row className="g-4 d-flex justify-content-center align-items-center">
              {[
                {
                  title: "Class",
                  count: stats.classCountByBatch,
                  link: `/admin/batch/${batch}`,
                },
                {
                  title: "Staff",
                  count: stats.staffCount,
                  link: "/admin/staff-list",
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

export default BatchAdminDash;
