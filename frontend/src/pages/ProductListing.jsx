import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Col,
  Row,
  Container,
  Button,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Plus, ShoppingCart, Trash, Star, Heart } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/ProductListing.css";
import { API_URL, getAssetUrl } from "../config/api";

const API_BASE_URL = API_URL;

const ProductListing = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      setDeleteLoading(id);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const calculateDiscountedPrice = (price) => {
    const originalPrice = parseFloat(price);
    if (originalPrice >= 100.0) {
      return (originalPrice * 0.8).toFixed(2);
    }
    return originalPrice.toFixed(2);
  };

  const getDiscountPercentage = (price) => {
    const originalPrice = parseFloat(price);
    if (originalPrice >= 100.0) {
      return 20;
    }
    return 0;
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    console.log("Buy now:", product);
    alert(`Proceeding to buy ${product.name}`);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!currentUser || !currentUser.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="seller-listing">
        <Container>
          <div className="seller-listing__loading">
            <Spinner
              animation="border"
              role="status"
              className="seller-listing__spinner"
            />
            <div className="mt-3 seller-listing__loading-text">
              Loading amazing products...
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-listing">
        <Container>
          <Alert
            variant="danger"
            className="seller-listing__alert"
          >
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p>{error}</p>
            <Button
              variant="outline-danger"
              onClick={fetchProducts}
              className="seller-listing__btn seller-listing__btn--danger"
            >
              Try Again
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="seller-listing">
        <Container>
          <Alert variant="info" className="seller-listing__alert">
            <Alert.Heading>No Products Found</Alert.Heading>
            <p>There are currently no products available.</p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="seller-listing">
      <Container>
        <div className="seller-listing__header">
          <span className="seller-listing__badge">Seller Console</span>
          <h1>Store Inventory</h1>
          <p>Manage listings, update details, and keep stock healthy.</p>
        </div>
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={12} className="mb-5">
              <Card
                className="seller-listing__card"
              >
                {getDiscountPercentage(product.price) > 0 && (
                  <Badge className="seller-listing__discount">
                    {getDiscountPercentage(product.price)}% OFF
                  </Badge>
                )}

                <Button
                  className={`seller-listing__favorite ${
                    favorites.has(product.id) ? "is-active" : ""
                  }`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    size={20}
                    fill={favorites.has(product.id) ? "currentColor" : "none"}
                  />
                </Button>

                <Row className="g-0">
                  <Col md={5}>
                    <Card.Img
                      variant="center"
                      src={getAssetUrl(product.primaryImage || product.image)}
                      alt={product.name}
                      className="seller-listing__image"
                    />
                  </Col>
                  <Col md={7}>
                    <Card.Body className="seller-listing__body">
                      <div className="seller-listing__rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#ffd700"
                            color="#ffd700"
                          />
                        ))}
                        <span className="seller-listing__rating-text">
                          (4.8)
                        </span>
                      </div>

                      <Card.Title>
                        <Link
                          to={`/mobiledata/${product.id}`}
                          className="seller-listing__title"
                        >
                          {product.name}
                        </Link>
                      </Card.Title>

                      <div className="seller-listing__specs">
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Brand:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.brand}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            RAM:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.ram}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Storage:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.rom}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Camera:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.camera}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Screen:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.screenSize}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Processor:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.processor}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Battery:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.battery}
                          </span>
                        </div>
                        <div className="seller-listing__spec-item">
                          <span className="seller-listing__spec-label">
                            Colour:
                          </span>
                          <span className="seller-listing__spec-value">
                            {product.color}
                          </span>
                        </div>
                      </div>

                      <div className="seller-listing__price">
                        <div className="seller-listing__current-price">
                          ${calculateDiscountedPrice(product.price)}
                        </div>
                        {parseFloat(product.price) >= 100.0 && (
                          <div className="seller-listing__original-price">
                            ${parseFloat(product.price).toFixed(2)}
                          </div>
                        )}
                      </div>

                      <div className="seller-listing__actions">
                        <Button
                          className="seller-listing__btn seller-listing__btn--primary"
                          onClick={() => handleAddToCart(product)}
                        >
                          <Plus size={18} className="me-2" />
                          Add to Cart
                        </Button>
                        <Button
                          className="seller-listing__btn seller-listing__btn--secondary"
                          onClick={() => handleBuyNow(product)}
                        >
                          <ShoppingCart size={18} className="me-2" />
                          Buy Now
                        </Button>
                        <Button
                          className="seller-listing__btn seller-listing__btn--danger"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteLoading === product.id}
                        >
                          {deleteLoading === product.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <Trash size={16} className="me-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProductListing;
