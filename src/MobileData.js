import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Plus, Cart } from "react-bootstrap-icons";
import "./style.css";

const MobileData = () => {
  // fetch the product id from the url
  const { id } = useParams();
  React.useEffect(() => {
    // Fetch mobile data from backend using the id
    fetch(`http://localhost:8090/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setMobile(data))
      .catch((error) => console.error("Error fetching mobile data:", error));
  }, [id]);
  // store this id in local storage
  localStorage.setItem("selectedProductId", id);
  console.log("Selected Product ID from URL:", id);
  // get the current user from the redux store
  const { user: currentUser } = useSelector((state) => state.auth);
  const [mobile, setMobile] = React.useState(null);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const buyNow = (data) => {
    const updatedItems = [...selectedItems, data];
    setSelectedItems(updatedItems);
    console.log("Selected Items:", updatedItems);
    //add the updated items to cart in backend
    handleAddToCart({
      userId: currentUser.id,
      items: updatedItems.map((it) => ({
        productId: it.id,
        price: it.price,
        quantity: 1,
      })),
      active: true,
    });
    window.location.href = "/address"; // Redirect to address page
  };
  const handleAddToCart = (item) => {
    fetch("http://localhost:8090/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Item added to cart:", data);
        // Optionally, update cart state or provide user feedback here
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      });
  };

  return (
    <div>
      {/* Display mobile data fetched from backend */}
      {mobile ? (
        <div>
          <Container>
            <Row>
              <Col md={6}>
                <Card className="shop" style={{ width: "100%" }}>
                  <Card.Img
                    variant="right"
                    src={`http://localhost:8090/uploads/${mobile.image}`}
                    className="item"
                  />
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shop" style={{ width: "100%" }}>
                  <Card.Body>
                    <Card.Title>{mobile.name}</Card.Title>
                    <Card.Text>{mobile.brand}</Card.Text>
                    <Card.Text>RAM: {mobile.ram}</Card.Text>
                    <Card.Text>ROM: {mobile.rom}</Card.Text>
                    <Card.Text>Screen Size: {mobile.screenSize}</Card.Text>
                    <Card.Text>Camera: {mobile.camera}</Card.Text>
                    <Card.Text>Battery: {mobile.battery}</Card.Text>
                    <Card.Text>Processor: {mobile.processor}</Card.Text>
                    <Card.Text>Color: {mobile.color}</Card.Text>
                    <Card.Text>
                      Price: Rs.
                      {mobile.price}
                    </Card.Text>
                    <div className="buttons d-flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleAddToCart({
                            userId: currentUser.id,
                            items: [
                              {
                                productId: mobile.id,
                                price: mobile.price,
                                quantity: 1,
                              },
                            ],
                            active: true,
                          })
                        }
                      >
                        <Plus /> Add to Cart
                      </Button>
                      <Button variant="success" onClick={() => buyNow(mobile)}>
                        <Cart /> Buy Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default MobileData;
