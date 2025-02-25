import React, { useEffect, useState, useRef } from "react";
import UserNav from "../components/UserNav";
import { Button, Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Batch.css";
import Img from "../assets/cover.jpeg";
import staff from "../assets/school.jpeg";
import about from "../assets/image.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import text from "../assets/home-text.png";
import goto from "../assets/goto.png";
import profile from "../assets/profile.jpg";

const baseURL = process.env.REACT_APP_API_URL;

function Home() {
  const [batches, setBatches] = useState([]);
  const [batchYear, setBatchYear] = useState("");
  const batchCarouselRef = useRef(null);
  const sponsorCarouselRef = useRef(null);
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState([]);
  const [animate, setAnimate] = useState("fadeIn");

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

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/sponsor-list`);
        setSponsors(response.data || []);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };
    fetchSponsors();
  }, []);

  const handleBatchPrev = () => {
    if (batchCarouselRef.current) {
      batchCarouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleBatchNext = () => {
    if (batchCarouselRef.current) {
      batchCarouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleSponsorPrev = () => {
    if (sponsorCarouselRef.current) {
      sponsorCarouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleSponsorNext = () => {
    if (sponsorCarouselRef.current) {
      sponsorCarouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleBatchNext();
      handleSponsorNext();
    }, 2000);

    return () => clearInterval(interval);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate((prev) => (prev === "fadeIn" ? "fadeOut" : "fadeIn"));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <style>
        {`
      .carousel-inner {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-left: 10px;
}

.carousel-inner::-webkit-scrollbar {
    display: none;
}

.carousel-control-batch-prev,
.carousel-control-batch-next {
    position: absolute;
    top: 100px !important;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    opacity: 1;
}

.carousel-control-batch-prev {
    left: 60px;
}

.carousel-control-batch-next {
    right: 60px;
}

.carousel-control-prev,
.carousel-control-next {
    position: absolute;
    top: 200px;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    opacity: 1;
    background-color:#efefef !important;
    border: 2px solid black !important;
}

.carousel-control-prev {
    left: 60px;
}

.carousel-control-next {
    right: 60px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    filter: invert(1);
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50px);
  }
}

@keyframes fadeOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(50px);
  }
}

.fadeInLeft {
  animation: fadeInLeft 1s ease-in-out forwards;
}

.fadeInRight {
  animation: fadeInRight 1s ease-in-out forwards;
}

.fadeOutLeft {
  animation: fadeOutLeft 1s ease-in-out forwards;
}

.fadeOutRight {
  animation: fadeOutRight 1s ease-in-out forwards;
}

.img-div{
    height: 500px;
    }

.about-link{
height: 400px;
}

.heading{
  position: absolute;
  color: black;
  background: rgb(178, 209, 46);
  padding: 10px;
  z-index: 10;
  left: 30%;
  bottom: 80px;
  border: 1px solid black;
  box-shadow: 2px 2px 2px #000;
}

.subheading{
  position: absolute;
  color: white;
  background: black;
  padding: 8px;
  z-index: 10;
  left: 30%;
  bottom: 44px;
  width: auto;
  }

