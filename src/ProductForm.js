import React, { useEffect } from "react";
import { useState } from "react";
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
  const [file, setFile] = useState("");
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");
  const [camera, setCamera] = useState("");
  const [screenSize, setScreenSize] = useState("");

  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // fetch current user data
  // const [username, setUsername] = useState("Anonymous user");

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   // setUsername(user.username);
  //   console.log("Current user:", user.username);
  //   // console.log("Current user:", username);
  // }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(price)
    const product = {
      
      name: name,
      category: category,
      price: price,
      brand: brand,
      file: file,
      ram: ram,
      rom: rom,
      camera: camera,
      screen_size: screenSize,
    };
    // Send the product data to the backend
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("brand", brand);
      formData.append("file", file);
      formData.append("ram", ram);
      formData.append("rom", rom);
      formData.append("camera", camera);
      formData.append("screen_size", screenSize);
      formData.append("userId", localStorage.getItem("userId"));

      console.log(...formData);
      const response = await fetch("http://localhost:8090/api/products/", {
        method: "POST",
        body: formData,
      });

      // try{
      //     const response = await fetch('http://localhost:8090/api/products/', {
      //         method: "POST",
      //         headers: {
      //             "Content-Type": "application/json"
      //           },
      //         body: JSON.stringify(product)
      //     });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Product submitted successfully:", data);
      // Reset form fields
      setName("");
      setCategory("");
      setPrice("");
      setBrand("");
      setFile("");
      setRam("");
      setRom("");
      setCamera("");
      setScreenSize("");
      // Optionally, you can redirect or show a success message here
      alert("Product submitted successfully!");
    } catch (err) {
      console.error("Error submitting product:", err);
    }
    // Here you can add the logic to send the product data to your backend or API
  };

  return (
    <div>
      <div className="product-form-container">
      
      <h2>Add New Product</h2>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>Please fill in the details below to add a new product.</p>
      <Form encType="multipart/form" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Control
              placeholder="Enter Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="mobiles">Mobiles,Computers</option>
              <option value="mens">Mens Fashion</option>
              <option value="womens">Womens Fashion</option>
              <option value="kids">Kids</option>
              <option value="electronics">Electronics Items</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            {/* <Form.Control placeholder="price" value={price} onChange={(e)=>setPrice(e.target.value)}/> */}
            <Form.Label>Range : {price}</Form.Label>
            <Form.Control
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Form.Range value={price} min={'400'} max={'500000'} onChange={(e)=> setPrice(e.target.value)} />
          </Col>
          <Col>
            <select
              className="form-select"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Select Brand</option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="one plus">One Plus</option>
              <option value="vivo">Vivo</option>
              <option value="oppo">Oppo</option>
              <option value="xiaomi">Xiaomi</option>
              <option value="realme">Realme</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Control
              placeholder="image"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Col>
          <Col>
           <select
              className="form-select"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
            >
              <option value="">Select Ram</option>
              <option value="2">2 GB</option>
              <option value="3">3 GB</option>
              <option value="4">4 GB</option>
              <option value="6">6 GB</option>
              <option value="8">8 GB</option>
              <option value="12">12 GB</option>
            </select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <select
              className="form-select"
              value={rom}
              onChange={(e) => setRom(e.target.value)}
            >
              <option value="">Select Rom</option>
              <option value="32">32 GB</option>
              <option value="64">64 GB</option>
              <option value="128">128 GB</option>
              <option value="256">256 GB</option>
              <option value="512">512 GB</option>
              <option value="1">1 TB</option>
            </select>
          </Col>
          <Col>
            <Form.Control
              placeholder="camera"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Control
              placeholder="screenSize"
              value={screenSize}
              onChange={(e) => setScreenSize(e.target.value)}
            />
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Add Product
        </Button>
        <Button
          variant="secondary"
          type="reset"
          onClick={() => {
            setName("");
            setCategory("");
            setPrice("");
            setBrand("");
            setFile("");
            setRam("");
            setRom("");
            setCamera("");
            setScreenSize("");
          }}
        >
          Reset
        </Button>
      </Form>
    </div>
    </div>
  );
};

export default ProductForm;
