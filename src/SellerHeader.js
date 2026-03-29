import React from "react";
import { useNavigate } from "react-router-dom";
import "./sellerHeader.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Amazon } from "react-bootstrap-icons";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./slices/auth";

export const SellerHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    window.location.reload();
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
            <Link to="/seller">
              <Nav.Link href="#seller">Dashboard</Nav.Link>
            </Link>
            <Link to="/addProduct">
              <Nav.Link href="#addProduct">Add Product</Nav.Link>
            </Link>
            <Link to="/viewProducts">
              <Nav.Link href="#viewProducts">Products</Nav.Link>
            </Link>
            <Link to="/sellerOrders">
              <Nav.Link href="#sellerOrders">Orders</Nav.Link>
            </Link>
            <Link to="/">
              <Nav.Link href="#store">Storefront</Nav.Link>
            </Link>
          </Nav>
          <Nav>
            {!currentUser ? (
              <>
                <Nav.Link href="/signup">sign-up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
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
