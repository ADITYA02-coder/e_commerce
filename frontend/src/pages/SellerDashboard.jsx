import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";
import "../styles/SellerDashboard.css";

const SellerDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [sellerStatus, setSellerStatus] = useState("loading");
  const [sellerMessage, setSellerMessage] = useState("");
  const [sellerNote, setSellerNote] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const canAccessSellerDashboard = currentUser?.roles?.includes("ROLE_SELLER");

  useEffect(() => {
    const loadSellerData = async () => {
      const token = currentUser?.accessToken;
      if (!token || !canAccessSellerDashboard) {
        setLoading(false);
        return;
      }

      try {
        const sellerResponse = await fetch(`${API_URL}/seller/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!sellerResponse.ok) {
          setSellerStatus("missing");
          setSellerMessage("Create your shop profile before you can manage products and orders.");
          setLoading(false);
          return;
        }

        const seller = await sellerResponse.json();
        const status = seller.verificationStatus || (seller.isApproved ? "approved" : "pending");
        setSellerStatus(status);
        setSellerNote(seller.verificationNotes || "");

        if (status !== "approved") {
          setSellerMessage(
            status === "rejected"
              ? "Your seller application was rejected. Review the note below, update your documents, and submit again."
              : "Your seller application is waiting for admin approval."
          );
          setLoading(false);
          return;
        }

        const productsResponse = await fetch(`${API_URL}/products/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (productsResponse.ok) {
          const products = await productsResponse.json();
          setProductCount(Array.isArray(products) ? products.length : 0);
        }

        setSellerMessage("");
      } catch (error) {
        setSellerStatus("pending");
        setSellerMessage("Unable to load seller console right now.");
        console.error("Failed to load seller dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [currentUser, canAccessSellerDashboard]);

  if (!currentUser || !canAccessSellerDashboard) {
    return <Navigate to="/" />;
  }

  return (
    <div className="seller-dashboard">
      <section className="seller-hero">
        <div className="seller-hero__content">
          <span className="seller-badge">Seller Console</span>
          <h1>Seller Dashboard</h1>
          <p>
            Manage your own products and orders from one place after your shop is approved.
          </p>
          <div className={`seller-status-banner seller-status-banner--${sellerStatus}`}>
            <strong>
              {loading
                ? "Checking approval status..."
                : sellerStatus === "approved"
                  ? "Approved seller"
                  : sellerStatus === "rejected"
                    ? "Seller rejected"
                    : "Pending approval"}
            </strong>
            <span>
              {loading
                ? "Loading your seller profile and inventory."
                : sellerMessage || "Your seller profile is ready."}
            </span>
            {sellerStatus === "rejected" && sellerNote ? (
              <p className="seller-status-banner__note">Admin note: {sellerNote}</p>
            ) : null}
          </div>
          <div className="seller-hero__actions">
            {sellerStatus === "approved" ? (
              <>
                <Link className="seller-btn primary" to="/addProduct">
                  Add New Product
                </Link>
                <Link className="seller-btn ghost" to="/sellerOrders">
                  View Orders
                </Link>
              </>
            ) : (
              <Link className="seller-btn primary" to="/profile">
                Complete Seller Profile
              </Link>
            )}
          </div>
        </div>
        <div className="seller-hero__panel">
          <div className="seller-panel">
            <div className="seller-panel__header">
              <h2>Approval Status</h2>
              <span className="seller-chip">
                {loading ? "Checking..." : sellerStatus}
              </span>
            </div>
            <p className="seller-muted">
              {loading
                ? "Loading your seller profile and inventory..."
                : sellerMessage || "Your seller console is ready."}
            </p>
            <ul className="seller-links">
              <li className={sellerStatus === "approved" ? "" : "is-locked"}>
                {sellerStatus === "approved" ? (
                  <Link to="/viewProducts">View Added Products</Link>
                ) : (
                  <span className="seller-links__locked-label">View Added Products</span>
                )}
                <span>
                  {sellerStatus === "approved"
                    ? `${productCount} item(s) in your catalog.`
                    : "Locked until your seller profile is approved."}
                </span>
              </li>
              <li className={sellerStatus === "approved" ? "" : "is-locked"}>
                {sellerStatus === "approved" ? (
                  <Link to="/sellerOrders">View Orders</Link>
                ) : (
                  <span className="seller-links__locked-label">View Orders</span>
                )}
                <span>
                  {sellerStatus === "approved"
                    ? "Track only the orders for your products."
                    : "Orders are hidden until approval is granted."}
                </span>
              </li>
              <li>
                <Link to="/profile">Update Profile</Link>
                <span>Keep verification documents and shop details current.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="seller-grid">
        <div className="seller-card highlight">
          <h3>Daily Focus</h3>
          <p>
            {sellerStatus === "approved"
              ? "Review stock levels, keep product data current, and respond quickly to new orders."
              : "Complete verification and wait for admin approval before opening your product and order tools."}
          </p>
          <div className="seller-card__actions">
            {sellerStatus === "approved" ? (
              <Link className="seller-btn subtle" to="/viewProducts">
                Review Inventory
              </Link>
            ) : (
              <Link className="seller-btn subtle is-disabled" to="/profile">
                Finish Verification
              </Link>
            )}
          </div>
        </div>
        <div className="seller-card">
          <h3>Store Support</h3>
          <p>
            For any assistance, please contact support. We typically respond within one business day.
          </p>
          <p className="seller-muted">support@ecommerce.example</p>
        </div>
        <div className="seller-card">
          <h3>Seller Checklist</h3>
          <ul className="seller-checklist">
            <li>Complete identity and bank verification.</li>
            <li>Wait for admin approval before adding products.</li>
            <li>Review your product and order queues daily.</li>
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
