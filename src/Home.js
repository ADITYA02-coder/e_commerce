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

  // Fetch all phones initially or on empty search
  const fetchPhones = async () => {
    try {
      fetch("http://localhost:8090/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Products fetched from backend:", data);
          // You can set the fetched data to state if needed
          setPhones(data)
        });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Search phones by keyword
  const searchPhones = async (keyword) => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}`);
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
                        src={`http://localhost:8090/uploads/${phone.image}`}
                        alt={phone.name || phone.model || 'Phone'}
                        height={"257px"}
                        
                        style={{margin:"0 auto", width:"185px"}}
                      />
                    }
                    actions={[
                      <span key="add">Add to Cart</span>
                    ]}
                  >
                    <Meta
                      title={phone.name || phone.model}
                      description={`Brand: ${phone.brand || 'N/A'} | Price: ${phone.price || 'N/A'}`}
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
