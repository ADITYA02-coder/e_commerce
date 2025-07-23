import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { Cart } from 'react-bootstrap-icons'; 
const MyComponent = () => {
    const[data,setData]= useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

     const handleDelete = async (id) => {
        
        try{
            const response = await fetch(`http://localhost:8090/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
          
        }
        catch(err){
            console.error("Error submitting product:", err);
        }
        // Here you can add the logic to send the product data to your backend or API
    }

    useEffect(() => {
        const fetchData = async()=>{
            try{
                const response = await fetch("http://localhost:8090/api/products");
                if (!response.ok) {
                    throw new Error(`HHTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
            console.log(jsonData);
        } catch (error) {
                setError(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
    }, []);
    if (loading) return <div>Loading.....</div>;
    if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      {
        data.map((data) => (
           <Card className="shop" style={{ width: "100%" }}>
                  <Card.Img variant="top" src={`http://localhost:8090/uploads/${data.image}`} className='item' />
                  <Card.Body>
                    <Card.Title>
                      <Link to="/category/mobiles/mobiledata>">
                        {data.name}
                      </Link>
                    </Card.Title>
                    <Card.Text>{data.brand}</Card.Text>
                    <Card.Text>{data.ram}</Card.Text>
                    <Card.Text>{data.rom}</Card.Text>
                    <Card.Text>{data.camera}</Card.Text>
                    <Card.Text>{data.screen_size}</Card.Text>
                    <Card.Text>
                      Price:
                      {data.price >= parseFloat(100.0)
                        ? (data.price * 20) / 100
                        : data.price}
                    </Card.Text>
                    <Button variant="primary">
                      <Plus /> Add Item{" "}
                    </Button>
                    <Button variant="primary">
                      <Cart /> Buy Now
                    </Button>
                  </Card.Body>
                  <Button variant="danger" onClick={() =>{
                    const alertValue= window.confirm("Are you sure you want to delete this product?")
                    if(alertValue){
                      handleDelete(data.id);
                      window.location.reload();

                    }
                   }} >
                    Delete
                  </Button>
                </Card>
        ))
          }
     
    </div>
  )
}

export default MyComponent
