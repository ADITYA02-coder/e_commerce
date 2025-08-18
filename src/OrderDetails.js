import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

const OrderDetails = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <p>
              <a href="Account.js">Your Account</a> Your Orders
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Your Orders</h3>
          </Col>
          <Col>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Nav variant="">
              <Nav.Item>
                <Nav.Link eventKey="1" disabled>
                  Orders
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2" title="Item">
                  Buy Again
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3">Not Yet Shipped</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="4" href="#/home">
                  Cancelled Orders
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex align-items-center">
            <p>
              0 Orders placed in </p>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  past 3 days
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">past 7 days</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">past 1 month</Dropdown.Item>
                  <Dropdown.Item href="#">past 3 months</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderDetails;
