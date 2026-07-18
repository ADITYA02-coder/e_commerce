import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "../styles/ProductForm.css";
import { API_URL } from "../config/api";

const ProductForm = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("1");
  const [discount, setDiscount] = useState("0");
  const [image, setImage] = useState(null);
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");
  const [camera, setCamera] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [battery, setBattery] = useState("");
  const [processor, setProcessor] = useState("");
  const [color, setColor] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sellerProfileStatus, setSellerProfileStatus] = useState(null);
  const [sellerProfileLoading, setSellerProfileLoading] = useState(false);
  const [sellerProfileMessage, setSellerProfileMessage] = useState("");

  const canManageProducts = currentUser?.roles?.includes("ROLE_SELLER");
  const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken;
  const sellerNeedsApproval = currentUser?.roles?.includes("ROLE_SELLER");
  const sellerCanSubmit = !sellerNeedsApproval || sellerProfileStatus === "approved";

  if (!currentUser || !canManageProducts) {
    return <Navigate to="/" />;
  }

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/cats`);
        if (!response.ok) return;
        const categories = await response.json();
        const names = (Array.isArray(categories) ? categories : [])
          .map((item) => (item?.name || "").trim())
          .filter(Boolean);
        setCategoryOptions(Array.from(new Set(names)));
      } catch (error) {
        console.error("Unable to load categories", error);
      }
    };

    loadCategories();
  }, []);

  React.useEffect(() => {
    const loadSellerProfile = async () => {
      if (!sellerNeedsApproval) {
        return;
      }

      if (!token) {
        setSellerProfileStatus("missing");
        setSellerProfileMessage("Sign in again to verify your seller profile.");
        return;
      }

      try {
        setSellerProfileLoading(true);
        const response = await fetch(`${API_URL}/seller/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          setSellerProfileStatus(response.status === 404 ? "missing" : "pending");
          setSellerProfileMessage("Save your shop details and verification documents before adding products.");
          return;
        }

        const data = await response.json();
        const status = data.verificationStatus || (data.isApproved ? "approved" : "pending");
        setSellerProfileStatus(status);

        if (status !== "approved") {
          setSellerProfileMessage("Your seller profile is not approved yet. Complete the required documents and wait for review.");
        } else {
          setSellerProfileMessage("");
        }
      } catch (error) {
        setSellerProfileStatus("pending");
        setSellerProfileMessage("Unable to verify seller status right now.");
        console.error("Unable to load seller profile", error);
      } finally {
        setSellerProfileLoading(false);
      }
    };

    loadSellerProfile();
  }, [sellerNeedsApproval, token]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setBrand("");
    setDescription("");
    setStock("1");
    setDiscount("0");
    setImage(null);
    setRam("");
    setRom("");
    setCamera("");
    setScreenSize("");
    setBattery("");
    setProcessor("");
    setColor("");
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
      if (sellerNeedsApproval && !sellerCanSubmit) {
        throw new Error(sellerProfileMessage || "Complete and approve your seller profile before adding products.");
      }

      if (!token) {
        throw new Error("Please sign in again before adding a product.");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("quantity", stock);
      formData.append("availability", String(Number(stock) > 0));
      formData.append("discount", discount);

      // Only append file if it exists
      if (image) {
        formData.append("file", image);
      }

      formData.append("ram", ram);
      formData.append("rom", rom);
      formData.append("camera", camera);
      formData.append("screenSize", screenSize);
      formData.append("battery", battery);
      formData.append("processor", processor);
      formData.append("color", color);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      // console.log(formData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
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
    <div className="seller-form-page">
      <div className="product-form-container">
        <div className="seller-form-header">
          <div>
            <span className="seller-form-badge">Seller Console</span>
            <h2>Add New Product</h2>
            <p>Please fill in the details below to add a new product.</p>
          </div>
          <div className="seller-form-meta">
            <span>Seller ID</span>
            <strong>{currentUser.id}</strong>
          </div>
        </div>

        {sellerNeedsApproval && (
          <div className={`alert ${sellerCanSubmit ? "alert-success" : "alert-warning"}`}>
            {sellerProfileLoading
              ? "Checking seller verification status..."
              : sellerCanSubmit
                ? "Seller profile approved. You can add products."
                : sellerProfileMessage || "Complete your shop details and verification documents before listing products."}
          </div>
        )}

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
              <Form.Control
                type="text"
                placeholder="Category * (e.g., books, furniture, grocery)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="product-category-options"
                required
              />
              <datalist id="product-category-options">
                {categoryOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
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
              <Form.Control
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand * (e.g., Apple, Nike, LG)"
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Product description (features, size, material, compatibility)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Available stock</Form.Label>
              <Form.Control type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </Col>
            <Col>
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control type="number" min="0" max="90" value={discount} onChange={(e) => setDiscount(e.target.value)} />
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
              <Form.Select value={ram} onChange={(e) => setRam(e.target.value)}>
                <option value="">Select RAM</option>
                <option value="2">2 GB</option>
                <option value="3">3 GB</option>
                <option value="4">4 GB</option>
                <option value="6">6 GB</option>
                <option value="8">8 GB</option>
                <option value="12">12 GB</option>
                <option value="16">16 GB</option>
                <option value="24">24 GB</option>
                <option value="32">32 GB</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Select value={rom} onChange={(e) => setRom(e.target.value)}>
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
            <Col>
              <Form.Control
                placeholder="Battery Capacity (e.g., 4500mAh)"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control
                placeholder="Processor (e.g., Snapdragon 888)"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="Color (e.g., Black)"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting || (sellerNeedsApproval && !sellerCanSubmit)}>
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
