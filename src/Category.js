import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Cart, Plus } from "react-bootstrap-icons";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BackToTop } from "./BackToTop";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./Category.css";

const Category = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState(() => {
    const saved = localStorage.getItem("BuyItems");
    return saved ? JSON.parse(saved) : [];
  });

  const handleproducts = ()=>{
    fetch("http://localhost:8090/api/products")
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched products:", data);
    setProducts(data);
    return data;
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
    return [];
  });
  }

  const [filterBrand, setFilterBrand] = useState(null);

  const filteredProducts = filterBrand
    ? products.filter((product) => product.brand === filterBrand)
    : products;

  useEffect(() => {
    handleproducts();
  }, []);

  const { user: currentUser } = useSelector((state) => state.auth);

  const requireLogin = () => {
    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    return true;
  };

  const buyNow = (item) => {
    const updatedItems = [...selectedItems, item];
    setSelectedItems(updatedItems);
    localStorage.setItem("BuyItems", JSON.stringify(updatedItems));
    console.log("Selected Items:", updatedItems);
  };

  const handleAddToCart = (item) => {
    fetch("http://localhost:8090/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Item added to cart:", data);
        // Optionally, update cart state or provide user feedback here
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
    }

  const brands = [...new Set(products.map((p) => p.brand))];
  const { categoryName } = useParams();
  console.log("value comes from parameters ", categoryName);
  return (
    <div className="category-page">
      <Container fluid>
        <div className="category-hero">
          <span className="category-badge">Shop by Category</span>
          <h2 className="category-title">{categoryName}</h2>
          <p className="category-subtitle">
            Discover trending picks, compare specs, and add favorites to your cart.
          </p>
        </div>
        <Row className="mb-3">
          <Col>
            <div className="category-filter-header">
              <h5>Filter by Brand</h5>
              <span>{filteredProducts.length} items</span>
            </div>
            <div className="category-filter-chips">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilterBrand(null)}
                className="category-chip"
              >
                All
              </Button>
              {brands.map((brand) => (
                <Button
                  key={brand}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setFilterBrand(brand)}
                  className="category-chip"
                >
                  {brand}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
        <Row className="category-grid">
          {filteredProducts
            .filter((d) => d.category === categoryName)
            .map((data) => {
            const ratingValue = Number(data.rating || data.ratings || data.ratingValue || 0);
            const stockValue = Number(data.stock || data.quantity || data.available || 0);
            return (
            <Col sm={12} md={6} lg={4} xl={3} key={data.id} className="mb-4">
              <Card className="category-card">
                {/* <Card.Img variant="top" src={'http://localhost:8090/uploads/${data.image}'} className="item" /> */}
                <div className="category-card__image">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:8090/uploads/${data.image}`}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="category-card__title">
                    {data.name}
                  </Card.Title>
                  <div className="category-card__meta-row">
                    <span className="category-card__rating">
                      {"★".repeat(Math.max(0, Math.min(5, Math.round(ratingValue || 4))))}
                      <span>{(ratingValue || 4).toFixed(1)}</span>
                    </span>
                    <span
                      className={`category-card__stock ${
                        stockValue > 0 ? "in-stock" : "out-stock"
                      }`}
                    >
                      {stockValue > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <div className="category-card__meta">
                    <span>{data.brand}</span>
                    <span className="category-card__price">
                      ₹
                      {data.price >= 100
                        ? data.price - (data.price * 20) / 100
                        : data.price}
                    </span>
                  </div>
                  <div className="category-card__actions">
                    <Button
                      variant="primary"
                      className="category-btn category-btn--primary"
                      onClick={() => {
                        if (!requireLogin()) return;
                        if (stockValue <= 0) return;
                        handleAddToCart({
                          userId: currentUser.id,
                          items: [
                            {
                              productId: data.id,
                              price: data.price,
                              quantity: 1,
                            },
                          ],
                          active: true,
                        });
                      }}
                      disabled={stockValue <= 0}
                    >
                      <Plus /> Add to Cart
                    </Button>
                    <Button
                      variant="success"
                      className="category-btn category-btn--secondary"
                      onClick={() => {
                        if (!requireLogin()) return;
                        if (stockValue <= 0) return;
                        buyNow(data);
                      }}
                      disabled={stockValue <= 0}
                    >
                      <Cart /> Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )})}
        </Row>
        <Row className="nh">
          <Col className="w-100">
            <BackToTop />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Category;
