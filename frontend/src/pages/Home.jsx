import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Row, Col, Spin, message, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from "../config/api";
import { fetchStorefrontHome, searchStorefrontProducts } from "../services/storefront.service";

const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

const Home = () => {
  const [phones, setPhones] = useState([]);
  const [feed, setFeed] = useState({
    hero: null,
    topDeals: [],
    bestSellers: [],
    topCategories: [],
    topBrands: [],
    stats: { totalProducts: 0, inStockProducts: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchPhones = async () => {
    setLoading(true);
    try {
      const homeFeed = await fetchStorefrontHome({ limit: 12 });
      const recentProducts = homeFeed.recentlyAdded || [];
      setPhones(recentProducts);
      setFeed(homeFeed);
    } catch (error) {
      message.error("Failed to load products");
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPhones = async (keyword) => {
    setLoading(true);
    try {
      const result = await searchStorefrontProducts({
        q: keyword,
        page: 1,
        limit: 24,
        sort: "popular"
      });
      setPhones(result.items || []);
    } catch {
      message.error('Search failed');
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const onSearch = (value) => {
    setSearchTerm(value);
    if (!value || value.trim() === '') {
      fetchPhones();
    } else {
      searchPhones(value.trim());
    }
  };
  

  const brands = (feed.topBrands || []).length
    ? feed.topBrands.map((brand) => brand.name).filter(Boolean).slice(0, 8)
    : Array.from(new Set(phones.map((p) => p.brand).filter(Boolean))).slice(0, 8);
  const featuredPhones = phones.slice(0, 6);
  const topDeals = (feed.topDeals || []).length
    ? feed.topDeals.slice(0, 4)
    : phones
        .filter((phone) => Number(phone.price || 0) > 0)
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        .slice(0, 4);
  const bestSellers = (feed.bestSellers || []).length ? feed.bestSellers.slice(0, 8) : phones.slice(0, 8);
  const byCategory = (feed.topCategories || []).length
    ? feed.topCategories.map((cat) => cat.name).filter(Boolean).slice(0, 4)
    : Array.from(new Set(phones.map((p) => p.category).filter(Boolean))).slice(0, 4);

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        <section className="home-hero">
          <div className="home-hero-text">
            <span className="home-eyebrow">Great deals. Fast delivery. Trusted sellers.</span>
            <h1>Your everyday store for mobiles, electronics and more.</h1>
            <p>
              ShopEase brings daily offers, curated brands, and quick checkout in one place.
            </p>
            <div className="home-hero-actions">
              <Button type="primary" size="large" onClick={() => navigate('/product')}>
                Start Shopping
              </Button>
              <Button size="large" onClick={() => navigate('/cart')}>
                See Cart
              </Button>
            </div>
            <div className="home-stats">
              <div>
                <strong>{feed.stats?.totalProducts || phones.length || '150+'}</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Secure Checkout</span>
              </div>
              <div>
                <strong>Easy</strong>
                <span>Returns</span>
              </div>
            </div>
          </div>
          <div className="home-hero-card">
            <div className="hero-card-inner">
              <h3>Deal of the day</h3>
              <p>Extra discounts on selected picks. Limited-time prices.</p>
              <Button onClick={() => navigate('/product')}>View Deals</Button>
            </div>
          </div>
        </section>

        <section className="home-deals-strip">
          {topDeals.map((item) => (
            <article key={item.id || item._id} className="home-deal-tile" onClick={() => navigate(`/mobiledata/${item.id || item._id}`)}>
              <img src={getAssetUrl(item.primaryImage || item.image)} alt={item.name} />
              <div>
                <span className="deal-label">Deal</span>
                <h4>{item.name}</h4>
                <p>Rs. {item.price}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="home-search-section">
          <div className="home-search">
            <Search
              placeholder="Search by brand, model, or feature..."
              enterButton={<SearchOutlined />}
              onSearch={onSearch}
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </div>
        </section>

        <section className="home-brands">
          <h2>Top Brands</h2>
          <div className="brand-grid">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <button
                  key={brand}
                  className="brand-chip"
                  onClick={() => onSearch(brand)}
                >
                  {brand}
                </button>
              ))
            ) : (
              <div className="home-empty">No brands available.</div>
            )}
          </div>
        </section>

        <section className="home-categories-block">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Button type="link" onClick={() => navigate('/product')}>Explore all</Button>
          </div>
          <div className="home-category-grid">
            {byCategory.map((category) => (
              <button key={category} className="home-category-card" onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}>
                <h4>{category}</h4>
                <span>View products</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-featured">
          <div className="section-header">
            <h2>Featured Phones</h2>
            <Button type="link" onClick={() => navigate('/product')}>View all</Button>
          </div>
          {loading ? (
            <div className="home-loading">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]} justify="center" className="home-grid">
              {featuredPhones.length > 0 ? (
                featuredPhones.map((phone) => (
                  <Col xs={24} sm={12} md={8} key={phone.id || phone._id}>
                    <Card
                      hoverable
                      className="home-card"
                      onClick={() => navigate(`/mobiledata/${phone.id || phone._id}`)}
                      cover={
                        <img
                          src={getAssetUrl(phone.primaryImage || phone.image)}
                          alt={phone.name || phone.model || 'Phone'}
                          className="home-card-image"
                        />
                      }
                    >
                      <Meta
                        title={phone.name || phone.model}
                        description={`Brand: ${phone.brand || 'N/A'} - Price: Rs. ${phone.price || 'N/A'}`}
                      />
                      <div className="home-card-cta">View Details</div>
                    </Card>
                  </Col>
                ))
              ) : (
                <div className="home-empty">
                  No phones found.
                </div>
              )}
            </Row>
          )}
        </section>

        <section className="home-featured">
          <div className="section-header">
            <h2>Best Sellers</h2>
            <Button type="link" onClick={() => navigate('/product')}>See more</Button>
          </div>
          <Row gutter={[16, 16]} justify="center" className="home-grid">
            {bestSellers.map((phone) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`best-${phone.id || phone._id}`}>
                <Card
                  hoverable
                  className="home-card"
                  onClick={() => navigate(`/mobiledata/${phone.id || phone._id}`)}
                  cover={
                    <img
                      src={getAssetUrl(phone.primaryImage || phone.image)}
                      alt={phone.name || phone.model || 'Phone'}
                      className="home-card-image"
                    />
                  }
                >
                  <Meta
                    title={phone.name || phone.model}
                    description={`Brand: ${phone.brand || 'N/A'} - Price: Rs. ${phone.price || 'N/A'}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>
    </Layout>
  );
};

export default Home;
