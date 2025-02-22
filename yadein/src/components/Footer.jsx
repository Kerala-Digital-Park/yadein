import React from "react";
import logo from "../assets/logo-sc.png";

function Footer() {
  const isAdmin =
    sessionStorage.getItem("adminType") || sessionStorage.getItem("adminToken");

  return (
    <footer
      className="p-3 justify-content-center text-light"
      style={{
        backgroundColor: isAdmin ? "transparent" : "#355E3B",
        display: "block",
        overflow: "hidden",
      }}
    >
      {!isAdmin && (
        <>
          <hr />
          <p style={{ textAlign: "center", textDecoration: "none" }}>
            <img
              src={logo}
              alt=""
              class="img-responsive"
              style={{ marginBottom: "5px" }}
            />
            <br />
            Pullurampara P.O.,Kozhikode, 673603
            <br />
            Phone : 04952276242
            <br />
            Email:&nbsp;
            <a
              href="mailto:sjhspullurampara@gmail.com"
              style={{ textDecoration: "none", color: "#b2d12e" }}
            >
              sjhspullurampara@gmail.com
            </a>
          </p>
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
    </footer>
  );
}

export default Footer;
