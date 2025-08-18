import React from "react";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Seller_Orders = () => {
  const [rowdata, setrowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);

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

  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <h1>Users Orders</h1>
      {rowdata.map((data) => (
        <>
          <h3>Order Id : {data.id}</h3>
          <p>Payment Status : {data.paymentStatus}</p>
          <p>Total Order Value : {data.totalAmount}</p>
          <p>Order Date: {data.createdAt}</p>
          <p>Order Status: {data.orderStatus}
            <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>{data.orderStatus}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
          </p>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>S_No.</th>
                <th>Product Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
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
                  </tr>
                );
              })}
              {/* <tr>
          <td>1</td>
          <td></td>
          <td>{data.items.quantity}</td>
          <td>{data.totalAmount}</td>
          <td>{data.paymentStatus}</td>
          <td>{data.orderStatus}</td>
        </tr> */}
            </tbody>
          </Table>
        </>
      ))}
    </div>
  );
};

export default Seller_Orders;
