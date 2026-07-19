import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BackToTop } from "../components/BackToTop";
import { getAssetUrl } from "../config/api";
import { searchStorefrontProducts } from "../services/storefront.service";
import "../styles/style.css";

export const Product = () => {
  const location = useLocation();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");

  const loadProducts = async (force = false) => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const urlCategory = params.get("category") || "";
    const urlSort = params.get("sort") || sort;
    const urlInStock = params.get("inStock") === "true";

    try {
      setLoading(true);
      setSort(urlSort);
      setInStockOnly((current) => current || urlInStock);
      const result = await searchStorefrontProducts({
        q: query.trim() || undefined,
        category: urlCategory.trim() || undefined,
        sort: urlSort,
        page: 1,
        limit: 60,
        inStock: urlInStock || undefined,
        refresh: force ? Date.now() : undefined
      });
      setAllProducts(result.items || []);
      setFilterCategory(urlCategory || null);
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
  }, [location.search]);

  const brands = useMemo(
    () => [...new Set(allProducts.map((product) => product.brand).filter(Boolean))],
    [allProducts]
  );

  const categories = useMemo(
    () => [...new Set(allProducts.map((product) => product.category).filter(Boolean))],
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
          (!filterCategory || product.category === filterCategory) &&
          (priceRange.min === "" || price >= Number(priceRange.min)) &&
          (priceRange.max === "" || price <= Number(priceRange.max)) &&
          (!minRating || rating >= minRating) &&
          (!inStockOnly || stock > 0)
        );
      }),
    [allProducts, filterBrand, filterCategory, inStockOnly, minRating, priceRange]
  );

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sort === "price_asc") return items.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price_desc") return items.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sort === "rating") {
      return items.sort(
        (a, b) =>
          Number(b.rating || b.ratings || b.ratingValue || 0) -
          Number(a.rating || a.ratings || a.ratingValue || 0)
      );
    }
    return items;
  }, [filteredProducts, sort]);

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

    if (!sortedProducts.length) {
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
              <div className="filters-kicker">ShopEase catalog</div>
              <div className="filters-header"><h5>Department</h5></div>
              <div className="filters-body">
                <Button className="filter-chip" variant="secondary" size="sm" onClick={() => setFilterCategory(null)} active={!filterCategory}>
                  All Departments
                </Button>
                {categories.map((category) => (
                  <Button key={category} className="filter-chip" variant="outline-primary" size="sm" onClick={() => setFilterCategory(category)} active={filterCategory === category}>
                    {category}
                  </Button>
                ))}
              </div>
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
            <div className="product-toolbar">
              <div>
                <h1>Products</h1>
                <p>{sortedProducts.length} results from approved marketplace sellers</p>
              </div>
              <label>
                Sort by
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="popular">Featured</option>
                  <option value="rating">Customer rating</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="newest">Newest arrivals</option>
                </select>
              </label>
            </div>
            <Row className="g-3">
              {sortedProducts.map((product) => {
                const productId = product.id || product._id;
                const rating = Number(product.rating || product.ratings || product.ratingValue || 4.3);
                const stars = "★".repeat(Math.min(5, Math.max(1, Math.round(rating))));
                const discount = Number(product.discount || 0);
                const attributes = Object.entries(product.attributes || {})
                  .filter(([, value]) => String(value || "").trim())
                  .slice(0, 3);
                return (
                  <Col sm={12} md={6} lg={4} key={productId}>
                    <Link to={`/mobiledata/${productId}`} className="product-card-link">
                      <Card className="shop product-card">
                        <Card.Img variant="top" src={getAssetUrl(product.primaryImage || product.image)} className="item product-image" />
                        <Card.Body>
                          <Card.Title className="product-title">{product.name}</Card.Title>
                          <Card.Text className="product-brand">{product.brand || "Marketplace"} | {product.category || "General"}</Card.Text>
                          {attributes.length > 0 ? (
                            <div className="product-attributes">
                              {attributes.map(([key, value]) => (
                                <span key={`${productId}-${key}`}>{value}</span>
                              ))}
                            </div>
                          ) : null}
                          <div className="product-rating">{stars} <span>{rating.toFixed(1)}</span></div>
                          <Card.Text className="product-price">Rs. {Number(product.discountedPrice || product.price || 0).toLocaleString("en-IN")}</Card.Text>
                          {discount > 0 && <div className="product-savings">{discount}% off limited deal</div>}
                          <div className="product-delivery">FREE delivery available</div>
                          <div className="product-card-cta">View details</div>
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
