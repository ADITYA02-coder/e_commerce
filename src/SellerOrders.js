import React from "react";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const SellerOrders = () => {
  let navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  if (currentUser) {
    if (currentUser.roles[0] !== "ROLE_ADMIN") {
      navigate("/login");
    }
  } else {
    navigate("/login");
  }
  const [rowdata, setrowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  if (loading) return <div>Loading.....</div>;
  if (error) return <div>Error: {error.message}</div>;
  const handleClose = () => {
    setShow(false);
    setSelectedOrder(null);
  };
  const handleShow = (order) => {
    setSelectedOrder(order);
    setShow(true);
  };
  const handleChange = () => {
    const selectedOption = document.querySelector("select").value;
    const paymentOption = document.querySelectorAll("select")[1].value;
    const updatedData = {
      orderStatus: selectedOption,
      paymentStatus: paymentOption,
      // Include any other fields you want to update
    };
    if (selectedOrder) {
      updateOrder(selectedOrder.id, updatedData);

      alert("Status Updated Successfully");
      setShow(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div>
      <h1>Users Orders</h1>
      {rowdata
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((data, idx) => (
          <div key={idx}>
            <Table striped bordered hover size="sm">
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
            <Button variant="primary" onClick={() => handleShow(data)}>
              Update Status
            </Button>
            <Modal
              show={show && selectedOrder && selectedOrder.id === data.id}
              onHide={handleClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Order Status: {selectedOrder ? selectedOrder.orderStatus : ""}
                </p>
                <select
                  defaultValue={
                    selectedOrder ? selectedOrder.orderStatus : "Pending"
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <p>Order Update::</p>
                <textarea rows={2} />

                {/* update payment status too */}
                <p>
                  Payment Status:{" "}
                  {selectedOrder ? selectedOrder.paymentStatus : ""}
                </p>
                <select
                  defaultValue={
                    selectedOrder ? selectedOrder.paymentStatus : "Pending"
                  }
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
  );
};
export default SellerOrders;
