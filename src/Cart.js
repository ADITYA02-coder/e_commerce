// import React, { useEffect, useState } from "react";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// // selected items array
// import { selectedItems } from "./Product";
// import { data } from "react-router";
// import { products } from "./Product";
// import { Card } from "react-bootstrap";
// import { Link } from "react-router";
// import { Button } from "react-bootstrap";
// import { Plus } from "react-bootstrap-icons";
// import { BackToTop } from "./BackToTop";

// const Cart = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cartItems, setCartItems] = useState(selectedItems);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:8090/api/carts");
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const jsonData = await response.json();
//         setData(jsonData);
//         console.log(jsonData);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div>Loading.....</div>;
//   if (error) return <div>Error: {error.message}</div>;
//   if (!data || data.length === 0) return <div>No products available</div>;

//   // Function to handle item removal from cart
//   const handleRemoveFromCart = (id) => {
//     setCartItems(cartItems.filter((item) => item !== id));
//   };
//   if (cartItems.length === 0) return <div>Your cart is empty</div>;
//   // Render the cart items
//   const handleDelete = async (id) => {
//     try { 
//       const response = await fetch(`http://localhost:8090/api/carts/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//     // Here you can add the logic to send the product data to your backend or API
//   }


//   return (
//     <div>
//       <h4>Shopping Cart</h4>
//       <Container>
//         <Row>
//           {cartItems.map((item) => ( 
//             <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
//               <Card className="add" style={{ width: "100%" }}>
//                 <Card.Img variant="top" src={item.image} />
//                 <Card.Body>
//                   <Card.Title>{item.name}</Card.Title>
//                   <Card.Text>Price: ${item.price}</Card.Text>
//                   <Button
//                     variant="danger"
//                     onClick={() => handleRemoveFromCart(item.id)}
//                   >
//                     Remove
//                   </Button> 
//                   <Button
//                     variant="danger"
//                     onClick={() => handleDelete(item.id)}
//                   >
//                     Delete
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//       <BackToTop />
//       <Button variant="primary" onClick={() => console.log("Checkout")}>
//         Checkout
//       </Button>
//       <div className="text-center mt-4">
//         <Link to="/category/mobiles">
//           <Button variant="secondary">Continue Shopping</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Cart;
