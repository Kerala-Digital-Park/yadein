import React from "react";
import UserNav from "../components/UserNav";
import { Col, Row } from "react-bootstrap";
import about from "../assets/image.png";

function About() {
  return (
    <>
      <UserNav />
      <div className="container-fluid rounded mb-5">
        <Row className="d-flex justify-content-center align-items-center mt-5">
        <Col sm={12} md={6} lg={6} className="d-flex justify-content-center align-items-center">
           <img src={about} alt="" className="img-fluid" style={{width:"100%", borderBottom:"5px solid #b2d12e"}}/>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center align-items-center mt-5">
          <Col sm={12} md={6} lg={6} className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-center">73 വർഷങ്ങളുടെ മഹത്തായ വിജ്ഞാനയാത്ര</h1>
            <h2 className="text-center">The <span style={{color:"#b2d12e"}}>73-Year</span> Magnificent Journey of Knowledge</h2>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center align-items-center mt-5">
          <Col sm={12} md={6} lg={6}>
            <p style={{fontSize:"23px"}}>1952-ൽ സ്ഥാപിതമായ സെൻ്റ് ജോസഫ്സ് എച്ച്എസ്എസ് പുല്ലൂരാംപാറ, താമരശ്ശേരി രൂപതയുടെ കോർപ്പറേറ്റ് വിദ്യാഭ്യാസ ഏജൻസിയുടെ കീഴിലുള്ള ഏറ്റവും പ്രശസ്തമായ സ്ഥാപനമാണ്. അത്യാധുനിക ഇൻഫ്രാസ്ട്രക്ചറും സൗകര്യങ്ങളും ഉള്ള ഒരു അത്യാധുനിക അക്കാദമിക് പ്രോഗ്രാം ഇത് നൽകുന്നു. 1952ൽ സ്കൂൾ പ്രവർത്തനമാരംഭിക്കുമ്പോൾ ഞങ്ങൾക്ക് പ്രൈമറി വിഭാഗം മാത്രമാണുണ്ടായിരുന്നത്. 1976-ൽ സ്കൂൾ ഹൈസ്കൂളായി ഉയർത്തപ്പെട്ടു. വർഷങ്ങൾ കടന്നുപോകുന്തോറും എസ്ജെഎച്ച്എസ്എസ് കുതിച്ചുചാട്ടത്തിലൂടെ മുന്നേറി. 2010-ൽ ഹയർസെക്കൻഡറി സ്‌കൂളായി ഉയർത്തപ്പെട്ടു. വിജയത്തിലേക്കുള്ള പാതയിൽ മുന്നേറുന്ന ഞങ്ങൾ ഇന്ന് അക്കാദമികത്തിലും പാഠ്യപദ്ധതിയിലും മികച്ചു നിൽക്കുന്നു.</p>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default About;
