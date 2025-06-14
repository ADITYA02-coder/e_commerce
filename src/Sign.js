import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

const Sign = () => {
    const [validated, setValidated] = useState(false);
    const [firstName,setfirstName]= useState("");
    const [lastName,setlastName]= useState("");
    const [email,setEmail] = useState("");
    const [address,setAddress] = useState("");
    const [city,setCity] = useState("");
    const [state,setState] = useState("");
    const [pinCode,setpinCode] = useState("");
    const [password,setPassword] = useState("");
    const submitData = (e) => {
        e.preventDefault();
        console.log(firstName);
        console.log(lastName);
        console.log(email);
        console.log(address);
        console.log(city);
        console.log(state);
        console.log(pinCode);
        console.log(password);
        
    }
//   const handleSubmit = (event) => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//     }

//     setValidated(true);
//     console.log(event.currentTarget);
//   };
  return (
    <div>
      <Form noValidate validated={validated} onSubmit={submitData}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label><b>First name</b></Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            onChange={(e) => {
                setfirstName(e.target.value);
            }}
            defaultValue={firstName}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label><b>Last name</b></Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            onChange={(e) => {
                setlastName(e.target.value);
            }}
            defaultValue={lastName}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label><b>Address</b></Form.Label>
            <Form.Control type="text" placeholder='Address' required
                onChange={(e) => {
                    setAddress(e.target.value);
                }}
                defaultValue={address}
            />
            
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label><b>City</b></Form.Label>
          <Form.Control type="text" placeholder="City" required 
            onChange={(e) => {
                setCity(e.target.value);
            }}
            defaultValue={city}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label><b>State</b></Form.Label>
          <Form.Control type="text" placeholder="State" required 
            onChange={(e) => {
                setState(e.target.value);
            }}
            defaultValue={setState}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label><b>Pin Code</b></Form.Label>
          <Form.Control type="text" placeholder="PinCode" required 
            onChange={(e) => {
                setpinCode(e.target.value);
            }}
            defaultValue={setpinCode}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md="3" className="mb-3" controlId="formGroupEmail">
        <Form.Label><b>Email address</b></Form.Label>
        <Form.Control type="email" placeholder="Enter email" 
            onChange={(e) => {
                setEmail(e.target.value);
            }}
            defaultValue={setEmail}
        />
      </Form.Group>
      <Form.Group as={Col} md="3" className="mb-3" controlId="formGroupPassword">
        <Form.Label><b>Password</b></Form.Label>
        <Form.Control type="password" placeholder="Password" 
            onChange={(e) => {
                setPassword(e.target.value);
            }}
            defaultValue={setPassword}
        />
      </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
          required
        />
      </Form.Group>
      <Button type="submit">Create an Account</Button>
    </Form>
    </div>
  )
}

export default Sign
