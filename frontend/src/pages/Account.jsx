import React from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, BoxSeam, CreditCard, GeoAlt, PersonCircle, ShieldLock, Shop, LifePreserver, ClockHistory, Tag } from "react-bootstrap-icons";
import "../styles/Account.css";

const Account = () => {
  const location = useLocation();
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const roles = currentUser.roles || [];
  const isSeller = roles.includes("ROLE_SELLER");
  const isAdmin = roles.includes("ROLE_ADMIN");
  const avatarLabel = (currentUser.username || currentUser.email || "U").charAt(0).toUpperCase();

  const quickLinks = [
    {
      title: "Your orders",
      description: "Track deliveries, returns, and repeat purchases.",
      to: "/orderDetails",
      icon: BoxSeam,
      tone: "warm"
    },
    {
      title: "Login & security",
      description: "Update password, email, and sign-in details.",
      to: "/profile",
      icon: ShieldLock,
      tone: "cool"
    },
    {
      title: "Your addresses",
      description: "Manage shipping and billing destinations.",
      to: "/address",
      icon: GeoAlt,
      tone: "gold"
    },
    {
      title: "Payment options",
      description: "Review cards, wallet settings, and checkout methods.",
      to: "/payment",
      icon: CreditCard,
      tone: "neutral"
    },
    {
      title: "Customer support",
      description: "Find help for orders, refunds, and account issues.",
      to: "/orderDetails",
      icon: LifePreserver,
      tone: "support"
    },
    ...(isSeller
      ? [
          {
            title: "Seller hub",
            description: "Manage listings, orders, and seller profile details.",
            to: "/seller",
            icon: Shop,
            tone: "seller"
          }
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: "Admin tools",
            description: "Review the marketplace, approvals, and moderation.",
            to: "/admin",
            icon: Tag,
            tone: "admin"
          }
        ]
      : [])
  ];

  const stats = [
    { label: "Member", value: currentUser.username || "Customer" },
    { label: "Email", value: currentUser.email || "Not set" },
    { label: "Role", value: roles.length ? roles.join(", ") : "Customer" }
  ];

  return (
    <div className="account-page">
      <section className="account-hero">
        <div className="account-hero__content">
          <span className="account-hero__eyebrow">Your account</span>
          <div className="account-hero__title-row">
            <div className="account-avatar" aria-hidden="true">
              {avatarLabel}
            </div>
            <div>
              <h1>Hi, {currentUser.username || "there"}</h1>
              <p>
                Manage your orders, addresses, payments, and store settings from one
                focused dashboard.
              </p>
            </div>
          </div>
          <div className="account-hero__actions">
            <Link className="account-cta account-cta--primary" to="/orderDetails">
              View orders
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="account-cta account-cta--secondary" to="/profile">
              Edit profile
            </Link>
          </div>
        </div>

        <aside className="account-hero__panel">
          <span className="account-hero__panel-label">Account snapshot</span>
          <div className="account-hero__panel-grid">
            {stats.map((stat) => (
              <div className="account-stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="account-section">
        <div className="account-section__heading">
          <div>
            <span className="account-section__eyebrow">Quick actions</span>
            <h2>Everything you need is one click away</h2>
          </div>
          <p>
            A compact control center for shopping, account security, and seller tools.
          </p>
        </div>

        <div className="account-grid">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.title} className={`account-card account-card--${item.tone}`} to={item.to}>
                <div className="account-card__icon">
                  <Icon aria-hidden="true" />
                </div>
                <div className="account-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="account-card__footer">
                  Open
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="account-section account-section--split">
        <div className="account-panel">
          <span className="account-section__eyebrow">Shopping shortcuts</span>
          <h2>Make repeat tasks effortless</h2>
          <p>
            Jump straight to the places customers usually visit most often.
          </p>
          <div className="account-shortcuts">
            <Link to="/orderDetails">
              <BoxSeam aria-hidden="true" />
              Orders & returns
            </Link>
            <Link to="/address">
              <GeoAlt aria-hidden="true" />
              Address book
            </Link>
            <Link to="/payment">
              <CreditCard aria-hidden="true" />
              Payment methods
            </Link>
            <Link to="/profile">
              <PersonCircle aria-hidden="true" />
              Profile details
            </Link>
          </div>
        </div>

        <div className="account-panel account-panel--highlight">
          <span className="account-section__eyebrow">Need a hand?</span>
          <h2>Support and service</h2>
          <p>
            Check order status, review shipping details, or continue into the help flow
            that already exists in your store.
          </p>
          <Link className="account-support-link" to="/orderDetails">
            <ClockHistory aria-hidden="true" />
            Review recent orders
          </Link>
          <p className="account-panel__meta">
            Signed in as <strong>{currentUser.username || currentUser.email || "customer"}</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Account;
