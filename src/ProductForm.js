import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Header } from "./Header";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState(null);
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");
  const [camera, setCamera] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setBrand("");
    setImage(null);
    setRam("");
    setRom("");
    setCamera("");
    setScreenSize("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !category || !price || !brand) {
      alert("Please fill in all required fields");
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("brand", brand);
      
      // Only append file if it exists
      if (image) {
        formData.append("file", image);
      }
      
      formData.append("ram", ram);
      formData.append("rom", rom);
      formData.append("camera", camera);
      formData.append("screenSize", screenSize);
      
      // Get userId from Redux store instead of localStorage
      formData.append("userId", currentUser.id);

      const response = await fetch("http://localhost:8090/api/products", {
        method: "POST",
        body: formData,
      });
      // console.log(formData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product submitted successfully:", data);
      
      // Reset form fields on success
      resetForm();
      alert("Product submitted successfully!");
      
    } catch (err) {
      console.error("Error submitting product:", err);
      alert(`Error submitting product: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="product-form-container">
        <h2>Add New Product</h2>
        <p>
          <strong>User ID:</strong> {currentUser.id}
        </p>
        <p>Please fill in the details below to add a new product.</p>
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Control
                placeholder="Enter Product Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category *</option>
                <option value="mobiles">Mobiles, Computers</option>
                <option value="mens">Mens Fashion</option>
                <option value="womens">Womens Fashion</option>
                <option value="kids">Kids</option>
                <option value="electronics">Electronics Items</option>
              </Form.Select>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Label>Price: ₹{price || 0}</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price *"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                required
              />
              <Form.Range 
                value={price || 400} 
                min={400} 
                max={500000} 
                onChange={(e) => setPrice(e.target.value)} 
              />
            </Col>
            <Col>
              <Form.Select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              >
                <option value="">Select Brand *</option>
                <option value="samsung">Samsung</option>
                <option value="apple">Apple</option>
                <option value="oneplus">OnePlus</option>
                <option value="vivo">Vivo</option>
                <option value="oppo">Oppo</option>
                <option value="xiaomi">Xiaomi</option>
                <option value="realme">Realme</option>
              </Form.Select>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Upload product image (optional)
              </Form.Text>
            </Col>
            <Col>
              <Form.Select
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              >
                <option value="">Select RAM</option>
                <option value="2">2 GB</option>
                <option value="3">3 GB</option>
                <option value="4">4 GB</option>
                <option value="6">6 GB</option>
                <option value="8">8 GB</option>
                <option value="12">12 GB</option>
              </Form.Select>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Select
                value={rom}
                onChange={(e) => setRom(e.target.value)}
              >
                <option value="">Select Storage</option>
                <option value="32">32 GB</option>
                <option value="64">64 GB</option>
                <option value="128">128 GB</option>
                <option value="256">256 GB</option>
                <option value="512">512 GB</option>
                <option value="1024">1 TB</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Control
                placeholder="Camera (e.g., 48MP)"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
              />
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Form.Control
                placeholder="Screen Size (e.g., 6.1 inches)"
                value={screenSize}
                onChange={(e) => setScreenSize(e.target.value)}
              />
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProductForm;