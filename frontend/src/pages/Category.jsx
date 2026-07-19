import React, { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Cart, Plus } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BackToTop } from "../components/BackToTop";
import { API_URL, getAssetUrl } from "../config/api";
import { searchStorefrontProducts } from "../services/storefront.service";
import "../styles/Category.css";

const readBuyItems = () => {
  try {
    return JSON.parse(localStorage.getItem("BuyItems") || "[]");
  } catch {
    return [];
  }
};

const Category = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [filterBrand, setFilterBrand] = useState(null);
  const [selectedItems, setSelectedItems] = useState(readBuyItems);

  useEffect(() => {
    searchStorefrontProducts({ category: categoryName, limit: 60 })
      .then((result) => setProducts(result.items || []))
      .catch(() => setProducts([]));
  }, [categoryName]);

  useEffect(() => {
    setFilterBrand(null);
  }, [categoryName]);

  const categoryProducts = products;

  const brands = useMemo(
    () => [...new Set(categoryProducts.map((product) => product.brand).filter(Boolean))],
    [categoryProducts]
  );

  const filteredProducts = filterBrand
    ? categoryProducts.filter((product) => product.brand === filterBrand)
    : categoryProducts;

  const requireLogin = () => {
    if (currentUser) return true;
    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    return false;
  };

  const buyNow = (item) => {
    const updatedItems = [...selectedItems, item];
    setSelectedItems(updatedItems);
    localStorage.setItem("BuyItems", JSON.stringify(updatedItems));
  };

  const handleAddToCart = async (item) => {
    const response = await fetch(`${API_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Unable to add this product to your cart.");
    }
  };

  return (
    <div className="category-page">
      <Container fluid>
        <div className="category-hero">
          <span className="category-badge">Shop by Category</span>
          <h2 className="category-title">{categoryName}</h2>
          <p className="category-subtitle">Discover trending picks, compare specs, and add favorites to your cart.</p>
        </div>

        <Row className="mb-3">
          <Col>
            <div className="category-filter-header">
              <h5>Filter by Brand</h5>
              <span>{filteredProducts.length} items</span>
            </div>
            <div className="category-filter-chips">
              <Button variant="secondary" size="sm" onClick={() => setFilterBrand(null)} className="category-chip">
                All
              </Button>
              {brands.map((brand) => (
                <Button key={brand} variant="outline-primary" size="sm" onClick={() => setFilterBrand(brand)} className="category-chip">
                  {brand}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        <Row className="category-grid">
          {filteredProducts.map((product) => {
            const productId = product.id || product._id;
            const ratingValue = Number(product.rating || product.ratings || product.ratingValue || 0);
            const stockValue = Number(product.stock || product.quantity || product.available || 0);
            const displayPrice = Number(product.discountedPrice || product.price || 0);
            const attributes = Object.entries(product.attributes || {})
              .filter(([, value]) => String(value || "").trim())
              .slice(0, 3);
            return (
              <Col sm={12} md={6} lg={4} xl={3} key={productId} className="mb-4">
                <Card
                  className="category-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/mobiledata/${productId}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/mobiledata/${productId}`);
                    }
                  }}
                >
                  <div className="category-card__image">
                    <Card.Img variant="top" src={getAssetUrl(product.primaryImage || product.image)} />
                  </div>
                  <Card.Body>
                    <Card.Title className="category-card__title">{product.name}</Card.Title>
                    {attributes.length > 0 ? (
                      <div className="product-attributes">
                        {attributes.map(([key, value]) => (
                          <span key={`${productId}-${key}`}>{value}</span>
                        ))}
                      </div>
                    ) : null}
                    <div className="category-card__meta-row">
                      <span className="category-card__rating">
                        {"*".repeat(Math.max(0, Math.min(5, Math.round(ratingValue || 4))))}
                        <span>{(ratingValue || 4).toFixed(1)}</span>
                      </span>
                      <span className={`category-card__stock ${stockValue > 0 ? "in-stock" : "out-stock"}`}>
                        {stockValue > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </div>
                    <div className="category-card__meta">
                      <span>{product.brand}</span>
                      <span className="category-card__price">
                        Rs. {displayPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="category-card__actions">
                      <Button
                        variant="primary"
                        className="category-btn category-btn--primary"
                        onClick={async (event) => {
                          event.stopPropagation();
                          if (!requireLogin() || stockValue <= 0) return;
                          try {
                            await handleAddToCart({
                              userId: currentUser.id,
                              items: [{ productId, price: product.price, quantity: 1 }],
                              active: true,
                            });
                          } catch (error) {
                            console.error("Error adding item to cart:", error);
                          }
                        }}
                        disabled={stockValue <= 0}
                      >
                        <Plus /> Add to Cart
                      </Button>
                      <Button
                        variant="success"
                        className="category-btn category-btn--secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (!requireLogin() || stockValue <= 0) return;
                          buyNow(product);
                        }}
                        disabled={stockValue <= 0}
                      >
                        <Cart /> Buy Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row className="nh"><Col className="w-100"><BackToTop /></Col></Row>
      </Container>
    </div>
  );
};

export default Category;
