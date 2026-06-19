import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BackToTop } from "../components/BackToTop";
import { getAssetUrl } from "../config/api";
import { fetchProducts } from "../services/productCache";
import "../styles/style.css";

export const Product = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const loadProducts = async (force = false) => {
    try {
      setLoading(true);
      setAllProducts(await fetchProducts(force));
      setError(null);
    } catch {
      setAllProducts([]);
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const brands = useMemo(
    () => [...new Set(allProducts.map((product) => product.brand).filter(Boolean))],
    [allProducts]
  );

  const filteredProducts = useMemo(
    () =>
      allProducts.filter((product) => {
        const price = Number(product.price || 0);
        const rating = Number(product.rating || product.ratings || product.ratingValue || 0);
        const stock = Number(product.stock || product.quantity || product.available || 1);
        return (
          (!filterBrand || product.brand === filterBrand) &&
          (priceRange.min === "" || price >= Number(priceRange.min)) &&
          (priceRange.max === "" || price <= Number(priceRange.max)) &&
          (!minRating || rating >= minRating) &&
          (!inStockOnly || stock > 0)
        );
      }),
    [allProducts, filterBrand, inStockOnly, minRating, priceRange]
  );

  const renderBody = () => {
    if (loading) {
      return <div className="text-center py-5"><h5>Loading products...</h5></div>;
    }

    if (error) {
      return (
        <div className="text-center py-5">
          <h5>{error}</h5>
          <Button variant="primary" onClick={() => loadProducts(true)}>Retry</Button>
        </div>
      );
    }

    if (!filteredProducts.length) {
      return (
        <div className="text-center py-5">
          <h5>No products available right now.</h5>
          <p>Please check back later.</p>
        </div>
      );
    }

    return (
      <>
        <Row className="product-grid">
          <Col lg={3} md={4} sm={12} className="product-filters">
            <div className="filters-panel">
              <div className="filters-header"><h5>Filter by Brand</h5></div>
              <div className="filters-body">
                <Button className="filter-chip" variant="secondary" size="sm" onClick={() => setFilterBrand(null)} active={!filterBrand}>
                  All Brands
                </Button>
                {brands.map((brand) => (
                  <Button key={brand} className="filter-chip" variant="outline-primary" size="sm" onClick={() => setFilterBrand(brand)} active={filterBrand === brand}>
                    {brand}
                  </Button>
                ))}
                <div className="filter-group">
                  <label className="filter-label">Price Range (Rs.)</label>
                  <div className="filter-row">
                    <input type="number" className="filter-input" placeholder="Min" value={priceRange.min} onChange={(event) => setPriceRange({ ...priceRange, min: event.target.value })} />
                    <input type="number" className="filter-input" placeholder="Max" value={priceRange.max} onChange={(event) => setPriceRange({ ...priceRange, max: event.target.value })} />
                  </div>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Customer Rating</label>
                  <select className="filter-select" value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
                    <option value={0}>All Ratings</option>
                    <option value={4}>4 star & up</option>
                    <option value={3}>3 star & up</option>
                    <option value={2}>2 star & up</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-check">
                    <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={9} md={8} sm={12} className="product-list">
            <Row className="g-3">
              {filteredProducts.map((product) => {
                const productId = product.id || product._id;
                return (
                  <Col sm={12} md={6} lg={4} key={productId}>
                    <Link to={`/mobiledata/${productId}`} className="product-card-link">
                      <Card className="shop product-card">
                        <Card.Img variant="top" src={getAssetUrl(product.primaryImage || product.image)} className="item product-image" />
                        <Card.Body>
                          <Card.Title className="product-title">{product.name}</Card.Title>
                          <Card.Text className="product-brand">{product.brand}</Card.Text>
                          <Card.Text className="product-price">Price: Rs. {product.price}</Card.Text>
                          <div className="product-card-cta">View Details</div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        <Row className="nh"><Col className="w-100"><BackToTop /></Col></Row>
      </>
    );
  };

  return (
    <div className="shopping product-page">
      <Container fluid className="product-layout">{renderBody()}</Container>
    </div>
  );
};
