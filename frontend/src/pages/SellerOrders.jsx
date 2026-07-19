import React from "react";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/SellerOrders.css";
import { API_URL } from "../config/api";

const SellerOrders = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [rowdata, setrowData] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusValue, setOrderStatusValue] = useState("Pending");
  const [orderNote, setOrderNote] = useState("");
  const [sellerStatus, setSellerStatus] = useState("loading");
  const [sellerMessage, setSellerMessage] = useState("");

  const token = currentUser?.accessToken;

  // post the order update to the backend
  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setrowData((prevData) =>
        prevData.map((item) => (item.id === orderId ? jsonData : item))
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!currentUser?.roles?.includes("ROLE_SELLER")) {
          setSellerStatus("missing");
          setLoading(false);
          return;
        }

        if (!token) {
          setSellerStatus("missing");
          setSellerMessage("Sign in again to view your orders.");
          setLoading(false);
          return;
        }

        const sellerResponse = await fetch(`${API_URL}/seller/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!sellerResponse.ok) {
          setSellerStatus("missing");
          setSellerMessage("Complete your seller profile before viewing orders.");
          setLoading(false);
          return;
        }

        const seller = await sellerResponse.json();
        const status = seller.verificationStatus || (seller.isApproved ? "approved" : "pending");
        setSellerStatus(status);

        if (status !== "approved") {
          setSellerMessage("Your seller application is waiting for admin approval.");
          setLoading(false);
          return;
        }

        const [ordersResponse, productsResponse] = await Promise.all([
          fetch(`${API_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/products/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!ordersResponse.ok) {
          throw new Error(`HHTP error! status: ${ordersResponse.status}`);
        }

        if (productsResponse.ok) {
          const sellerProductsData = await productsResponse.json();
          setSellerProducts(Array.isArray(sellerProductsData) ? sellerProductsData : []);
        }

        const jsonData = await ordersResponse.json();
        setrowData(jsonData);
        console.log(jsonData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [currentUser, token]);
  if (!currentUser || !currentUser.roles?.includes("ROLE_SELLER")) {
    return <Navigate to="/" />;
  }
  if (sellerStatus !== "approved" && !loading) {
    return (
      <div className="seller-orders">
        <div className="seller-orders__header">
          <div>
            <span className="seller-orders__badge">Seller Console</span>
            <h1>Seller Orders</h1>
            <p>{sellerMessage || "Complete and approve your seller profile before viewing orders."}</p>
          </div>
        </div>
      </div>
    );
  }
  if (loading) return <div>Loading.....</div>;
  if (error) return <div>Error: {error.message}</div>;
  const handleClose = () => {
    setShow(false);
    setSelectedOrder(null);
    setOrderStatusValue("Pending");
    setOrderNote("");
  };
  const handleShow = (order) => {
    setSelectedOrder(order);
    setOrderStatusValue(order?.orderStatus || "Pending");
    setOrderNote("");
    setShow(true);
  };
  const handleChange = () => {
    const updatedData = {
      orderStatus: orderStatusValue,
      note: orderNote || undefined,
    };
    if (selectedOrder) {
      updateOrder(selectedOrder.id, updatedData);

      alert("Status Updated Successfully");
      setShow(false);
      setSelectedOrder(null);
    }
  };

  const sellerProductIds = new Set(sellerProducts.map((product) => String(product.id || product._id)));
  const visibleOrders = rowdata.filter((order) =>
    (order.items || []).some((item) => sellerProductIds.has(String(item.productId)))
  );

  return (
    <div className="seller-orders">
      <div className="seller-orders__header">
        <div>
          <span className="seller-orders__badge">Seller Console</span>
          <h1>Seller Orders</h1>
          <p>Review incoming orders, update statuses, and track fulfillment.</p>
        </div>
      </div>
      <div className="seller-orders__list">
        {visibleOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((data, idx) => (
          <div key={idx} className="seller-order-card">
            <div className="seller-order-meta">
              <div>
                <h2>Order #{data.id}</h2>
                <span>
                  Placed {new Date(data.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="seller-order-total">
                <span>Total Amount</span>
                <strong>₹{data.totalAmount}</strong>
              </div>
            </div>
            <Table striped bordered hover size="sm" className="seller-order-table">
              <thead>
                <tr>
                  <th>S_No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productId}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price * item.quantity}</td>
                      <td>{data.totalAmount}</td>
                      <td>{data.paymentStatus}</td>
                      <td>{data.orderStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="seller-order-actions">
              <div className="seller-order-status">
                <span>Payment: {data.paymentStatus}</span>
                <span>Order: {data.orderStatus}</span>
              </div>
              <Button
                variant="primary"
                className="seller-order-btn"
                onClick={() => handleShow(data)}
              >
              Update Status
            </Button>
            </div>
            <Modal
              show={show && selectedOrder && selectedOrder.id === data.id}
              onHide={handleClose}
              dialogClassName="seller-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Order Status: {selectedOrder ? selectedOrder.orderStatus : ""}
                </p>
                <select
                  value={orderStatusValue}
                  onChange={(e) => setOrderStatusValue(e.target.value)}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <p>Order Update::</p>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Optional note for internal tracking"
                />

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="success" onClick={handleChange}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SellerOrders;
