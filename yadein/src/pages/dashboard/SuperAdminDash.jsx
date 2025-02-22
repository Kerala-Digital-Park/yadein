import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

function SuperAdminDash() {
  const [stats, setStats] = useState({
    adminCount: 0,
    staffCount: 0,
    studentCount: 0,
    batchCount: 0,
    classCount: 0,
    updateCount: 0,
    sponsorCount: 0,
    jobCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/dashboard-stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Header />
      <div className="d-flex" style={{minHeight:"800px"}}>
        <div className="content w-100 p-4">
          <Container>
            <Row className="g-4">
              {[
                {
                  title: "Admin",
                  count: stats.adminCount,
                  link: "/admin/admin-list",
                },
                {
                  title: "Staff",
                  count: stats.staffCount,
                  link: "/admin/staff-list",
                },
                {
                  title: "Student",
                  count: stats.studentCount,
                  link: "/admin/student-list",
                },
                {
                  title: "Batch",
                  count: stats.batchCount,
                  link: "/admin/batch-list",
                },
                {
                  title: "Class",
                  count: stats.classCount,
                  link: "/admin/class-list",
                },
                {
                  title: "Updates",
                  count: stats.updateCount,
                  link: "/admin/updates",
                },
                {
                  title: "Sponsor",
                  count: stats.sponsorCount,
                  link: "/admin/sponsors",
                },
                {
                  title: "Job",
                  count: stats.jobCount,
                  link: "/admin/jobs",
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

export default SuperAdminDash;
