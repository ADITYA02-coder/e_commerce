import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Row, Container, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { Plus, ShoppingCart, Trash, Star, Heart } from "lucide-react";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const API_BASE_URL = "http://localhost:8090/api";

  // Custom styles
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    },
    productCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: 'none',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      position: 'relative'
    },
    productCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)'
    },
    productImage: {
      height: '300px',
      objectFit: 'cover',
      borderRadius: '20px 0 0 20px',
      transition: 'transform 0.3s ease'
    },
    productImageHover: {
      transform: 'scale(1.05)'
    },
    cardBody: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
      padding: '2rem'
    },
    productTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#2d3748',
      textDecoration: 'none',
      transition: 'color 0.3s ease'
    },
    productTitleHover: {
      color: '#667eea'
    },
    specItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.75rem',
      padding: '0.5rem',
      background: 'rgba(102, 126, 234, 0.05)',
      borderRadius: '10px',
      border: '1px solid rgba(102, 126, 234, 0.1)'
    },
    specLabel: {
      fontWeight: '600',
      color: '#4a5568',
      minWidth: '80px'
    },
    specValue: {
      color: '#2d3748',
      fontWeight: '500'
    },
    priceContainer: {
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      padding: '1rem',
      borderRadius: '15px',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    currentPrice: {
      fontSize: '2rem',
      fontWeight: '800',
      color: 'white',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    originalPrice: {
      fontSize: '1.2rem',
      color: 'rgba(255,255,255,0.8)',
      textDecoration: 'line-through'
    },
    discountBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%)',
      color: 'white',
      fontWeight: '700',
      fontSize: '0.9rem',
      padding: '0.5rem 1rem',
      borderRadius: '25px',
      boxShadow: '0 4px 15px rgba(237, 100, 166, 0.4)'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      flex: '1'
    },
    secondaryButton: {
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)',
      flex: '1'
    },
    dangerButton: {
      background: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(252, 129, 129, 0.3)'
    },
    favoriteButton: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    loadingSpinner: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '3rem',
      textAlign: 'center',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    headerTitle: {
      textAlign: 'center',
      color: 'white',
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '3rem',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }
  };

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
    const confirmed = window.confirm("Are you sure you want to delete this product?");
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

      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
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
    setFavorites(prev => {
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

  if (loading) {
    return (
      <div style={styles.container}>
        <Container>
          <div style={styles.loadingSpinner}>
            <Spinner animation="border" role="status" style={{ color: '#667eea' }} />
            <div className="mt-3" style={{ color: '#4a5568', fontSize: '1.2rem' }}>Loading amazing products...</div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Container>
          <Alert variant="danger" style={{ ...styles.productCard, color: '#e53e3e' }}>
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p>{error}</p>
            <Button 
              variant="outline-danger" 
              onClick={fetchProducts}
              style={styles.dangerButton}
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
      <div style={styles.container}>
        <Container>
          <Alert variant="info" style={styles.productCard}>
            <Alert.Heading>No Products Found</Alert.Heading>
            <p>There are currently no products available.</p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Container>
        <h1 style={styles.headerTitle}>Premium Products</h1>
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={12} className="mb-5">
              <Card 
                style={styles.productCard}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.productCardHover);
                  const img = e.currentTarget.querySelector('img');
                  if (img) Object.assign(img.style, styles.productImageHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {getDiscountPercentage(product.price) > 0 && (
                  <Badge style={styles.discountBadge}>
                    {getDiscountPercentage(product.price)}% OFF
                  </Badge>
                )}
                
                <Button
                  style={{
                    ...styles.favoriteButton,
                    color: favorites.has(product.id) ? '#e53e3e' : '#a0aec0'
                  }}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart size={20} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                </Button>

                <Row className="g-0">
                  <Col md={5}>
                    <Card.Img
                      variant="center"
                      src={`${API_BASE_URL.replace('/api', '')}/uploads/${product.image}`}
                      alt={product.name}
                      style={styles.productImage}
                    />
                  </Col>
                  <Col md={7}>
                    <Card.Body style={styles.cardBody}>
                      <div style={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                        ))}
                        <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>(4.8)</span>
                      </div>

                      <Card.Title>
                        <a 
                          href="/category/mobiles/mobiledata" 
                          style={styles.productTitle}
                          onMouseEnter={(e) => Object.assign(e.target.style, styles.productTitleHover)}
                          onMouseLeave={(e) => e.target.style.color = '#2d3748'}
                        >
                          {product.name}
                        </a>
                      </Card.Title>
                      
                      <div className="mb-4">
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>Brand:</span>
                          <span style={styles.specValue}>{product.brand}</span>
                        </div>
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>RAM:</span>
                          <span style={styles.specValue}>{product.ram}</span>
                        </div>
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>Storage:</span>
                          <span style={styles.specValue}>{product.rom}</span>
                        </div>
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>Camera:</span>
                          <span style={styles.specValue}>{product.camera}</span>
                        </div>
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>Screen:</span>
                          <span style={styles.specValue}>{product.screenSize}</span>
                        </div>
                      </div>

                      <div style={styles.priceContainer}>
                        <div style={styles.currentPrice}>
                          ${calculateDiscountedPrice(product.price)}
                        </div>
                        {parseFloat(product.price) >= 100.0 && (
                          <div style={styles.originalPrice}>
                            ${parseFloat(product.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      <div style={styles.buttonGroup}>
                        <Button 
                          style={styles.primaryButton}
                          onClick={() => handleAddToCart(product)}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                          }}
                        >
                          <Plus size={18} className="me-2" />
                          Add to Cart
                        </Button>
                        <Button 
                          style={styles.secondaryButton}
                          onClick={() => handleBuyNow(product)}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)';
                          }}
                        >
                          <ShoppingCart size={18} className="me-2" />
                          Buy Now
                        </Button>
                        <Button
                          style={styles.dangerButton}
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteLoading === product.id}
                          onMouseEnter={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 25px rgba(252, 129, 129, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.transform = 'translateY(0px)';
                              e.target.style.boxShadow = '0 4px 15px rgba(252, 129, 129, 0.3)';
                            }
                          }}
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







































