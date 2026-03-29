import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Row, Col, Spin, message, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

const API_BASE = 'http://localhost:8090/api/products';  
// (Replace with actual base URL if different)

const Home = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch all phones initially or on empty search
  const fetchPhones = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(API_BASE);
      const data = Array.isArray(resp.data) ? resp.data : [];
      console.log("Products fetched from backend:", data);
      setPhones(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };

  // Search phones by keyword
  const searchPhones = async (keyword) => {
    setLoading(true);
    try {
      const resp = await axios.get(API_BASE);
      const data = Array.isArray(resp.data) ? resp.data : [];
      const k = keyword.toLowerCase();
      const filtered = data.filter((phone) => {
        const name = (phone.name || "").toLowerCase();
        const model = (phone.model || "").toLowerCase();
        const brand = (phone.brand || "").toLowerCase();
        return name.includes(k) || model.includes(k) || brand.includes(k);
      });
      setPhones(filtered);
    } catch (err) {
      console.error('Error searching phones:', err);
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
  

  const brands = Array.from(new Set(phones.map((p) => p.brand).filter(Boolean))).slice(0, 8);
  const featuredPhones = phones.slice(0, 6);

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        <section className="home-hero">
          <div className="home-hero-text">
            <span className="home-eyebrow">Discover • Compare • Buy</span>
            <h1>Premium Mobiles. Smarter Deals.</h1>
            <p>
              Find the best phones across top brands, compare specs instantly, and buy with confidence.
            </p>
            <div className="home-hero-actions">
              <Button type="primary" size="large" onClick={() => navigate('/product')}>
                Browse Products
              </Button>
              <Button size="large" onClick={() => navigate('/category/mobiles')}>
                Shop Mobiles
              </Button>
            </div>
            <div className="home-stats">
              <div>
                <strong>{phones.length || '150+'}</strong>
                <span>Models</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Support</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Delivery</span>
              </div>
            </div>
          </div>
          <div className="home-hero-card">
            <div className="hero-card-inner">
              <h3>Smart Picks</h3>
              <p>Curated phones with the best value today.</p>
              <Button onClick={() => navigate('/product')}>See Picks</Button>
            </div>
          </div>
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
                          src={`http://localhost:8090/uploads/${phone.image}`}
                          alt={phone.name || phone.model || 'Phone'}
                          className="home-card-image"
                        />
                      }
                    >
                      <Meta
                        title={phone.name || phone.model}
                        description={`Brand: ${phone.brand || 'N/A'} • Price: Rs. ${phone.price || 'N/A'}`}
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
      </Content>
    </Layout>
  );
};

export default Home;
