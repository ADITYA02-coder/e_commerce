import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button, Form as BootstrapForm } from "react-bootstrap";
import "./Address.css";
import { Trash3 } from "react-bootstrap-icons";

const Address = () => {
  const [address, setAddress] = useState([]);
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  async function handleAddress() {
    try {
      const response = await fetch("http://localhost:8090/api/addresses");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const addresses = await response.json();
      setAddress(addresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  }

  async function handleOrders() {
    try {
      setLoading(true);
      setError(null);

      const cartResponse = await fetch(
        `http://localhost:8090/api/carts/user/${currentUser.id}`
      );
      if (!cartResponse.ok) {
        throw new Error(`Failed to fetch cart: ${cartResponse.status}`);
      }

      const cartData = await cartResponse.json();
      setCartItems(cartData.items || []);

      if (!cartData.items || cartData.items.length === 0) {
        setCartItems([]);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }
  // giveing 200 ok status
  const placeOrder = async (addressId) => {
    try {
      // ✅ find selected address object from state
      const selectedAddress = address.find(
        (addr) => String(addr.id) === String(addressId)
      );

      if (!selectedAddress) {
        alert("No address found!");
        return;
      }

      const res = await fetch("http://localhost:8090/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          items: cartItems,
          addressId: selectedAddress.id,
          // ✅ send address fields
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          district: selectedAddress.district,
          state: selectedAddress.state,
          pin: selectedAddress.pin,
          mobile: selectedAddress.mobile,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      // ✅ clear cart after placing order

      alert("✅ Going to payment!");
      handleDelete();

      navigate("/payment");
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch("http://localhost:8090/api/carts/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete cart item");
      console.log("Cart item deleted successfully", response);
      // ✅ Refresh cart items after deletion
      handleOrders();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  useEffect(() => {
    handleAddress();
    if (currentUser) handleOrders();
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const addressSchema = Yup.object().shape({
    addressLine1: Yup.string().required("Required"),
    addressLine2: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    district: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pin: Yup.string()
      .matches(/^\d{6}$/, "Must be a 6-digit PIN")
      .required("Required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Must be a 10-digit mobile number")
      .required("Required"),
  });

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8090/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, userId: currentUser.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error submitting address");
      }

      const newAddress = await response.json();
      alert("Address submitted successfully!");
      setAddress((prev) => [...prev, newAddress]);
      resetForm();
      setShow(false);
    } catch (err) {
      console.error("Error submitting address:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // delete a particular address
  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/addresses/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete address");

      setAddress((prev) => prev.filter((addr) => addr.id !== id));
      alert("Address deleted successfully!");
    } catch (err) {
      console.error("Error deleting address:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="address-container">
      <h2 className="address-title">Address Page</h2>

      {loading && <p>Loading cart...</p>}
      {error && <p className="text-danger">{error}</p>}

      <Formik
        initialValues={{ picked: "" }}
        onSubmit={(values, { resetForm }) => {
          if (!values.picked) {
            alert("Please select an address before placing order.");
            return;
          }
          placeOrder(values.picked); // ✅ FIXED - call correct function
          resetForm();
        }}
      >
        {({ values, handleReset }) => (
          <FormikForm>
            <div id="my-radio-group">Select an Address</div>
            <div role="group" aria-labelledby="my-radio-group">
              {address.length === 0 ? (
                <p>No saved addresses found.</p>
              ) : (
                address.map((addr) => (
                  <label key={addr.id} className="address-card">
                    <Field type="radio" name="picked" value={String(addr.id)} />
                    <div>
                      <p>
                        {addr.addressLine1}, {addr.addressLine2}
                      </p>
                      <p>
                        {addr.city}, {addr.district}
                      </p>
                      <p>
                        {addr.state} - {addr.pin}
                      </p>
                      <p>Mobile: {addr.mobile}</p>
                    </div>{" "}
                    <Trash3 onClick={() => handleDeleteAddress(addr.id)} />
                  </label>
                ))
              )}
            </div>
            <div>Picked: {values.picked}</div>
            <Button type="submit">Place Order</Button>
            <Button
              type="button"
              onClick={handleReset}
              variant="secondary"
              style={{ marginLeft: "10px" }}
            >
              Reset
            </Button>
          </FormikForm>
        )}
      </Formik>

      <Button
        variant="primary"
        onClick={() => setShow(true)}
        style={{ marginTop: "20px" }}
      >
        Add New Address
      </Button>

      {/* Modal for adding new address */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              addressLine1: "",
              addressLine2: "",
              city: "",
              district: "",
              state: "",
              pin: "",
              mobile: "",
            }}
            validationSchema={addressSchema}
            onSubmit={handleFormSubmit}
          >
            {() => (
              <FormikForm>
                {[
                  "addressLine1",
                  "addressLine2",
                  "city",
                  "district",
                  "state",
                  "pin",
                  "mobile",
                ].map((field) => (
                  <BootstrapForm.Group
                    controlId={field}
                    key={field}
                    className="mb-3"
                  >
                    <BootstrapForm.Label>
                      {field.replace(/([A-Z])/g, " $1")}
                    </BootstrapForm.Label>
                    <Field
                      name={field}
                      as={BootstrapForm.Control}
                      type="text"
                    />
                    <div className="text-danger small">
                      <ErrorMessage name={field} />
                    </div>
                  </BootstrapForm.Group>
                ))}

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Address"}
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Address;