@media (max-width: 768px) {
    .input{
      width: 85%
    }

    .carousel-inner {
        display: flex;
        overflow-x: auto;
        scroll-behavior: smooth;
        padding-left: 0px !important;
        justify-content: center;
        gap:15px;
    }

    .batch-circle {
        width: 100px !important;
        height: 100px !important;
        min-width: 100px !important;
        font-size: 25px !important;
        margin-left:50px
    }

    .carousel-control-batch-prev,
    .carousel-control-batch-next {
        top: 75px !important;
    }

    .carousel-control-batch-next {
        right: 0;
    }

    .carousel-control-batch-prev {
        left: 0;
    }

    

    .carousel-control-next {
        right: 0;
    }

    .carousel-control-prev {
        left: 0;
    }

    
    .position-relative {
        padding: 30px 50px !important;
    }

    .batch-circle:hover {
        color: black !important;
        border: 5px solid #00AB66;
        font-weight: 600;
    }
    
    .img-div{
    height: 255px;
    }

    .about-link{
      height: 200px;
      }

       .heading {
    font-size: 1rem; 
    bottom: 40px;   
  }

  .subheading {
    font-size: 1rem; 
    bottom: 10px;      
  }
}
  @media(max-width:400px){
  
         .heading {
    font-size: 1rem; 
    bottom: 40px;   
  }

  .subheading {
    font-size: 0.8rem; 
    bottom: 10px;      
  }}
      `}
      </style>
      <UserNav />
      <div>
        <div className="container-fluid rounded" style={{ width: "80%" }}>
          <Row className="d-flex align-items-center justify-content-center mt-2 mx-auto w-100">
            <Col sm={11} md={9} lg={9} className="img-div">
              <img
                src={Img}
                alt=""
                className="img-fluid"
                style={{
                  width: "100%",
                  height: "100%",
                  boxShadow: "0 15px 10px #777",
                }}
              />
            </Col>
          </Row>

          <Row className="d-flex align-items-center justify-content-center mt-2 mx-auto w-100">
            <Col
              xs={12}
              sm={11}
              md={9}
              lg={9}
              className="d-flex justify-content-center"
            >
              <ul
                className="d-flex flex-column justify-content-center mx-auto"
                style={{
                  listStyleType: "none",
                  width: "80%",
                  maxWidth: "500px",
                  marginTop: "30px",
                  background: "transparent",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                <li className="d-flex justify-content-between align-items-center">
                  <img
                    src={text}
                    alt=""
                    className={`img-fluid ${
                      animate === "fadeIn" ? "fadeInLeft" : "fadeOutLeft"
                    }`}
                    style={{ maxWidth: "45%", height: "auto" }}
                  />
                  <img
                    src={goto}
                    alt=""
                    className={`img-fluid ${
                      animate === "fadeIn" ? "fadeInRight" : "fadeOutRight"
                    }`}
                    style={{ maxWidth: "45%", height: "auto" }}
                  />
                </li>
              </ul>
            </Col>
          </Row>

          <Row className="mt-2 w-100 mx-auto">
            <div
              className="position-relative"
              style={{ padding: "30px 160px" }}
            >
              <div
                ref={batchCarouselRef}
                className="carousel-inner d-flex flex-row gap-5 justify-content-start overflow-auto"
                style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
              >
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
                  <p className="text-center">No batches available</p>
                )}
              </div>
              {batches.length > 1 && (
                <>
                  <button
                    className="carousel-control-batch-prev"
                    type="button"
                    onClick={handleBatchPrev}
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>

                  <button
                    className="carousel-control-batch-next"
                    type="button"
                    onClick={handleBatchNext}
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          </Row>

          {/* Input for Batch Year */}
          <Row className="input d-flex justify-content-center mt-4 mx-auto">
            <Col
              sm={6}
              md={4}
              lg={3}
              className="d-flex justify-content-center gap-3 mb-5"
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

          <Row
            className="d-flex align-items-center justify-content-between mt-4 mx-auto"
            style={{ width: "100%" }}
          >
            <Col
              lg={6}
              sm={12}
              className="teacher d-flex justify-content-center mb-5"
            >
              <Link
                to={"/staff"}
                className="about-link"
                style={{
                  backgroundImage: `url(${staff})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "90%",
                  position: "relative",
                  border: "1px solid #d5d5d5",
                }}
              >
                <h3 className="heading">Thank you Teachers</h3>
                <h6 className="subheading">
                  View all Teachers<i class="fa-solid fa-angles-right ms-3"></i>
                </h6>
              </Link>
            </Col>

            <Col
              lg={6}
              sm={12}
              className="about d-flex justify-content-center mb-5"
            >
              <Link
                to={"/about"}
                className="about-link"
                style={{
                  backgroundImage: `url(${about})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "90%",
                  position: "relative",
                  border: "1px solid #d5d5d5",
                }}
              >
                <h3 className="heading">73 years of School</h3>
                <h6 className="subheading">
                  <i class="fa-solid fa-angles-left me-3"></i>Read full History
                </h6>
              </Link>
            </Col>
          </Row>

          {sponsors.length > 0 ? (
            <div>
              <Row className="d-flex justify-content-center align-items-center">
                <Col
                  sm={12}
                  md={6}
                  lg={6}
                  className="d-flex justify-content-center"
                >
                  <h1>Sponsors</h1>
                </Col>
              </Row>
              <Row className="sponsor mt-3">
                <div
                  className="position-relative"
                  style={{ padding: "30px 160px" }}
                >
                  <div
                    ref={sponsorCarouselRef}
                    className="carousel-inner d-flex flex-row gap-5 justify-content-start overflow-auto"
                    style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
                  >
                    {sponsors.length > 0 ? (
                      sponsors.map((sponsor, index) => (
                        <div key={index}>
                          <Card
                            style={{ width: "15rem", borderRadius: "40px" }}
                          >
                            <Card.Img
                              variant="top"
                              src={
                                sponsor.profileImage
                                  ? `${baseURL}/uploads/${sponsor.profileImage}`
                                  : profile
                              }
                              height={"200px"}
                              className="mt-5"
                            />
                            <Card.Body>
                              <Card.Title className="text-center">
                                {sponsor.name}
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">Loading sponsors...</p>
                    )}
                  </div>

                  <button
                    className="carousel-control-prev"
                    type="button"
                    onClick={handleSponsorPrev}
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    onClick={handleSponsorNext}
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </Row>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
