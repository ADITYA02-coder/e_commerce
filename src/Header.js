import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { List } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Amazon } from "react-bootstrap-icons";
import { data, Link } from "react-router";
import { products } from "./Product";

// import { products } from "./data";

export var searchData;

export const Header = () => {

 const [value, setValue] = useState("");
  const [filterData, setFilterData] = useState([])
  const [shopData,setshopData]=useState(products)

  const searchFunctionality = () => {
      
      const names = products.filter((products) => {
            return products.title.includes(value)
         });
         console.log("names ",names)
         setFilterData(names)
         console.log("filtred data ",filterData)
         setshopData(names)
    
  }
  // const [filter, setFilter] = useState([])

  // const categorySelectFunctionality = () => {
      
  //     const select = products.filter((product) => {
  //           return product.category.includes("Mobiles")
  //        });
  //        console.log("names ",select)
  //        setFilter(select)
  //        console.log(filter)
         
    
  // }
  
  return (
    <>
      <Navbar expand="lg" className="body">
        <Container fluid style={{}}>
          <Amazon />
          <Navbar.Brand href="#">
            <List />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link to="/home">
                <Nav.Link href="#action1">Home</Nav.Link>
              </Link>
              <Link to="/product">
                <Nav.Link href="#action2">Products</Nav.Link>
              </Link>
              <NavDropdown title="Sign-in Options" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Login</NavDropdown.Item>
                <Link to="/sign">
                  <NavDropdown.Item href="#action4">
                    New User?Create an account
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Forget Password?
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Category" id="navbarScrollingDropdown">
                <NavDropdown.Item><Link to="/category/mobiles">Mobiles,Computers</Link></NavDropdown.Item>
                
                  <NavDropdown.Item><Link to="/category/mens">
                    Men's Fashion
                  </Link>
                  </NavDropdown.Item>
                <NavDropdown.Item><Link to ="/category/women">
                  Women's Fashion
                </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action5"><Link to ="/category/kids">
                  Kids
                </Link>
                </NavDropdown.Item>
                <NavDropdown.Item href="#action5"><Link to ="/category/electronics">
                  TV,Appliances,Electronics
                </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled>
                Prime
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => {
                  setValue(e.target.value);
                  console.log(e.target.value);
                }}
              />
              <Button variant="outline-success" onClick={()=>{searchFunctionality()}}>
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {filterData.map((products) => (
        <h2>{products.title}</h2>
      ))}
    </>
  );
};
