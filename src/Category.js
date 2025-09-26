import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Cart, Plus } from "react-bootstrap-icons";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { BackToTop } from "./BackToTop";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Category = () => {
  const [productValue, setProductValue] = useState();
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

  useEffect(() => {
    if (filterBrand) {
       const filtered = products.filter(
         (product) => product.brand === filterBrand
       );
       setProductValue(filtered);
     } else {
       setProductValue(products);
     }
    handleproducts();
  }, [products, filterBrand]);

  const { user: currentUser } = useSelector((state) => state.auth);

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
  const productsEndpoint = () => {
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
          setProductValue(data); // Uncomment if you want to replace local products with fetched data
        });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    productsEndpoint();
  }, []);

  const { categoryName } = useParams();
  console.log("value comes from parameters ", categoryName);
  return (
    <div className="shopping">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <h5>Filter by Brand:</h5>
            <div className="d-flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilterBrand(null)}
              >
                All
              </Button>
              {brands.map((brand) => (
                <Button
                  key={brand}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setFilterBrand(brand)}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
        <Row className="row">
          {products.filter((d) => d.category === categoryName).map((data) => (
            <Col sm={12} md={3} key={data.id} className="mb-4">
              <Card className="shop" style={{ width: "100%" }}>
                {/* <Card.Img variant="top" src={'http://localhost:8090/uploads/${data.image}'} className="item" /> */}
                <Card.Img variant="top" src={`http://localhost:8090/uploads/${data.image}`} className="item" />
                <Card.Body>
                  <Card.Title>{data.name}</Card.Title>
                  <Card.Text>{data.brand}</Card.Text>
                  <Card.Text>
                    Price: $
                    {data.price >= 100
                      ? data.price - (data.price * 20) / 100
                      : data.price}
                  </Card.Text>
                  <div className="buttons d-flex gap-2">
                    <Button variant="primary" onClick={() => handleAddToCart({
                      userId: currentUser.id,
                      items:[
                        {
                          productId: data.id,
                          price: data.price,
                          quantity: 1
                        }
                      ],
                      active: true
                    })}>
                      <Plus /> Add to Cart
                    </Button>
                    <Button variant="success" onClick={() => buyNow(data)}>
                      <Cart /> Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
