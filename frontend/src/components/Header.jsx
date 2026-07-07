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
import { API_URL } from "../config/api";
export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const { user: currentUser } = useSelector((state) => state.auth);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/cats`);
        if (!response.ok) return;
        const data = await response.json();
        const categoryNames = (Array.isArray(data) ? data : [])
          .map((item) => (item?.name || "").trim())
          .filter(Boolean);
        setCategories(Array.from(new Set(categoryNames)));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/product?q=${encodeURIComponent(query)}` : "/product");
  };

  return (
    <>
      <Navbar expand="lg" className="header">
        <Container fluid>
          <Navbar.Brand className="header-brand" onClick={() => navigate("/")}>
            <Amazon className="header-brand-icon" />
            <span>ShopEase</span>
          </Navbar.Brand>
          <div className="header-location" role="button" onClick={() => navigate("/address")}>
            <small>Deliver to</small>
            <strong>India</strong>
          </div>
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
              {currentUser?.roles?.includes("ROLE_SELLER") && (
                <Nav.Link as={Link} to="/seller">Seller Hub</Nav.Link>
              )}
              {currentUser?.roles?.includes("ROLE_ADMIN") && (
                <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
              )}
              <NavDropdown title="Category" id="navbarScrollingDropdown">
                {categories.length ? (
                  categories.map((category) => (
                    <NavDropdown.Item key={category} as={Link} to={`/category/${encodeURIComponent(category)}`}>
                      {category}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item as={Link} to="/product">
                    Browse all products
                  </NavDropdown.Item>
                )}
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
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <div className="header-subnav">
        <Container fluid>
          <div className="header-subnav-links">
            <Link to="/product">Today's Deals</Link>
            <Link to="/product">Customer Service</Link>
            <Link to="/seller">Sell</Link>
            {categories.slice(0, 6).map((category) => (
              <Link key={category} to={`/category/${encodeURIComponent(category)}`}>
                {category}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};
