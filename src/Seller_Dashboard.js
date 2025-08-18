import React from 'react'

const Seller_Dashboard = () => {
  return (
    <div>
        <h1>Seller Page</h1>
        <p>Welcome to the seller's dashboard. Here you can manage your products, view orders, and update your profile.</p>
        <ul>
            <li><a href="http://localhost:3000/addProduct">Add New Product</a></li>
            <li><a href="http://localhost:3000/abc">View Products</a></li>
            <li><a href="http://localhost:3000/sellerOrders">View Orders</a></li>
            <li><a href="/updateProfile">Update Profile</a></li>
        </ul>
        <p>For any assistance, please contact support.</p>
        <p>Thank you for being a valued seller!</p>

    </div>
  )
}

export default Seller_Dashboard
