import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { Cart, Plus } from "react-bootstrap-icons";
import { API_URL, getAssetUrl } from "../config/api";
import { fetchProductById } from "../services/productCache";
import authHeader from "../services/auth-header";
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

  const handleAddToCart = async (item) => {
    try {
      const response = await fetch(`${API_URL}/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Unable to add this product to your cart.");
      }

      setToast({ show: true, message: "Item added to cart", variant: "success" });
      return true;
    } catch {
      setToast({ show: true, message: "Failed to add item", variant: "danger" });
      return false;
    }
  };

  const buyNow = async (product) => {
    const updatedItems = [...selectedItems, product];
    setSelectedItems(updatedItems);
    const wasAdded = await handleAddToCart({
      userId: currentUser.id,
      items: [{
        productId: product.id || product._id,
        price: product.price,
        quantity: 1,
      }],
      active: true,
    });
    if (wasAdded) navigate("/address");
  };

  if (!mobile) {
    return <p className="product-detail-loading">Loading...</p>;
  }

  const productId = mobile.id || mobile._id;
  const fallbackSpecs = {
    ram: mobile.ram ? `${mobile.ram} GB` : "",
    rom: mobile.rom ? `${mobile.rom} GB` : "",
    screenSize: mobile.screenSize,
    camera: mobile.camera,
    battery: mobile.battery,
    processor: mobile.processor,
    color: mobile.color
  };
  const specs = {
    ...Object.fromEntries(Object.entries(fallbackSpecs).filter(([, value]) => value)),
    ...(mobile.attributes || {})
  };
  const specRows = Object.entries(specs).filter(([, value]) => String(value || "").trim());
  const formatSpecLabel = (value) =>
    String(value)
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) => char.toUpperCase());

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
              <Card.Text>Category: {mobile.category}</Card.Text>
              {mobile.description ? <Card.Text>{mobile.description}</Card.Text> : null}
              {Array.isArray(mobile.bulletPoints) && mobile.bulletPoints.length > 0 ? (
                <ul className="product-detail-bullets">
                  {mobile.bulletPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {specRows.map(([key, value]) => (
                <Card.Text key={key}>{formatSpecLabel(key)}: {value}</Card.Text>
              ))}
              <Card.Text>Price: Rs. {mobile.price}</Card.Text>
              <Card.Text>Condition: {mobile.condition || "New"}</Card.Text>
              <Card.Text>Warranty: {mobile.warranty || "1 year"}</Card.Text>
              <Card.Text>Return Policy: {mobile.returnPolicy || 30} days</Card.Text>
              <Card.Text>Shipping: {mobile.shippingDays || 3} days</Card.Text>
              {mobile.countryOfOrigin ? <Card.Text>Country of Origin: {mobile.countryOfOrigin}</Card.Text> : null}
              {mobile.packageWeight ? <Card.Text>Package Weight: {mobile.packageWeight}</Card.Text> : null}
              {mobile.packageDimensions ? <Card.Text>Package Dimensions: {mobile.packageDimensions}</Card.Text> : null}
              <div className="buttons product-detail-actions">
                <Button
                  variant="primary"
                  onClick={async () => {
                    if (!requireLogin()) return;
                    await handleAddToCart({
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
                  onClick={async () => {
                    if (!requireLogin()) return;
                    await buyNow(mobile);
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
