import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Cart, Plus } from "react-bootstrap-icons";
import { useState } from "react";
import { Link, useParams } from "react-router";

export var products = [
   {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    ram: "8GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.7 inches",
    camera: "48MP Main, 12MP Ultra-Wide, 12MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41lQuD3zXhL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1299,
    ram: "12GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.8 inches",
    camera:
      "200MP Main, 12MP Ultra-Wide, 10MP Telephoto (x2), 10MP Telephoto (x5)",
    image_url: "https://m.media-amazon.com/images/I/41Vc86yXS3L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 999,
    ram: "12GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.7 inches",
    camera: "50MP Main, 48MP Ultra-Wide, 48MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/71r0349s3cL._SX679_.jpg",
  },
  {
    id: 4,
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 899,
    ram: "16GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.82 inches",
    camera: "50MP Main, 48MP Ultra-Wide, 64MP Periscope Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41J4+TiUz6L._SY300_SX300_.jpg",
  },
  {
    id: 5,
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 999,
    ram: "16GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.73 inches",
    camera: "50MP Quad Camera with Leica Optics",
    image_url: "https://m.media-amazon.com/images/I/41EQfoH+qFL._SY300_SX300_.jpg",
  },
  {
    id: 6,
    name: "iPhone SE (3rd Gen)",
    brand: "Apple",
    price: 429,
    ram: "4GB",
    rom: "64GB",
    category: "mobiles",
    screen_size: "4.7 inches",
    camera: "12MP Wide",
    image_url: "https://m.media-amazon.com/images/I/41BKXZLpc1L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 7,
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    price: 479,
    ram: "8GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.6 inches",
    camera: "50MP Main, 12MP Ultra-Wide, 5MP Macro",
    image_url: "https://m.media-amazon.com/images/I/41uR6Pme6NL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 8,
    name: "Google Pixel 7a",
    brand: "Google",
    price: 499,
    ram: "8GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.1 inches",
    camera: "64MP Main, 13MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/41YW3WpZ2ML._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 9,
    name: "Redmi Note 13 Pro+",
    brand: "Xiaomi",
    price: 399,
    ram: "12GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.67 inches",
    camera: "200MP Main, 8MP Ultra-Wide, 2MP Macro",
    image_url: "https://m.media-amazon.com/images/I/3170zY4OGWL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 10,
    name: "Realme 12 Pro+",
    brand: "Realme",
    price: 379,
    ram: "8GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.7 inches",
    camera: "50MP Main, 8MP Ultra-Wide, 64MP Periscope Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41EcfoaB4+L._SY300_SX300_.jpg",
  },
  {
    id: 11,
    name: "Motorola Edge 50 Pro",
    brand: "Motorola",
    price: 699,
    ram: "12GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.7 inches",
    camera: "50MP Main, 13MP Ultra-Wide, 10MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41qtPl1QeHL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 12,
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 699,
    ram: "12GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.7 inches",
    camera: "50MP Main, 50MP Ultra-Wide",
    image_url:
      "https://m.media-amazon.com/images/I/51EGheCtg0L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 13,
    name: "ASUS ROG Phone 8 Pro",
    brand: "ASUS",
    price: 1399,
    ram: "24GB",
    rom: "1TB",
    category: "mobiles",
    screen_size: "6.78 inches",
    camera: "50MP Main, 13MP Ultra-Wide, 32MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41Safi-Gx1L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 14,
    name: "Sony Xperia 1 V",
    brand: "Sony",
    price: 1299,
    ram: "12GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.5 inches",
    camera: "48MP Main, 12MP Ultra-Wide, 12MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41xJv6S3G6L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 15,
    name: "Vivo X100 Pro",
    brand: "Vivo",
    price: 899,
    ram: "16GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.78 inches",
    camera: "50MP Main, 50MP Ultra-Wide, 50MP Periscope Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41C5enOglKL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 16,
    name: "Oppo Find X7 Ultra",
    brand: "Oppo",
    price: 1099,
    ram: "16GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.82 inches",
    camera: "50MP Quad Camera with HyperTone",
    image_url: "https://m.media-amazon.com/images/I/41toJG9uWkL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 17,
    name: "Honor Magic6 Pro",
    brand: "Honor",
    price: 1099,
    ram: "12GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.8 inches",
    camera: "50MP Main, 50MP Ultra-Wide, 180MP Periscope Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41YapxuVy9L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 18,
    name: "Huawei P60 Pro",
    brand: "Huawei",
    price: 999,
    ram: "8GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.67 inches",
    camera: "48MP Main, 13MP Ultra-Wide, 48MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/71nYEHgLodL._SX569_.jpg",
  },
  {
    id: 19,
    name: "Infinix Note 40 Pro+",
    brand: "Infinix",
    price: 299,
    ram: "12GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.78 inches",
    camera: "108MP Main, 2MP Macro, 2MP Depth",
    image_url: "https://m.media-amazon.com/images/I/51-Unh3XuBL.jpg",
  },
  {
    id: 20,
    name: "Tecno Camon 30 Pro 5G",
    brand: "Tecno",
    price: 349,
    ram: "12GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "6.78 inches",
    camera: "50MP Main, 50MP Ultra-Wide, 2MP Depth",
    image_url: "https://m.media-amazon.com/images/I/41cHIrr45WL._SX300_SY300_QL70_FMwebp_.jpg",
  },
];
const Category = () => {
  const [value, setValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  
  const names = products.filter((products) => {

    return products.brand === value

  })

  const { categoryName } = useParams();
  console.log("value comes from parameters ", categoryName);
  return (
    <div className="shopping">
      <Container fluid>
        <Row className="row">
          {/* {products.map((data) => ( */}
          {products
            .filter((d) => d.category === categoryName)
            .map((data) => (
              <Col sm={12} md={3}>
                <Card className="shop" style={{ width: "100%" }}>
                  <Card.Img variant="top" src={data.image_url} className="item" />
                  <Card.Body>
                    <Card.Title>
                      <Link to="/category/mobiles/mobiledata>">
                        {data.name}
                      </Link>
                    </Card.Title>
                    <Card.Text>{data.brand}</Card.Text>
                    <Card.Text>{data.ram}</Card.Text>
                    <Card.Text>{data.rom}</Card.Text>
                    <Card.Text>{data.camera}</Card.Text>
                    <Card.Text>{data.screen_size}</Card.Text>
                    <Card.Text>
                      Price:
                      {data.price >= parseFloat(100.0)
                        ? (data.price * 20) / 100
                        : data.price}
                    </Card.Text>
                    <Button variant="primary">
                      <Plus /> Add Item{" "}
                    </Button>
                    <Button variant="primary">
                      <Cart /> Buy Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
        <Row className="nh">
          <Col className="w-100">
            <h6>Back to top</h6>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Category;
