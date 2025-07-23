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
import {Button} from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { BackToTop } from "./BackToTop";

const Cart = () => {
  const [cart, setCart] = useState(selectedItems);
  useEffect(() => {
    var lscartData = localStorage.getItem("cartItems");
    var parseData = JSON.parse(lscartData);
    setCart(parseData);
  }, []);
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h4>Shopping Cart</h4>
            {cart.map((items) =>
              products
                .filter((d) => d.id === items)
                .map((data) => (
                  <Card className="shop" style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      src={data.image_url}
                      className="item"
                    />
                    <Card.Body>
                      <Card.Title>
                        <input type="checkbox" onClick={() => {}} />
                        <Link to="/category/mobiles/mobiledata>">
                          {data.name}
                        </Link>
                      </Card.Title>
                      <Card.Text>{data.brand}</Card.Text>
                      <Card.Text>{data.ram}</Card.Text>
                      <Card.Text>{data.rom}</Card.Text>
                      <Card.Text>{data.camera}</Card.Text>
                      <Card.Text>{data.screen_size}</Card.Text>
                      <Card.Text>
                        Price:
                        {data.price >= parseFloat(100.0)
                          ? (data.price * 20) / 100
                          : data.price}
                      </Card.Text>
                      <Button
                        variant="primary"
                      >
                        <Plus/> Add Item{" "}
                      </Button>
                      <Button variant="primary">
                         Buy Now
                      </Button>
                    </Card.Body>
                  </Card>
                ))
            )}
            
          </Col>
          <Col>
            
          </Col>
        </Row>
        <Row>
          <Col>
            <BackToTop />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
