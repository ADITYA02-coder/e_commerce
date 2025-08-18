import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// selected items array
import { selectedItems } from "./Product";
import { data } from "react-router";
import { products } from "./Product";
import { Card } from "react-bootstrap";
import { Link } from "react-router";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { BackToTop } from "./BackToTop";

const Cart = () => {
  const [data, setData] = useState(null);


  return (
    <div>
      <h4>Shopping Cart</h4>
      {data
        ? data.map((items) =>
            products
              .filter((d) => d.id === items)
              .map((data) => (
                <Container>
                  <Row>
                    <Card key={data.id} className="mb-3">
                      <Col xs={12} md={6} lg={4} className="mb-4">
                        <Card.Img
                          variant="top"
                          src={data.image}
                          className="image"
                        />
                      </Col>
                      <Col>
                        <Card.Body>
                          <Card.Title>{data.name}</Card.Title>
                          <Card.Text>{data.description}</Card.Text>
                          <Card.Text>{data.brand}</Card.Text>
                          <Card.Text>{data.ram}</Card.Text>
                          <Card.Text>{data.rom}</Card.Text>
                          <Card.Text>{data.camera}</Card.Text>
                          <Card.Text>{data.screen_size}</Card.Text>
                        </Card.Body>
                      </Col>
                    </Card>
                  </Row>
                </Container>
              ))
          )
        : "No items in the cart"}
    </div>
  );
};

export default Cart;
