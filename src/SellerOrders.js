import React from "react";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./SellerOrders.css";

const SellerOrders = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [rowdata, setrowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusValue, setOrderStatusValue] = useState("Pending");
  const [paymentStatusValue, setPaymentStatusValue] = useState("Pending");
  const [orderNote, setOrderNote] = useState("");

  // post the order update to the backend
  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
        const response = await fetch("http://localhost:8090/api/orders");
        if (!response.ok) {
          throw new Error(`HHTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setrowData(jsonData);
        console.log(jsonData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);
  if (!currentUser || !currentUser.roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/" />;
  }
  if (loading) return <div>Loading.....</div>;
  if (error) return <div>Error: {error.message}</div>;
  const handleClose = () => {
    setShow(false);
    setSelectedOrder(null);
    setOrderStatusValue("Pending");
    setPaymentStatusValue("Pending");
    setOrderNote("");
  };
  const handleShow = (order) => {
    setSelectedOrder(order);
    setOrderStatusValue(order?.orderStatus || "Pending");
    setPaymentStatusValue(order?.paymentStatus || "Pending");
    setOrderNote("");
    setShow(true);
  };
  const handleChange = () => {
    const updatedData = {
      orderStatus: orderStatusValue,
      paymentStatus: paymentStatusValue,
      note: orderNote || undefined,
    };
    if (selectedOrder) {
      updateOrder(selectedOrder.id, updatedData);

      alert("Status Updated Successfully");
      setShow(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Delete this delivered order? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8090/api/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setrowData((prev) => prev.filter((item) => item.id !== orderId));
    } catch (err) {
      setError(err);
      alert(`Failed to delete order: ${err.message}`);
    }
  };

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
        {rowdata
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
            {data.orderStatus === "Delivered" && (
              <Button
                variant="danger"
                className="seller-order-btn"
                onClick={() => handleDeleteOrder(data.id)}
              >
                Delete Order
              </Button>
            )}
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
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <p>Order Update::</p>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Optional note for internal tracking"
                />

                {/* update payment status too */}
                <p>
                  Payment Status:{" "}
                  {selectedOrder ? selectedOrder.paymentStatus : ""}
                </p>
                <select
                  value={paymentStatusValue}
                  onChange={(e) => setPaymentStatusValue(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
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
