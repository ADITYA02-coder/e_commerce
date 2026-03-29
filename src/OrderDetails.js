import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import "./OrderDetails.css";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);


  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8090/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
        fetchAllProducts(data); // trigger product fetching
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch all unique products from order list
  const fetchAllProducts = async (orders) => {
    const uniqueProductIds = new Set();
    orders.forEach(order => {
      order.items.forEach(item => uniqueProductIds.add(item.productId));
    });

    const productEntries = await Promise.all(
      Array.from(uniqueProductIds).map(async (id) => {
        try {
          const res = await fetch(`http://localhost:8090/api/products/${id}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          return [id, data]; // [productId, productDetails]
        } catch {
          return [id, { name: "Unknown Product", imageUrl: "" }];
        }
      })
    );

    const productMap = Object.fromEntries(productEntries);
    setProducts(productMap);
  };

  const userOrders = useMemo(() => {
    if (!currentUser) return orders;
    const id = currentUser.id;
    return orders.filter(
      (order) =>
        order.userId === id ||
        order.userId === String(id) ||
        order.user?.id === id ||
        order.user?.id === String(id)
    );
  }, [orders, currentUser]);

  if (loading) return <div className="order-details__state">Loading orders...</div>;
  if (error) return <div className="order-details__state">Error: {error}</div>;

  return (
    <div className="order-details">
      <div className="order-details__header">
        <span className="order-details__badge">My Orders</span>
        <h2>Order History</h2>
        <p>Track delivery progress and updated status from the seller.</p>
      </div>
      {userOrders.length === 0 ? (
        <p className="order-details__empty">No orders found.</p>
      ) : (
        userOrders.map((order, index) => (
          <div key={order.id} className="order-card">
            <div className="order-card__header">
              <div>
                <h4>Order #{index + 1}</h4>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="order-card__summary">
                <span>Total</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>

            <div className="order-card__status">
              <div>
                <span>Order Status</span>
                <strong>{order.orderStatus}</strong>
              </div>
              <div>
                <span>Payment Status</span>
                <strong>{order.paymentStatus}</strong>
              </div>
            </div>

            {order.note && (
              <div className="order-card__note">
                <span>Admin Note</span>
                <p>{order.note}</p>
              </div>
            )}

            {order.addressLine1 && (
              <>
                <h5>Delivery Address:</h5>
                <p>{order.addressLine1}, {order.addressLine2}</p>
                <p>{order.district}, {order.state} - {order.pin}</p>
                <p>Mobile: {order.mobile}</p>
              </>
            )}

            <h5>Items:</h5>
            <ul className="order-card__items">
              {order.items.map((item, idx) => {
                const product = products[item.productId] || { name: "Loading...", image: "" };
                return (
                  <li key={item._id || idx} className="order-card__item">
                    {product.image && (
                      <img
                        src={`http://localhost:8090/uploads/${product.image}`}
                        alt={product.name}
                      />
                    )}
                    <div>
                      <p><strong>{product.name}</strong></p>
                      <p>Quantity: {item.quantity} | Price: ₹{item.price}</p>
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

export default OrderDetails;
