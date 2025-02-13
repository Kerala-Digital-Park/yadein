import React from "react";
import background from '../assets/four-line.jpeg'
import UserNav from "../components/UserNav";

function Home() {
  return (
    <>
    <UserNav/>
    <div className="background">
      {/* <img src={background} alt="" /> */}
      <div className="d-flex justify-content-center align-items-center"
      style={{backgroundColor:"wheat", height:"100px", width:"500px"}}>Home</div>
    </div>
    </>
    
  );
}

export default Home;
