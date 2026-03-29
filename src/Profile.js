import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import "./Profile.css";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const role = currentUser.roles;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const tokenPreview = currentUser.accessToken
    ? `${currentUser.accessToken.substring(0, 12)}...${currentUser.accessToken.substr(
        currentUser.accessToken.length - 12
      )}`
    : "Not available";

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h3>{currentUser.username}</h3>
            <p className="profile-subtitle">Account Overview</p>
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
            <span>Access Token</span>
            <strong>{tokenPreview}</strong>
          </div>
        </div>

        <div className="profile-roles">
          <h4>Authorities</h4>
          <div className="profile-role-list">
            {role && role.map((r) => <span key={r}>{r}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
