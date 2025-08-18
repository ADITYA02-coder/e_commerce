import React from "react";
import "./header.css";
import Container from "react-bootstrap/Container";
import { List } from "react-bootstrap-icons";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Amazon } from "react-bootstrap-icons";
import { Link } from "react-router";
import { Cart} from "react-bootstrap-icons";
import Sidebar from "./Sidebar";
// import navigate  from "react-router-dom";



export const Header = () => {
  const[open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Navbar expand="lg" className="body" id="header">
        <Container fluid style={{}}>
          {/* <Amazon /> */}
          <Navbar.Brand href="">
            <button onClick={handleToggle}><List /></button>
            <Sidebar isOpen={open} />
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
                <Link to="/xyz">
                  <NavDropdown.Item>Login</NavDropdown.Item>
                </Link>
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
                  Electronics Items
                </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled>
                Prime
              </Nav.Link>
              <Link to ="/cart"><Cart/></Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
