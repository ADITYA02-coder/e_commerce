import React, { useState,useEffect } from "react";
import './style.css';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Cart, Plus } from "react-bootstrap-icons";
import { data } from "react-router";
import { BackToTop } from "./BackToTop";
import { json } from "body-parser";
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
  {
    id: 21,
    name: "iPhone 14 Pro",
    brand: "Apple",
    price: 999,
    ram: "6GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.1 inches",
    camera: "48MP Main, 12MP Ultra-Wide, 12MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/31VjlrbE3bL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 22,
    name: "Samsung Galaxy Z Fold5",
    brand: "Samsung",
    price: 1799,
    ram: "12GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "7.6 inches (unfolded)",
    camera: "50MP Main, 12MP Ultra-Wide, 10MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41aNCS-I0bL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 23,
    name: "Google Pixel Fold",
    brand: "Google",
    price: 1699,
    ram: "12GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "7.6 inches (unfolded)",
    camera: "48MP Main, 10.8MP Ultra-Wide, 10.8MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/61ZzCKXyfTL._SX679_.jpg",
  },
  {
    id: 24,
    name: "OnePlus Open",
    brand: "OnePlus",
    price: 1599,
    ram: "16GB",
    rom: "512GB",
    category: "mobiles",
    screen_size: "7.82 inches (unfolded)",
    camera: "48MP Main, 48MP Ultra-Wide, 64MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/51VuJpFmjrL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 25,
    name: "Motorola Razr+",
    brand: "Motorola",
    price: 999,
    ram: "8GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.9 inches (unfolded)",
    camera: "12MP Main, 13MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/31dRswun9WL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 26,
    name: "Samsung Galaxy Z Flip5",
    brand: "Samsung",
    price: 999,
    ram: "8GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.7 inches (unfolded)",
    camera: "12MP Main, 12MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/3114411coLL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 27,
    name: "iPhone 15",
    brand: "Apple",
    price: 799,
    ram: "6GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.1 inches",
    camera: "48MP Main, 12MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/31KxpX7Xk7L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 28,
    name: "Samsung Galaxy S24+",
    brand: "Samsung",
    price: 999,
    ram: "12GB",
    rom: "256GB",
    category: "mobiles",
    screen_size: "6.7 inches",
    camera: "50MP Main, 12MP Ultra-Wide, 10MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41h2alWH8ML._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 29,
    name: "Google Pixel 8",
    brand: "Google",
    price: 699,
    ram: "8GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.2 inches",
    camera: "50MP Main, 12MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/417PLOtA3HL._SY300_SX300_.jpg",
  },
  {
    id: 30,
    name: "OnePlus 12R",
    brand: "OnePlus",
    price: 499,
    ram: "8GB",
    rom: "128GB",
    category: "mobiles",
    screen_size: "6.78 inches",
    camera: "50MP Main, 8MP Ultra-Wide, 2MP Macro",
    image_url: "https://m.media-amazon.com/images/I/41uPss3u3eL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 31,
    name: "Xiaomi 14",
    brand: "Xiaomi",
    price: 799,
    ram: "12GB",
    rom: "256GB",
    category: "Smartphone",
    screen_size: "6.36 inches",
    camera: "50MP Main, 50MP Ultra-Wide, 50MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/4166f5DXEEL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 32,
    name: "Realme GT 5 Pro",
    brand: "Realme",
    price: 599,
    ram: "12GB",
    rom: "256GB",
    category: "Smartphone",
    screen_size: "6.78 inches",
    camera: "50MP Main, 8MP Ultra-Wide, 50MP Periscope Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41WpAGDeZyL._SY300_SX300_.jpg",
  },
  {
    id: 33,
    name: "Motorola Edge 40 Neo",
    brand: "Motorola",
    price: 399,
    ram: "12GB",
    rom: "256GB",
    category: "Smartphone",
    screen_size: "6.55 inches",
    camera: "50MP Main, 13MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/41EhFsqRCLL._SY300_SX300_.jpg",
  },
  {
    id: 34,
    name: "Nothing Phone (2a)",
    brand: "Nothing",
    price: 349,
    ram: "8GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.7 inches",
    camera: "50MP Main, 50MP Ultra-Wide",
    image_url:
      "https://m.media-amazon.com/images/I/41gPGB5fW3L._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 35,
    name: "ASUS Zenfone 11 Ultra",
    brand: "ASUS",
    price: 999,
    ram: "16GB",
    rom: "512GB",
    category: "Smartphone",
    screen_size: "6.78 inches",
    camera: "50MP Main, 13MP Ultra-Wide, 32MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/51TBqqT-JyL._SX679_.jpg",
  },
  {
    id: 36,
    name: "Sony Xperia 5 V",
    brand: "Sony",
    price: 899,
    ram: "8GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.1 inches",
    camera: "48MP Main, 12MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/51fVh90niWL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 37,
    name: "Vivo iQOO 12",
    brand: "Vivo",
    price: 799,
    ram: "16GB",
    rom: "512GB",
    category: "Gaming Phone",
    screen_size: "6.78 inches",
    camera: "50MP Main, 50MP Ultra-Wide, 64MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/410smqMKxcL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 38,
    name: "Oppo Reno11 Pro 5G",
    brand: "Oppo",
    price: 549,
    ram: "12GB",
    rom: "256GB",
    category: "Smartphone",
    screen_size: "6.7 inches",
    camera: "50MP Main, 8MP Ultra-Wide, 32MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41Fvm7HOJML._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 39,
    name: "Honor 90",
    brand: "Honor",
    price: 499,
    ram: "12GB",
    rom: "512GB",
    category: "Smartphone",
    screen_size: "6.7 inches",
    camera: "200MP Main, 12MP Ultra-Wide, 2MP Depth",
    image_url: "https://m.media-amazon.com/images/I/419+MoEqpzL._SY300_SX300_.jpg",
  },
  {
    id: 40,
    name: "Huawei Mate 60 Pro+",
    brand: "Huawei",
    price: 1199,
    ram: "16GB",
    rom: "1TB",
    category: "Smartphone",
    screen_size: "6.82 inches",
    camera: "48MP Main, 40MP Ultra-Wide, 48MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/71ZrY8tNbNL._SX679_.jpg",
  },
  {
    id: 41,
    name: "iPhone 13 mini",
    brand: "Apple",
    price: 599,
    ram: "4GB",
    rom: "128GB",
    category: "Compact Smartphone",
    screen_size: "5.4 inches",
    camera: "12MP Wide, 12MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/71l5PwrKmUL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 42,
    name: "Samsung Galaxy A35",
    brand: "Samsung",
    price: 379,
    ram: "6GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.6 inches",
    camera: "50MP Main, 8MP Ultra-Wide, 5MP Macro",
    image_url: "https://m.media-amazon.com/images/I/51VfGGh7quL._SX300_SY300_QL70_FMwebp_.jpg",
  },
  {
    id: 43,
    name: "Google Pixel 7",
    brand: "Google",
    price: 599,
    ram: "8GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.3 inches",
    camera: "50MP Main, 12MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/71l5wYFiuTL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 44,
    name: "Redmi Note 13 5G",
    brand: "Xiaomi",
    price: 249,
    ram: "6GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.67 inches",
    camera: "108MP Main, 8MP Ultra-Wide, 2MP Macro",
    image_url: "https://m.media-amazon.com/images/I/71VW8LmqqPL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 45,
    name: "Realme 12+ 5G",
    brand: "Realme",
    price: 299,
    ram: "8GB",
    rom: "256GB",
    category: "Smartphone",
    screen_size: "6.67 inches",
    camera: "50MP Main, 8MP Ultra-Wide, 2MP Macro",
    image_url: "https://m.media-amazon.com/images/I/81tjPdhxKoL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 46,
    name: "Motorola G Power 5G",
    brand: "Motorola",
    price: 299,
    ram: "8GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.7 inches",
    camera: "50MP Main, 8MP Ultra-Wide",
    image_url: "https://m.media-amazon.com/images/I/31Ag98vEupL._AC_UY416_FMwebp_QL65_.jpg",
  },
  {
    id: 47,
    name: "POCO X6 Pro 5G",
    brand: "POCO",
    price: 359,
    ram: "12GB",
    rom: "512GB",
    category: "Gaming Phone",
    screen_size: "6.67 inches",
    camera: "64MP Main, 8MP Ultra-Wide, 2MP Macro",
    image_url: "https://m.media-amazon.com/images/I/61MOQVWuJaL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 48,
    name: "ASUS ROG Phone 7",
    brand: "ASUS",
    price: 999,
    ram: "16GB",
    rom: "512GB",
    category: "Gaming Phone",
    screen_size: "6.78 inches",
    camera: "50MP Main, 13MP Ultra-Wide, 5MP Macro",
    image_url: "https://m.media-amazon.com/images/I/51nOny-S5bL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 49,
    name: "Sony Xperia 10 V",
    brand: "Sony",
    price: 449,
    ram: "6GB",
    rom: "128GB",
    category: "Smartphone",
    screen_size: "6.1 inches",
    camera: "48MP Main, 8MP Ultra-Wide, 8MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/71IIxHUk3pL._AC_UY436_FMwebp_QL65_.jpg",
  },
  {
    id: 50,
    name: "Vivo V30 Pro",
    brand: "Vivo",
    price: 499,
    ram: "12GB",
    rom: "512GB",
    category: "Smartphone",
    screen_size: "6.78 inches",
    camera: "50MP Main, 50MP Ultra-Wide, 50MP Telephoto",
    image_url: "https://m.media-amazon.com/images/I/41jRBb+Gw-L._SY300_SX300_.jpg",
  },
];

