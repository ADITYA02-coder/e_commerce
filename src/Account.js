import React from "react";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router";
export const Account = () => {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Box._CB485927553_.png"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Yours Orders</Card.Title>
                    <Card.Text>Track,Return,or Buy things again</Card.Text>
                    <Link to="/orderDetails"><Button variant="primary">Click</Button></Link>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/sign-in-lock._CB485931504_.png"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Login & Security</Card.Title>
                    <Card.Text>Edit login,name,and mobile number</Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/rc_prime._CB485926807_.png"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Prime</Card.Title>
                    <Card.Text>View benefits and payment settings</Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/address-map-pin._CB485934183_.png"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Your Addresses</Card.Title>
                    <Card.Text>Edit addresses for orders and gifts</Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/AmazonBusiness/YAPATF/amazon_business_yap_atf._CB588250268_.jpg"
                  height="100px"/>
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Your Business Account</Card.Title>
                    <Card.Text>
                      sign up for free to save up to 28% with GST invoice and
                      bulk discounts and purchase on credit.
                    </Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/Payments._CB485926359_.png"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Payment Options</Card.Title>
                    <Card.Text>Edit and add payment methods</Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/ya/images/amazon_pay._CB485946857_.png"
                  />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Amazon Pay Balance</Card.Title>
                    <Card.Text>Add money to your balance</Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <Card>
              <Row>
                <Col md={4}>
                  <Card.Img
                    variant="left"
                    src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/self-service/contact_us._CB623781998_.png"
                  height="100px"/>
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>Contact Us</Card.Title>
                    <Card.Text>
                      Contact our customer service via phone or chat
                    </Card.Text>
                    <Button variant="primary">Click</Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};