// import React, { useEffect, useState } from "react";
// import { Card, Col } from "react-bootstrap";
// import { Row } from "react-bootstrap";
// import { Container } from "react-bootstrap";
// import "./style.css";
// import { Link } from "react-router";
// import { Button } from "react-bootstrap";
// import { Plus } from "react-bootstrap-icons";
// import { Cart } from "react-bootstrap-icons";
// const MyComponent = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8090/api/products/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//     } catch (err) {
//       console.error("Error submitting product:", err);
//     }
//     // Here you can add the logic to send the product data to your backend or API
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:8090/api/products");
//         if (!response.ok) {
//           throw new Error(`HHTP error! status: ${response.status}`);
//         }
//         const jsonData = await response.json();
//         setData(jsonData);
//         console.log(jsonData);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);
//   if (loading) return <div>Loading.....</div>;
//   if (error) return <div>Error: {error.message}</div>;
//   return (
//     <div>
//       {data.map((data) => (
//        <Container>
//         <Row>
//           <Card className="add" style={{ width: "100%" }}>
//             <Col key={data.id} xs={12} md={6} lg={4} className="mb-4">
//               <Card.Img
//                 variant="top"
//                 src={`http://localhost:8090/uploads/${data.image}`}
//                 className="image"
//               />
//             </Col>
//             <Col>
//               <Card.Body>
//                 <Card.Title>
//                   <Link to="/category/mobiles/mobiledata">{data.name}</Link>
//                 </Card.Title>
//                 <Card.Text>{data.brand}</Card.Text>
//                 <Card.Text>{data.ram}</Card.Text>
//                 <Card.Text>{data.rom}</Card.Text>
//                 <Card.Text>{data.camera}</Card.Text>
//                 <Card.Text>{data.screen_size}</Card.Text>
//                 <Card.Text>
//                   Price:
//                   {data.price >= parseFloat(100.0)
//                     ? (data.price * 20) / 100
//                     : data.price}
//                 </Card.Text>
//                 <Button variant="primary">
//                   <Plus /> Add Item{" "}
//                 </Button>
//                 <Button variant="primary">
//                   <Cart /> Buy Now
//                 </Button>
//               </Card.Body>
//               <Button
//                 variant="danger"
//                 onClick={() => {
//                   const alertValue = window.confirm(
//                     "Are you sure you want to delete this product?"
//                   );
//                   if (alertValue) {
//                     handleDelete(data.id);
//                     window.location.reload();
//                   }
//                 }}
//               >
//                 Delete
//               </Button>
//             </Col>
//           </Card>
//         </Row>
//       </Container> 
//       ))}
//     </div>
//   );
// };

// export default MyComponent;
