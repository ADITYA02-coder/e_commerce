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
    identityDocumentType: "passport",
    identityDocumentNumber: "",
    transparencyCode: ""
  });
  const [sellerExisting, setSellerExisting] = useState({
    logoUrl: "",
    identityDocumentUrl: "",
    bankStatementUrl: "",
    liveSelfieUrl: "",
    authorizationLetterUrl: "",
    invoiceUrl: "",
    verificationNotes: ""
  });
  const [sellerFiles, setSellerFiles] = useState({
    logoFile: null,
    identityDocumentFile: null,
    bankStatementFile: null,
    liveSelfieFile: null,
    authorizationLetterFile: null,
    invoiceFile: null
  });
  const [sellerApprovalState, setSellerApprovalState] = useState(null);
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
          identityDocumentType: data.identityDocumentType || "passport",
          identityDocumentNumber: data.identityDocumentNumber || "",
          transparencyCode: data.transparencyCode || ""
        });
        setSellerExisting({
          logoUrl: data.logo || "",
          identityDocumentUrl: data.identityDocumentUrl || "",
          bankStatementUrl: data.bankStatementUrl || "",
          liveSelfieUrl: data.liveSelfieUrl || "",
          authorizationLetterUrl: data.authorizationLetterUrl || "",
          invoiceUrl: data.invoiceUrl || "",
          verificationNotes: data.verificationNotes || ""
        });
        setSellerApprovalState(data.verificationStatus || (data.isApproved ? "approved" : "pending"));
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
    const { name, value, files } = event.target;

    if (files) {
      setSellerFiles((prev) => ({
        ...prev,
        [name]: files[0] || null
      }));
      return;
    }

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
      const formData = new FormData();

      Object.entries(sellerForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      Object.entries(sellerFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await fetch(`${API_URL}/seller/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
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
        identityDocumentType: payload.identityDocumentType || "passport",
        identityDocumentNumber: payload.identityDocumentNumber || "",
        transparencyCode: payload.transparencyCode || ""
      });
      setSellerExisting({
        logoUrl: payload.logo || "",
        identityDocumentUrl: payload.identityDocumentUrl || "",
        bankStatementUrl: payload.bankStatementUrl || "",
        liveSelfieUrl: payload.liveSelfieUrl || "",
        authorizationLetterUrl: payload.authorizationLetterUrl || "",
        invoiceUrl: payload.invoiceUrl || "",
        verificationNotes: payload.verificationNotes || ""
      });
      setSellerFiles({
        logoFile: null,
        identityDocumentFile: null,
        bankStatementFile: null,
        liveSelfieFile: null,
        authorizationLetterFile: null,
        invoiceFile: null
      });
      setSellerApprovalState(payload.verificationStatus || (payload.isApproved ? "approved" : "pending"));
      alert("Seller profile saved successfully.");
    } catch (error) {
      alert(error.message || "Unable to save seller profile");
    } finally {
      setSellerSaving(false);
    }
  };

  const sellerFileStatus = (file, existingUrl) => {
    if (file) {
      return file.name;
    }

    if (existingUrl) {
      return "Already uploaded";
    }

    return "No file selected";
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
                <label className="form-label">Shop Logo *</label>
                <input
                  className="form-control"
                  type="file"
                  name="logoFile"
                  accept="image/*"
                  onChange={handleSellerChange}
                />
                <small className="text-muted">{sellerFileStatus(sellerFiles.logoFile, sellerExisting.logoUrl)}</small>
              </div>
              <div className="col-md-6">
                <label className="form-label">Identity Document Type *</label>
                <select
                  className="form-control"
                  name="identityDocumentType"
                  value={sellerForm.identityDocumentType}
                  onChange={handleSellerChange}
                  required
                >
                  <option value="passport">Passport</option>
                  <option value="driver_license">Driver's License</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Identity Document Number *</label>
                <input
                  className="form-control"
                  name="identityDocumentNumber"
                  value={sellerForm.identityDocumentNumber}
                  onChange={handleSellerChange}
                  required
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Identity Document File *</label>
                <input
                  className="form-control"
                  type="file"
                  name="identityDocumentFile"
                  accept="image/*,.pdf"
                  onChange={handleSellerChange}
                  required
                />
                <small className="text-muted">{sellerFileStatus(sellerFiles.identityDocumentFile, sellerExisting.identityDocumentUrl)}</small>
              </div>
              <div className="col-md-12">
                <label className="form-label">Bank / Card Statement *</label>
                <input
                  className="form-control"
                  type="file"
                  name="bankStatementFile"
                  accept="image/*,.pdf"
                  onChange={handleSellerChange}
                  required
                />
                <small className="text-muted">{sellerFileStatus(sellerFiles.bankStatementFile, sellerExisting.bankStatementUrl)}</small>
              </div>
              <div className="col-md-12">
                <label className="form-label">Live Selfie / Video Call Capture *</label>
                <input
                  className="form-control"
                  type="file"
                  name="liveSelfieFile"
                  accept="image/*,.pdf,.mp4,.mov,.webm"
                  onChange={handleSellerChange}
                  required
                />
                <small className="text-muted">{sellerFileStatus(sellerFiles.liveSelfieFile, sellerExisting.liveSelfieUrl)}</small>
              </div>
              <div className="col-md-12">
                <label className="form-label">Brand Authorization Letter</label>
                <input
                  className="form-control"
                  type="file"
                  name="authorizationLetterFile"
                  accept="image/*,.pdf"
                  onChange={handleSellerChange}
                />
                <small className="text-muted">{sellerFileStatus(sellerFiles.authorizationLetterFile, sellerExisting.authorizationLetterUrl)}</small>
              </div>
              <div className="col-md-12">
                <label className="form-label">Wholesale Invoice</label>
                <input
                  className="form-control"
                  type="file"
                  name="invoiceFile"
                  accept="image/*,.pdf"
                  onChange={handleSellerChange}
                />
                <small className="text-muted">{sellerFileStatus(sellerFiles.invoiceFile, sellerExisting.invoiceUrl)}</small>
              </div>
              <div className="col-md-12">
                <label className="form-label">Transparency / Tracking Code</label>
                <input
                  className="form-control"
                  name="transparencyCode"
                  value={sellerForm.transparencyCode}
                  onChange={handleSellerChange}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Approval Status</label>
                <input
                  className="form-control"
                  value={
                    sellerLoading
                      ? "Loading..."
                      : sellerApprovalState === null
                        ? "Pending"
                        : sellerApprovalState
                  }
                  readOnly
                />
              </div>
              {sellerExisting.verificationNotes ? (
                <div className="col-md-12">
                  <label className="form-label">Review Note</label>
                  <textarea className="form-control" rows="3" value={sellerExisting.verificationNotes} readOnly />
                </div>
              ) : null}
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
