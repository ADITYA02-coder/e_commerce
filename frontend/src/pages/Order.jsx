import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL, getAssetUrl } from "../config/api";
import authHeader from "../services/auth-header";
import "../styles/style.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) return;

    const fetchAllProducts = async (orderData) => {
      const uniqueProductIds = new Set();
      orderData.forEach((order) => {
        (order.items || []).forEach((item) => uniqueProductIds.add(item.productId));
      });

      const productEntries = await Promise.all(
        Array.from(uniqueProductIds).map(async (id) => {
          try {
            const res = await fetch(`${API_URL}/products/${id}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            return [id, data];
          } catch {
            return [id, { name: "Unknown Product", image: "" }];
          }
        })
      );

      setProducts(Object.fromEntries(productEntries));
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders`, { headers: authHeader() });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
        await fetchAllProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) return <div className="order-page">Please log in to view orders.</div>;
  if (loading) return <div className="order-page">Loading orders...</div>;
  if (error) return <div className="order-page order-error">Error: {error}</div>;

  return (
    <div className="order-page">
      <div className="order-page__header">
        <span>Your marketplace activity</span>
        <h2>Order History</h2>
        <p>Track purchases, payments, and delivery progress in one place.</p>
      </div>

      {orders.length === 0 ? (
        <div className="order-empty">No orders found.</div>
      ) : (
        orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order, index) => (
            <div key={order.id} className="order-card">
              <div className="order-card__top">
                <div>
                  <h4>Order #{index + 1}</h4>
                  <p>Order ID: {order.id}</p>
                  <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-card__badges">
                  <span>{order.orderStatus}</span>
                  <span>{order.paymentStatus}</span>
                </div>
              </div>

              <div className="order-total">
                Total: Rs. {Number(order.totalAmount || 0).toLocaleString("en-IN")}
              </div>

              {order.addressLine1 ? (
                <div className="order-address">
                  <h5>Delivery Address</h5>
                  <p>{order.addressLine1}, {order.addressLine2}</p>
                  <p>{order.district}, {order.state} - {order.pin}</p>
                  <p>Mobile: {order.mobile}</p>
                </div>
              ) : null}

              <h5>Items</h5>
              <ul className="order-items">
                {(order.items || []).map((item, idx) => {
                  const product = products[item.productId] || {
                    name: "Loading...",
                    image: "",
                  };

                  return (
                    <li key={item._id || idx}>
                      {(product.primaryImage || product.image) && (
                        <img
                          src={getAssetUrl(product.primaryImage || product.image)}
                          alt={product.name}
                        />
                      )}
                      <div>
                        <p><strong>{product.name}</strong></p>
                        <p>Quantity: {item.quantity} | Price: Rs. {item.price}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
      )}
    </div>
  );
};

export default Order;
