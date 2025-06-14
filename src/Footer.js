import React from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { CCircle } from "react-bootstrap-icons";
export const Footer = () => {
  return (
    <div className="footer">
      <Container fluid>
        <Row>
          <Col>
            <h5>Get to Know Us</h5>
          </Col>
          <Col>
            <h5>Connect with Us</h5>
          </Col>
          <Col>
            <h5>Make Money with Us</h5>
          </Col>
          <Col><h5>Let Us Help You</h5></Col>
        </Row>
        <Row>
          <Col>
            <ul className="footerlist">
              <li>About Amazon</li>
              <li>Careers</li>
              <li>Press Releases</li>
              <li>Amazon Science</li>
            </ul>
          </Col>
          <Col>
            <ul className="footerlist">
              <li>Twitter</li>
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </Col>
          <Col>
            <ul className="footerlist">
              <li>Sell on Amazon</li>
              <li>Sell under Amazon Accelerator</li>
              <li>Protect and Build Your Brand</li>
              <li>Amazon Global Selling</li>
              <li>Supply to Amazon</li>
              <li>Become an Affiliate</li>
              <li>Fulfilment by Amazon</li>
              <li>Advertise Your Products</li>
              <li>Amazon Pay on Merchants</li>
            </ul>
          </Col>
          <Col>
            <ul className="footerlist">
              <li>Your Account</li>
              <li>Returns Centre</li>
              <li>Recalls and Product Safety Alerts</li>
              <li>100% Purchase Protection</li>
              <li>Amazon App Download</li>
              <li>Help</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col className="footercopyright">
            <p>
              Copyright 2025 <CCircle />
            </p>
            <p>aniya company</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
