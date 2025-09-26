import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) return; // ✅ avoid API call if user is not logged in

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8090/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        setOrders(data);
        fetchAllProducts(data); // fetch products after orders
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const fetchAllProducts = async (orders) => {
    const uniqueProductIds = new Set();
    orders.forEach((order) => {
      (order.items || []).forEach((item) =>
        uniqueProductIds.add(item.productId)
      );
    });

    const productEntries = await Promise.all(
      Array.from(uniqueProductIds).map(async (id) => {
        console.log("id ",id);
        try {
          const res = await fetch(`http://localhost:8090/api/products/${id}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          return [id, data];
        } catch {
          return [id, { name: "Unknown Product", imageUrl: "" }];
        }
      })
    );

    setProducts(Object.fromEntries(productEntries));
  };

  if (!currentUser) return <div>Please log in to view orders.</div>;
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        //sort orders by date, most recent first
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order, index) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "8px",
            }}
          >
            <h4>Order #{index + 1}</h4>
            <p>
              <strong>User ID:</strong> {currentUser?.id}
            </p>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Order placed on:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentStatus}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>

            {order.addressLine1 && (
              <>
                <h5>Delivery Address:</h5>
                <p>
                  {order.addressLine1}, {order.addressLine2}
                </p>
                <p>
                  {order.district}, {order.state} - {order.pin}
                </p>
                <p>Mobile: {order.mobile}</p>
              </>
            )}

            <h5>Items:</h5>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {(order.items || []).map((item, idx) => {
                const product = products[item.productId] || {
                  name: "Loading...",
                  imageUrl: "",
                };

                return (
                  <li
                    key={item._id || idx}
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {product.imageUrl && (
                      <img
                        src={`http://localhost:8090/uploads/${product.imageUrl}`}
                        alt={product.name}
                        style={{
                          width: 50,
                          height: 50,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                    <div>
                      <p>
                        <strong>{product.name}</strong>
                      </p>
                      <p>
                        Quantity: {item.quantity} | Price: ₹{item.price}
                      </p>
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
