import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./SellerDashboard.css";
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
            <a className="seller-btn primary" href="/addProduct">
              Add New Product
            </a>
            <a className="seller-btn ghost" href="/sellerOrders">
              View Orders
            </a>
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
                <a href="/addProduct">Add New Product</a>
                <span>List a new item with pricing, photos, and stock.</span>
              </li>
              <li>
                <a href="/viewProducts">View Added Products</a>
                <span>Review inventory and edit active listings.</span>
              </li>
              <li>
                <a href="/sellerOrders">View Orders</a>
                <span>Track fulfillment status and shipment progress.</span>
              </li>
              <li>
                <a href="/updateProfile">Update Profile</a>
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
            <a className="seller-btn subtle" href="/viewProducts">
              Review Inventory
            </a>
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
