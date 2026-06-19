import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { Cart, Plus } from "react-bootstrap-icons";
import { API_URL, getAssetUrl } from "../config/api";
import { fetchProductById } from "../services/productCache";
import "../styles/style.css";

const MobileData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [mobile, setMobile] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  useEffect(() => {
    let active = true;
    localStorage.setItem("selectedProductId", id);
    fetchProductById(id)
      .then((data) => {
        if (active) setMobile(data);
      })
      .catch(() => {
        if (active) setMobile(null);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const requireLogin = () => {
    if (currentUser) return true;
    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    return false;
  };

  const handleAddToCart = (item) => {
    fetch(`${API_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then(() => setToast({ show: true, message: "Item added to cart", variant: "success" }))
      .catch(() => setToast({ show: true, message: "Failed to add item", variant: "danger" }));
  };

  const buyNow = (product) => {
    const updatedItems = [...selectedItems, product];
    setSelectedItems(updatedItems);
    handleAddToCart({
      userId: currentUser.id,
      items: updatedItems.map((item) => ({
        productId: item.id || item._id,
        price: item.price,
        quantity: 1,
      })),
      active: true,
    });
    navigate("/address");
  };

  if (!mobile) {
    return <p className="product-detail-loading">Loading...</p>;
  }

  const productId = mobile.id || mobile._id;

  return (
    <Container className="product-detail">
      <Row className="g-3">
        <Col md={6}>
          <Card className="shop product-detail-card">
            <Card.Img variant="top" src={getAssetUrl(mobile.primaryImage || mobile.image)} className="item product-detail-image" />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shop product-detail-card product-detail-info">
            <Card.Body>
              <Card.Title>{mobile.name}</Card.Title>
              <Card.Text>{mobile.brand}</Card.Text>
              <Card.Text>RAM: {mobile.ram}</Card.Text>
              <Card.Text>ROM: {mobile.rom}</Card.Text>
              <Card.Text>Screen Size: {mobile.screenSize}</Card.Text>
              <Card.Text>Camera: {mobile.camera}</Card.Text>
              <Card.Text>Battery: {mobile.battery}</Card.Text>
              <Card.Text>Processor: {mobile.processor}</Card.Text>
              <Card.Text>Color: {mobile.color}</Card.Text>
              <Card.Text>Price: Rs. {mobile.price}</Card.Text>
              <div className="buttons product-detail-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!requireLogin()) return;
                    handleAddToCart({
                      userId: currentUser.id,
                      items: [{ productId, price: mobile.price, quantity: 1 }],
                      active: true,
                    });
                  }}
                >
                  <Plus /> Add to Cart
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    if (!requireLogin()) return;
                    buyNow(mobile);
                  }}
                >
                  <Cart /> Buy Now
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={2000} autohide>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default MobileData;
