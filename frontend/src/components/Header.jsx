import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Amazon } from "react-bootstrap-icons";
import { Cart } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/auth";
export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState("");
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate("/product");
  };

  return (
    <>
      <Navbar expand="lg" className="header">
        <Container fluid>
          <Navbar.Brand className="header-brand" onClick={() => navigate("/")}>
            <Amazon className="header-brand-icon" />
            <span>ShopEase</span>
          </Navbar.Brand>
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/product">Products</Nav.Link>
              <Nav.Link as={Link} to="/account">Account</Nav.Link>
              <NavDropdown title="Category" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/category/mobiles">
                  Mobiles, Computers
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/mens">
                  Men's Fashion
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/women">
                  Women's Fashion
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/kids">
                  Kids
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/electronics">
                  Electronics Items
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link disabled>Prime</Nav.Link>
              <Nav.Link as={Link} to="/cart" className="header-cart">
                <Cart /> Cart
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav>
            {!currentUser ? (
              <>
                <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
