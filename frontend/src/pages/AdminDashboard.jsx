import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

const AdminDashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = currentUser?.accessToken;
    if (!token) return;

    axios
      .get(`${API_URL}/auth/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAnalytics(response.data);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (!currentUser || !currentUser.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="mb-3">Admin Control Center</h2>
          <p className="text-muted">Monitor users, manage storefront access, and guide your marketplace operations.</p>

          {loading ? (
            <p>Loading analytics...</p>
          ) : analytics ? (
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <div className="border rounded p-3">
                  <h5>Total Users</h5>
                  <h2 className="mb-0">{analytics.totalUsers}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border rounded p-3">
                  <h5>Customers</h5>
                  <h2 className="mb-0">{analytics.customers}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border rounded p-3">
                  <h5>Sellers</h5>
                  <h2 className="mb-0">{analytics.sellers}</h2>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 d-flex gap-2 flex-wrap">
            <Link className="btn btn-primary" to="/addProduct">Manage Products</Link>
            <Link className="btn btn-outline-secondary" to="/profile">Update Profile</Link>
            <Link className="btn btn-outline-dark" to="/">Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
