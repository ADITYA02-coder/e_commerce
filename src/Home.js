import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Card, Row, Col, Spin, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MobileOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Search } = Input;

const API_BASE = 'http://localhost:8090/api/products';  
// (Replace with actual base URL if different)

const Home = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // You may need headers for RapidAPI key
  const axiosConfig = {
    headers: {
      'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
      'X-RapidAPI-Host': 'azharimm-phone-specs.p.rapidapi.com',
    }
  };

  // Fetch all phones initially or on empty search
  const fetchPhones = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}/phones`, axiosConfig);
      setPhones(resp.data);  // Assuming resp.data is an array
    } catch (err) {
      console.error('Error fetching phones:', err);
      message.error('Failed to fetch phones');
    } finally {
      setLoading(false);
    }
  };

  // Search phones by keyword
  const searchPhones = async (keyword) => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}/phones/search/${encodeURIComponent(keyword)}`, axiosConfig);
      setPhones(resp.data);
    } catch (err) {
      console.error('Error searching phones:', err);
      message.error('Search failed');
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Content */}
      <Content style={{ padding: '0 16px', marginTop: '16px' }}>
        {/* Search Bar */}
        <div style={{ maxWidth: 400, margin: '0 auto 24px' }}>
          <Search
            placeholder="Search phones..."
            enterButton={<SearchOutlined />}
            onSearch={onSearch}
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          // Phone cards grid
          <Row gutter={[16, 16]} justify="center">
            {phones.length > 0 ? (
              phones.map((phone, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                  <Card
                    hoverable
                    cover={
                      <img
                        src={phone.image_url || phone.image || 'https://via.placeholder.com/200'}
                        alt={phone.phone_name || phone.model || 'Phone'}
                      />
                    }
                    actions={[
                      <span key="add">Add to Cart</span>
                    ]}
                  >
                    <Meta
                      title={phone.phone_name || phone.model}
                      description={`Brand: ${phone.brand || 'N/A'}`}
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <div style={{ width: '100%', textAlign: 'center', marginTop: 50 }}>
                No phones found.
              </div>
            )}
          </Row>
        )}
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center' }}>
        © 2025 PhoneStore. All rights reserved.
      </Footer>
    </Layout>
  );
};

export default Home;
