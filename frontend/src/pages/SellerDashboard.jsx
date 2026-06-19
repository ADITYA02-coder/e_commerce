import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import "../styles/SellerDashboard.css";
const SellerDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  if (!currentUser || !currentUser.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }
  return (
    <div className="seller-dashboard">
      <section className="seller-hero">
        <div className="seller-hero__content">
          <span className="seller-badge">Seller Console</span>
          <h1>Seller Dashboard</h1>
          <p>
            Welcome to the seller's dashboard. Here you can manage your
            products, view orders, and update your profile.
          </p>
          <div className="seller-hero__actions">
            <Link className="seller-btn primary" to="/addProduct">
              Add New Product
            </Link>
            <Link className="seller-btn ghost" to="/sellerOrders">
              View Orders
            </Link>
          </div>
        </div>
        <div className="seller-hero__panel">
          <div className="seller-panel">
            <div className="seller-panel__header">
              <h2>Quick Actions</h2>
              <span className="seller-chip">Updated just now</span>
            </div>
            <ul className="seller-links">
              <li>
                <Link to="/addProduct">Add New Product</Link>
                <span>List a new item with pricing, photos, and stock.</span>
              </li>
              <li>
                <Link to="/viewProducts">View Added Products</Link>
                <span>Review inventory and edit active listings.</span>
              </li>
              <li>
                <Link to="/sellerOrders">View Orders</Link>
                <span>Track fulfillment status and shipment progress.</span>
              </li>
              <li>
                <Link to="/profile">Update Profile</Link>
                <span>Keep your store info and payout details current.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="seller-grid">
        <div className="seller-card highlight">
          <h3>Daily Focus</h3>
          <p>
            Prioritize listings with low stock and respond to new orders within
            24 hours to keep your store healthy.
          </p>
          <div className="seller-card__actions">
            <Link className="seller-btn subtle" to="/viewProducts">
              Review Inventory
            </Link>
          </div>
        </div>
        <div className="seller-card">
          <h3>Store Support</h3>
          <p>
            For any assistance, please contact support. We typically respond
            within one business day.
          </p>
          <p className="seller-muted">support@ecommerce.example</p>
        </div>
        <div className="seller-card">
          <h3>Seller Checklist</h3>
          <ul className="seller-checklist">
            <li>Confirm pricing and promotions for top sellers.</li>
            <li>Refresh product photos for newer listings.</li>
            <li>Verify shipping carriers for faster delivery.</li>
          </ul>
        </div>
      </section>

      <div className="seller-footer">
        <p>Thank you for being a valued seller!</p>
      </div>
    </div>
  );
};

export default SellerDashboard;
