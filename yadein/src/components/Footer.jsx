import React, { useState, useEffect } from "react";
import logo from "../assets/logo-sc.png";

function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  const isAdmin = Boolean(
    sessionStorage.getItem("adminType") || sessionStorage.getItem("adminToken")
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
      setShowScroll(isScrollable && window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>
        {`
          #scroll {
            position: fixed;
            bottom: 20px;
            right: 30px;
            z-index: 99;
            border: none;
            outline: none;
            background-color: #4e4e4e;
            color: white;
            cursor: pointer;
            border-radius: 100%;
            width: 32px;
            height: 32px;
            padding: 5px 9px;
            opacity: ${showScroll ? 1 : 0};
            visibility: ${showScroll ? "visible" : "hidden"};
            transition: opacity 0.4s ease, visibility 0.4s ease;
          }
        `}
      </style>
      <footer
        className="p-3 justify-content-center text-light"
        style={{
          backgroundColor: isAdmin ? "transparent" : "#355E3B",
          display: "block",
          overflow: "hidden",
          lineHeight:"30px"
        }}
      >
        {!isAdmin && (
          <>
            <hr />
            <div style={{ textAlign: "center" }}>
              <img
                src={logo}
                alt="School Logo"
                className="img-responsive"
                style={{ marginBottom: "5px" }}
              />
              <p>
                Pullurampara P.O., Kozhikode, 673603 <br />
                Phone: <a href="tel:04952276242" style={{ textDecoration: "none", color: "#b2d12e" }}>04952276242</a> <br />
                Email:&nbsp;
                <a
                  href="mailto:sjhspullurampara@gmail.com"
                  style={{ textDecoration: "none", color: "#b2d12e" }}
                >
                  sjhspullurampara@gmail.com
                </a>
              </p>
            </div>
            <hr />
          </>
        )}
        <p
          className="text-center mb-0 pt-1 pb-0"
          style={{
            color: isAdmin ? "black" : "white",
          }}
        >
          &copy; 2025 Yadein. All Rights Reserved.
        </p>
        <button
          onClick={scrollToTop}
          id="scroll"
          title="Scroll to Top"
          aria-label="Scroll to Top"
          tabIndex="0"
        >
          <i className="fa fa-arrow-up" aria-hidden="true"></i>
        </button>
      </footer>
    </>
  );
}

export default Footer;