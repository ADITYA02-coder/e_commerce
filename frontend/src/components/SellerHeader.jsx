import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/sellerHeader.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Amazon } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/auth";

export const SellerHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="seller-header">
      <Container fluid>
        <div className="seller-brand">
          <Amazon />
          <span>Seller Console</span>
        </div>
        <Navbar.Toggle aria-controls="sellerNavbar" />
        <Navbar.Collapse id="sellerNavbar">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/seller">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/addProduct">Add Product</Nav.Link>
            <Nav.Link as={Link} to="/viewProducts">Products</Nav.Link>
            <Nav.Link as={Link} to="/sellerOrders">Orders</Nav.Link>
            <Nav.Link as={Link} to="/">Storefront</Nav.Link>
          </Nav>
          <Nav>
            {!currentUser ? (
              <>
                <Nav.Link as={Link} to="/signup">sign-up</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
