import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
const SellerDashboard = () => {
  let navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  if (currentUser) {
    if (currentUser.roles[0] !== "ROLE_ADMIN") {
      navigate("/login");
    }
  } else {
    navigate("/login");
  }
  return (
    <div>
      <h1>Seller Page</h1>
      <p>
        Welcome to the seller's dashboard. Here you can manage your products,
        view orders, and update your profile.
      </p>
      <ul>
        <li>
          <a href="http://localhost:3000/addProduct">Add New Product</a>
        </li>
        <li>
          <a href="http://localhost:3000/viewProducts">View Added Products</a>
        </li>
        <li>
          <a href="http://localhost:3000/sellerOrders">View Orders</a>
        </li>
        <li>
          <a href="/updateProfile">Update Profile</a>
        </li>
      </ul>
      <p>For any assistance, please contact support.</p>
      <p>Thank you for being a valued seller!</p>
    </div>
  );
};

export default SellerDashboard;
