import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import { BackToTop } from "./BackToTop";
import { useSelector } from "react-redux";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingItems, setDeletingItems] = useState(new Set());

   const { user: currentUser } = useSelector((state) => state.auth);
   console.log("Current User in Cart:", currentUser);

  // Fetch cart and product data
  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Step 1: Fetch cart
        const cartResponse = await fetch(`http://localhost:8090/api/carts/user/${currentUser.id}`);
        if (!cartResponse.ok) {
          throw new Error(`Failed to fetch cart: ${cartResponse.status}`);
        }
        const cartData = await cartResponse.json();

        // Check if cart has items
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          setCartItems([]);
          return;
        }

        const itemsWithDetails = await Promise.all(
          cartData.items.map(async (item) => {
            try {
              // Step 2: Fetch each product detail by ID
              const productResponse = await fetch(
                `http://localhost:8090/api/products/${item.productId}`
              );
              if (!productResponse.ok) {
                console.warn(`Failed to fetch product ${item.productId}`);
                return null; // Skip this item if product not found
              }
              const productData = await productResponse.json();

              // Combine item and product data
              return {
                ...item,
                product: productData,
                totalPrice: (item.price * item.quantity).toFixed(2)
              };
            } catch (err) {
              console.warn(`Error fetching product ${item.productId}:`, err);
              return null; // Skip this item on error
            }
          })
        );

        // Filter out null items (failed product fetches)
        const validItems = itemsWithDetails.filter(item => item !== null);
        setCartItems(validItems);
      } catch (err) {
        console.error("Error loading cart or products:", err);
        setError(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [currentUser.id]);

  // Handle remove item (from state only - temporary removal)
  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Handle delete item (from backend and then state - permanent removal)
  const handleDelete = async (id) => {
    if (deletingItems.has(id)) return; // Prevent multiple delete requests
    
    setDeletingItems(prev => new Set(prev).add(id));
    
    try {
      const response = await fetch(`http://localhost:8090/api/carts/item/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }
      
      // Remove from local state on successful delete
      handleRemove(id);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete item. Please try again.");
      // Re-fetch cart to ensure consistency
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Calculate total cart value
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  // Loading state
  if (loading) {
    return (
      <div className="cart-loading">
        <Container className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading your cart...</p>
        </Container>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="success" className="text-center">
          <Alert.Heading>Cart does not have any items</Alert.Heading>
        </Alert>
      </Container>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <Container className="cart-empty">
        <Row className="justify-content-center">
          <Col md={6} className="text-center py-5">
            <div className="empty-cart-icon mb-4">
              🛒
            </div>
            <h3 className="mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/category/mobiles">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="cart-page">
      <Container>
        {/* Cart Header */}
        <div className="cart-header">
          <Row className="align-items-center mb-4">
            <Col>
              <h2 className="cart-title">
                Shopping Cart 
                <Badge bg="secondary" className="ms-2">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </Badge>
              </h2>
            </Col>
            <Col xs="auto">
              <div className="cart-total-header">
                <h4 className="mb-0">Total: ${calculateTotal()}</h4>
              </div>
            </Col>
          </Row>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Cart Items */}
        <Row>
          {cartItems.map((item) => (
            <Col key={item._id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="cart-item-card h-100">
                <div className="card-image-container">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8090/uploads/${item.product?.image}`}
                    alt={item.product?.name || 'Product'}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png'; // Fallback image
                    }}
                  />

                  <div className="quantity-badge">
                    Qty: {item.quantity}
                  </div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="cart-item-title">
                    {item.product?.name || 'Unknown Product'}
                  </Card.Title>
                  <div className="cart-item-details">
                    <div className="price-info">
                      <span className="unit-price">
                        ${item.price} each
                      </span>
                      <span className="total-price">
                        Total: ${item.totalPrice}
                      </span>
                    </div>
                  </div>
                  <div className="cart-item-actions mt-auto">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleRemove(item._id)}
                      className="me-2"
                      disabled={deletingItems.has(item._id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingItems.has(item._id)}
                    >
                      {deletingItems.has(item._id) ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-1"
                          />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Cart Summary */}
        <div className="cart-summary">
          <Row className="justify-content-end">
            <Col md={4}>
              <Card className="summary-card">
                <Card.Body>
                  <h5>Order Summary</h5>
                  <div className="summary-line">
                    <span>Items ({cartItems.length}):</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="summary-line">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="summary-total">
                    <strong>
                      <span>Total:</span>
                      <span>${calculateTotal()}</span>
                    </strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Action Buttons */}
        <div className="cart-actions">
          <Row className="justify-content-between align-items-center">
            <Col xs={12} md={6} className="mb-3 mb-md-0">
              <Link to="/category/mobiles">
                <Button variant="outline-secondary" size="lg">
                  ← Continue Shopping
                </Button>
              </Link>
            </Col>
            <Col xs={12} md={6} className="text-end">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => window.location.href = '/address'}
                className="checkout-btn"
              >
                Proceed to Checkout
              </Button>
            </Col>
          </Row>
        </div>
      </Container>

      <BackToTop />
    </div>
  );
};

export default Cart;