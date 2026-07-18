import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "../styles/ProductForm.css";
import { API_URL } from "../config/api";

const CATEGORY_FIELD_SETS = {
  mobiles: [
    { name: "ram", label: "RAM", type: "select", options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "24 GB", "32 GB"] },
    { name: "rom", label: "Storage", type: "select", options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"] },
    { name: "camera", label: "Camera", type: "select", options: ["12MP", "48MP", "50MP", "64MP", "108MP", "200MP", "Dual Camera", "Triple Camera"] },
    { name: "screenSize", label: "Screen Size", type: "select", options: ["5.5 inches", "6.1 inches", "6.4 inches", "6.7 inches", "7 inches"] },
    { name: "battery", label: "Battery", type: "select", options: ["3000mAh", "4000mAh", "4500mAh", "5000mAh", "6000mAh"] },
    { name: "processor", label: "Processor", type: "select", options: ["Snapdragon", "MediaTek Dimensity", "Apple A Series", "Exynos", "Google Tensor"] },
    { name: "color", label: "Color", type: "select", options: ["Black", "White", "Blue", "Green", "Red", "Silver", "Gold"] }
  ],
  electronics: [
    { name: "model", label: "Model", placeholder: "WH-1000XM5" },
    { name: "warranty", label: "Warranty", type: "select", options: ["No warranty", "6 months", "1 year", "2 years", "3 years"] },
    { name: "power", label: "Power / Wattage", type: "select", options: ["5W", "10W", "18W", "30W", "45W", "65W", "100W"] },
    { name: "connectivity", label: "Connectivity", type: "select", options: ["Bluetooth", "Wi-Fi", "USB-C", "HDMI", "Aux", "Bluetooth + Wi-Fi"] },
    { name: "color", label: "Color", type: "select", options: ["Black", "White", "Silver", "Grey", "Blue"] }
  ],
  books: [
    { name: "author", label: "Author", placeholder: "James Clear" },
    { name: "publisher", label: "Publisher", placeholder: "Penguin" },
    { name: "language", label: "Language", type: "select", options: ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"] },
    { name: "format", label: "Format", type: "select", options: ["Paperback", "Hardcover", "Ebook"] },
    { name: "pages", label: "Pages", type: "select", options: ["Under 100", "100-250", "250-500", "500-750", "750+"] }
  ],
  fashion: [
    { name: "size", label: "Size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { name: "material", label: "Material", type: "select", options: ["Cotton", "Polyester", "Denim", "Wool", "Leather", "Linen", "Rayon"] },
    { name: "color", label: "Color", type: "select", options: ["Black", "White", "Blue", "Navy Blue", "Grey", "Red", "Green", "Pink"] },
    { name: "fit", label: "Fit", type: "select", options: ["Slim fit", "Regular fit", "Relaxed fit", "Oversized"] },
    { name: "gender", label: "Gender", type: "select", options: ["Men", "Women", "Unisex", "Kids"] }
  ],
  furniture: [
    { name: "material", label: "Material", type: "select", options: ["Engineered wood", "Solid wood", "Metal", "Plastic", "Glass", "Fabric"] },
    { name: "dimensions", label: "Dimensions", type: "select", options: ["Small", "Medium", "Large", "120 x 60 x 75 cm", "180 x 75 x 75 cm"] },
    { name: "weight", label: "Weight", type: "select", options: ["Under 5 kg", "5-10 kg", "10-20 kg", "20-50 kg", "50 kg+"] },
    { name: "assembly", label: "Assembly", type: "select", options: ["No assembly", "Basic assembly", "Professional assembly"] },
    { name: "color", label: "Color", type: "select", options: ["Walnut", "Black", "White", "Brown", "Grey", "Natural"] }
  ],
  grocery: [
    { name: "weight", label: "Weight / Quantity", type: "select", options: ["100 g", "250 g", "500 g", "1 kg", "5 kg", "10 kg"] },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "ingredients", label: "Ingredients", placeholder: "Basmati rice" },
    { name: "dietType", label: "Diet Type", type: "select", options: ["Vegetarian", "Vegan", "Non-vegetarian", "Organic", "Gluten free"] },
    { name: "packType", label: "Pack Type", type: "select", options: ["Pouch", "Bottle", "Box", "Jar", "Packet", "Can"] }
  ],
  beauty: [
    { name: "skinType", label: "Skin / Hair Type", type: "select", options: ["All skin types", "Dry", "Oily", "Combination", "Sensitive", "Normal"] },
    { name: "volume", label: "Volume", type: "select", options: ["15 ml", "30 ml", "50 ml", "100 ml", "200 ml", "500 ml"] },
    { name: "ingredients", label: "Key Ingredients", placeholder: "Vitamin C, Hyaluronic Acid" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "concern", label: "Concern", type: "select", options: ["Acne", "Dullness", "Dryness", "Hair fall", "Anti ageing", "Sun protection"] }
  ],
  sports: [
    { name: "sport", label: "Sport", type: "select", options: ["Yoga", "Cricket", "Football", "Badminton", "Gym", "Running", "Cycling"] },
    { name: "size", label: "Size", type: "select", options: ["XS", "S", "M", "L", "XL", "6 mm", "8 mm", "10 mm"] },
    { name: "material", label: "Material", type: "select", options: ["TPE", "Rubber", "Foam", "Leather", "Plastic", "Metal"] },
    { name: "weight", label: "Weight", type: "select", options: ["Under 500 g", "500 g - 1 kg", "1-2 kg", "2-5 kg", "5 kg+"] },
    { name: "color", label: "Color", type: "select", options: ["Black", "Blue", "Red", "Green", "Purple", "Orange"] }
  ],
  general: [
    { name: "model", label: "Model / Variant", placeholder: "Standard" },
    { name: "material", label: "Material", type: "select", options: ["Cotton", "Steel", "Plastic", "Wood", "Glass", "Leather", "Mixed"] },
    { name: "size", label: "Size / Capacity", type: "select", options: ["Small", "Medium", "Large", "XL", "500 ml", "1 L", "5 L"] },
    { name: "color", label: "Color", type: "select", options: ["Black", "White", "Blue", "Red", "Green", "Grey", "Brown"] },
    { name: "warranty", label: "Warranty", type: "select", options: ["No warranty", "3 months", "6 months", "1 year", "2 years"] }
  ]
};

const CATEGORY_ALIASES = {
  mobile: "mobiles",
  mobiles: "mobiles",
  smartphone: "mobiles",
  smartphones: "mobiles",
  phone: "mobiles",
  phones: "mobiles",
  electronics: "electronics",
  electronic: "electronics",
  books: "books",
  book: "books",
  fashion: "fashion",
  clothing: "fashion",
  clothes: "fashion",
  furniture: "furniture",
  grocery: "grocery",
  groceries: "grocery",
  beauty: "beauty",
  cosmetics: "beauty",
  sports: "sports",
  fitness: "sports"
};

const getCategoryKey = (value) => CATEGORY_ALIASES[String(value || "").trim().toLowerCase()] || "general";
const DEFAULT_CATEGORIES = [
  { value: "mobiles", label: "Mobiles" },
  { value: "electronics", label: "Electronics" },
  { value: "books", label: "Books" },
  { value: "fashion", label: "Fashion" },
  { value: "furniture", label: "Furniture" },
  { value: "grocery", label: "Grocery" },
  { value: "beauty", label: "Beauty" },
  { value: "sports", label: "Sports" }
];
const DEFAULT_CATEGORY_VALUES = new Set(DEFAULT_CATEGORIES.map((item) => item.value));
const COUNTRY_OPTIONS = ["India", "China", "Vietnam", "Bangladesh", "Sri Lanka", "USA", "Germany", "Japan", "South Korea"];
const WARRANTY_OPTIONS = ["No warranty", "3 months", "6 months", "1 year", "2 years", "3 years", "5 years"];
const RETURN_POLICY_OPTIONS = ["0", "7", "10", "15", "30"];
const SHIPPING_DAY_OPTIONS = ["1", "2", "3", "5", "7", "10"];
const PACKAGE_WEIGHT_OPTIONS = ["Under 250 g", "250 g - 500 g", "500 g - 1 kg", "1-2 kg", "2-5 kg", "5-10 kg", "10 kg+"];
const PACKAGE_DIMENSION_OPTIONS = ["Small box", "Medium box", "Large box", "20 x 15 x 8 cm", "30 x 20 x 10 cm", "50 x 40 x 30 cm"];

const ProductForm = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [searchKeywords, setSearchKeywords] = useState("");
  const [stock, setStock] = useState("1");
  const [discount, setDiscount] = useState("0");
  const [sku, setSku] = useState("");
  const [condition, setCondition] = useState("New");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [warranty, setWarranty] = useState("1 year");
  const [returnPolicy, setReturnPolicy] = useState("30");
  const [shippingDays, setShippingDays] = useState("3");
  const [packageWeight, setPackageWeight] = useState("");
  const [packageDimensions, setPackageDimensions] = useState("");
  const [image, setImage] = useState(null);
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");
  const [camera, setCamera] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [battery, setBattery] = useState("");
  const [processor, setProcessor] = useState("");
  const [color, setColor] = useState("");
  const [attributeValues, setAttributeValues] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sellerProfileStatus, setSellerProfileStatus] = useState(null);
  const [sellerProfileLoading, setSellerProfileLoading] = useState(false);
  const [sellerProfileMessage, setSellerProfileMessage] = useState("");

  const canManageProducts = currentUser?.roles?.includes("ROLE_SELLER");
  const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken;
  const sellerNeedsApproval = currentUser?.roles?.includes("ROLE_SELLER");
  const sellerCanSubmit = !sellerNeedsApproval || sellerProfileStatus === "approved";
  const selectedCategoryKey = getCategoryKey(category);
  const selectedFields = CATEGORY_FIELD_SETS[selectedCategoryKey] || CATEGORY_FIELD_SETS.general;
  const categoryChoices = [
    ...DEFAULT_CATEGORIES,
    ...categoryOptions
      .filter((option) => !DEFAULT_CATEGORY_VALUES.has(option.trim().toLowerCase()))
      .map((option) => ({ value: option, label: option }))
  ];

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
    setBulletPoints("");
    setSearchKeywords("");
    setStock("1");
    setDiscount("0");
    setSku("");
    setCondition("New");
    setCountryOfOrigin("");
    setWarranty("1 year");
    setReturnPolicy("30");
    setShippingDays("3");
    setPackageWeight("");
    setPackageDimensions("");
    setImage(null);
    setRam("");
    setRom("");
    setCamera("");
    setScreenSize("");
    setBattery("");
    setProcessor("");
    setColor("");
    setAttributeValues({});
  };

  const updateAttribute = (fieldName, value) => {
    setAttributeValues((prev) => ({ ...prev, [fieldName]: value }));
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
      formData.append("bulletPoints", bulletPoints);
      formData.append("searchKeywords", searchKeywords);
      formData.append("sku", sku);
      formData.append("condition", condition);
      formData.append("countryOfOrigin", countryOfOrigin);
      formData.append("stock", stock);
      formData.append("quantity", stock);
      formData.append("availability", String(Number(stock) > 0));
      formData.append("discount", discount);
      formData.append("productType", selectedCategoryKey);
      formData.append("warranty", warranty);
      formData.append("returnPolicy", returnPolicy);
      formData.append("shippingDays", shippingDays);
      formData.append("packageWeight", packageWeight);
      formData.append("packageDimensions", packageDimensions);

      // Only append file if it exists
      if (image) {
        formData.append("file", image);
      }

      const dynamicAttributes = selectedFields.reduce((acc, field) => {
        const value = attributeValues[field.name];
        if (value) acc[field.name] = value;
        return acc;
      }, {});

      formData.append("attributes", JSON.stringify(dynamicAttributes));
      formData.append("ram", dynamicAttributes.ram || ram);
      formData.append("rom", dynamicAttributes.rom || rom);
      formData.append("camera", dynamicAttributes.camera || camera);
      formData.append("screenSize", dynamicAttributes.screenSize || screenSize);
      formData.append("battery", dynamicAttributes.battery || battery);
      formData.append("processor", dynamicAttributes.processor || processor);
      formData.append("color", dynamicAttributes.color || color);

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
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category *</option>
                {categoryChoices.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Control>
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

          <div className="seller-form-section">
            <h3>Listing Details</h3>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>SKU</Form.Label>
                <Form.Control
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Optional seller SKU"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Condition</Form.Label>
                <Form.Select value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Renewed">Renewed</option>
                  <option value="Used - Like New">Used - Like New</option>
                  <option value="Used - Good">Used - Good</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Country of Origin</Form.Label>
                <Form.Select
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                >
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Search Keywords</Form.Label>
                <Form.Control
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  placeholder="phone, android, 5g"
                />
              </Col>
              <Col md={12}>
                <Form.Label>Key Features</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.value)}
                  placeholder="Add one feature per line, like Amazon bullet points"
                />
              </Col>
            </Row>
          </div>

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
              <Form.Select value={selectedCategoryKey} disabled>
                <option>{selectedCategoryKey === "general" ? "General product fields" : `${selectedCategoryKey} fields`}</option>
              </Form.Select>
            </Col>
          </Row>

          <div className="seller-form-section">
            <h3>Shipping and Policy</h3>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Warranty</Form.Label>
                <Form.Select value={warranty} onChange={(e) => setWarranty(e.target.value)}>
                  {WARRANTY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Return Policy (days)</Form.Label>
                <Form.Select value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)}>
                  {RETURN_POLICY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option === "0" ? "No returns" : `${option} days`}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Shipping Days</Form.Label>
                <Form.Select value={shippingDays} onChange={(e) => setShippingDays(e.target.value)}>
                  {SHIPPING_DAY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option} {option === "1" ? "day" : "days"}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Package Weight</Form.Label>
                <Form.Select value={packageWeight} onChange={(e) => setPackageWeight(e.target.value)}>
                  <option value="">Select package weight</option>
                  {PACKAGE_WEIGHT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Label>Package Dimensions</Form.Label>
                <Form.Select value={packageDimensions} onChange={(e) => setPackageDimensions(e.target.value)}>
                  <option value="">Select package dimensions</option>
                  {PACKAGE_DIMENSION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </div>

          <div className="seller-form-section">
            <h3>{selectedCategoryKey === "general" ? "Product Details" : `${selectedCategoryKey} Details`}</h3>
            <Row className="g-3">
              {selectedFields.map((field) => (
                <Col md={6} key={`${selectedCategoryKey}-${field.name}`}>
                  <Form.Label>{field.label}</Form.Label>
                  {field.type === "select" ? (
                    <Form.Select
                      value={attributeValues[field.name] || ""}
                      onChange={(e) => updateAttribute(field.name, e.target.value)}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Form.Select>
                  ) : (
                    <Form.Control
                      type={field.type || "text"}
                      placeholder={field.placeholder || field.label}
                      value={attributeValues[field.name] || ""}
                      onChange={(e) => updateAttribute(field.name, e.target.value)}
                    />
                  )}
                </Col>
              ))}
            </Row>
          </div>

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