export var selectedItems=[]
export const Product = () => {


  const [productValue,setProductValue] = useState(products)

  const[value,setValue] = useState('xyz')
  function filterData(){
    const filterdata = products.filter((data)=>data.id ===value)
    console.log(filterdata)
    setProductValue(filterdata)
  }
  function buyNow(items){
    selectedItems.push(items)
    localStorage.setItem("BuyItems",JSON.stringify(selectedItems))//this store data in ls.
    console.log(selectedItems)
  }
  return (
    <div className="shopping">
      <Container fluid>
        <Row className="row">
          {/* <Col>
            
            <div>
              {products.map((node) => (
                 <label>{node.brand}
                 <input className="w-100" type="checkbox" onChange={(e)=>{setValue(node.id)}} onClick={filterData} value ={value} key={products.name}/></label>

              ))}
              
            </div>
          </Col> */}

          {productValue.map((data) => (
            <Col sm={12} md={3}>
              <Card className="shop" style={{ width: "100%" }}>
                <Card.Img variant="top" src={data.image_url} className="item" />
                <Card.Body>
                  <Card.Title>{data.name}</Card.Title>
                  <Card.Text>{data.brand}</Card.Text>
                  <Card.Text>
                    Price:
                    {data.price >= parseFloat(100.0)
                      ? (data.price * 20) / 100
                      : data.price}
                  </Card.Text>
                 <div className="buttons">
                   <Button variant="primary">
                    <Plus /> Add to Cart{" "}
                  </Button>
                  <Button variant="primary" onClick={()=>{
                      buyNow(data.id)
                    }}>
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
            <BackToTop/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
