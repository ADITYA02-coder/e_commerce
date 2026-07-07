import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentUser, updateProfile } from "../slices/auth";
import { API_URL } from "../config/api";
import "../styles/Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [sellerForm, setSellerForm] = useState({
    shopName: "",
    phone: "",
    address: "",
    gstNumber: "",
    logo: ""
  });
  const [sellerApproved, setSellerApproved] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerSaving, setSellerSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    companyName: ""
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch, currentUser?.id]);

  useEffect(() => {
    const loadSellerProfile = async () => {
      if (!currentUser?.roles?.includes("ROLE_SELLER")) {
        return;
      }

      const token = JSON.parse(localStorage.getItem("user") || "{}")?.accessToken;
      if (!token) {
        return;
      }

      try {
        setSellerLoading(true);
        const response = await fetch(`${API_URL}/seller/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setSellerForm({
          shopName: data.shopName || "",
          phone: data.phone || "",
          address: data.address || "",
          gstNumber: data.gstNumber || "",
          logo: data.logo || ""
        });
        setSellerApproved(Boolean(data.isApproved));
      } catch (error) {
        console.error("Failed to load seller profile", error);
      } finally {
        setSellerLoading(false);
      }
    };

    loadSellerProfile();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setForm({
        fullName: currentUser.fullName || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        country: currentUser.country || "",
        bio: currentUser.bio || "",
        companyName: currentUser.companyName || ""
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateProfile(form));
  };

  const handleSellerChange = (event) => {
    const { name, value } = event.target;
    setSellerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSellerSubmit = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("user") || "{}")?.accessToken;

    if (!token) {
      alert("Please log in again to update seller profile.");
      return;
    }

    if (!sellerForm.shopName.trim()) {
      alert("Shop name is required.");
      return;
    }

    try {
      setSellerSaving(true);
      const response = await fetch(`${API_URL}/seller/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(sellerForm)
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || "Unable to save seller profile");
      }

      setSellerForm({
        shopName: payload.shopName || "",
        phone: payload.phone || "",
        address: payload.address || "",
        gstNumber: payload.gstNumber || "",
        logo: payload.logo || ""
      });
      setSellerApproved(Boolean(payload.isApproved));
      alert("Seller profile saved successfully.");
    } catch (error) {
      alert(error.message || "Unable to save seller profile");
    } finally {
      setSellerSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3>{currentUser.username}</h3>
            <p className="profile-subtitle">Manage your account details</p>
          </div>
        </div>

        <div className="profile-details">
          <div>
            <span>User ID</span>
            <strong>{currentUser.id}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{currentUser.email || "Not provided"}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{currentUser.roles?.join(", ") || "Customer"}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form mt-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input className="form-control" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">City</label>
              <input className="form-control" name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Country</label>
              <input className="form-control" name="country" value={form.country} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label">Bio</label>
              <textarea className="form-control" name="bio" rows="3" value={form.bio} onChange={handleChange} />
            </div>
            {currentUser.roles?.includes("ROLE_SELLER") && (
              <div className="col-md-12">
                <label className="form-label">Store / Company Name</label>
                <input className="form-control" name="companyName" value={form.companyName} onChange={handleChange} />
              </div>
            )}
          </div>
          <button className="btn btn-primary mt-3" type="submit">Save Profile</button>
        </form>

        {currentUser.roles?.includes("ROLE_SELLER") && (
          <form onSubmit={handleSellerSubmit} className="profile-form mt-4">
            <h4 className="mb-3">Seller Details</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Shop Name *</label>
                <input
                  className="form-control"
                  name="shopName"
                  value={sellerForm.shopName}
                  onChange={handleSellerChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  name="phone"
                  value={sellerForm.phone}
                  onChange={handleSellerChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Address</label>
                <input
                  className="form-control"
                  name="address"
                  value={sellerForm.address}
                  onChange={handleSellerChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">GST Number</label>
                <input
                  className="form-control"
                  name="gstNumber"
                  value={sellerForm.gstNumber}
                  onChange={handleSellerChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Logo URL</label>
                <input
                  className="form-control"
                  name="logo"
                  value={sellerForm.logo}
                  onChange={handleSellerChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Approval Status</label>
                <input
                  className="form-control"
                  value={sellerLoading ? "Loading..." : sellerApproved === null ? "Pending" : sellerApproved ? "Approved" : "Pending"}
                  readOnly
                />
              </div>
            </div>
            <button className="btn btn-primary mt-3" type="submit" disabled={sellerSaving}>
              {sellerSaving ? "Saving..." : "Save Seller Details"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
