import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentUser, updateProfile } from "../slices/auth";
import "../styles/Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
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
      </div>
    </div>
  );
};

export default Profile;
