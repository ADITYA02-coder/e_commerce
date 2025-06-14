import React from "react";
// import Form from "react-bootstrap/Form";
import { Formik, Form, Field } from "formik";
import { InputMask } from "@react-input/mask";
import * as Yup from 'yup'
 const DisplayingErrorMessagesSchema = Yup.object().shape({
   username: Yup.string()
     .min(3, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
   email: Yup.string().email('Invalid email').required('Required'),
   mobile: Yup.string().length(10,'Too Long!').required('Required'),
   aadhar: Yup.string().length(12,'Too long!').required('Required'),
   pincode: Yup.string().length(6,'Too Long!').required('Required'),

 });
const UserForm = () => {
  
  function validateEmail(value) {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }
  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{
          username: "",
          email: "",
          mobile:"",
          aadhar:"",
          pincode:"",
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values) => {
          // same shape as initial values
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <label>email</label>
            <Field name="email" validate={validateEmail} />
            {errors.email && touched.email && (
              <div style={{ color: "red" }}>{errors.email}</div>
            )}
            <label>full name</label>
            <InputMask name ="username" mask="_______________________________" replacement={{ _: /^[A-Z .a-z]+$/}} />
            {errors.username && touched.username && (
              <div style={{ color: "red" }}>{errors.username}</div>
            )}
            <label>mobile No.</label>
            <InputMask name ="mobile" mask="+91 __________" replacement={{ _: /\d/ }} />
            {errors.mobile && touched.mobile && (
              <div style={{ color: "red" }}>{errors.mobile}</div>
            )}
            <label>Aadhar No.</label>
            <InputMask name ="aadhar" mask="____ ____ ____" replacement={{ _: /\d/ }} />
            {errors.aadhar && touched.aadhar && (
              <div style={{ color: "red" }}>{errors.aadhar}</div>
            )}
            <label>PinCode</label>
            <InputMask name ="pincode" mask="______" replacement={{ _: /\d/ }} />
            {errors.pincode && touched.pincode && (
              <div style={{ color: "red" }}>{errors.pincode}</div>
            )}

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      
      {/* <Form>
        <Row className="mb-3">
          <Field name="username" validate={validateUsername} />
          {errors.username && touched.username && <div>{errors.username}</div>}
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control placeholder="1234 Main St" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label>Address 2</Form.Label>
          <Form.Control placeholder="Apartment, studio, or floor" />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>City</Form.Label>
            <Form.Control />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Select defaultValue="Choose...">
              <option>Choose...</option>
              <option>Jharkhand</option>
              <option>Bihar</option>
              <option>Assam</option>
              <option>West Bengal</option>
              <option>telangana</option>
              <option>Uttar Pradesh</option>
              <option>Tamil Nadu</option>
              <option>Madhya Pradesh</option>
              <option>Sikkim</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Zip</Form.Label>
            <Form.Control />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label as="legend" column sm={2}>
              Gender
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                type="radio"
                label="Male"
                name="formHorizontalRadios"
                id="formHorizontalRadios1"
              />
              <Form.Check
                type="radio"
                label="Female"
                name="formHorizontalRadios"
                id="formHorizontalRadios2"
              />
              <Form.Check
                type="radio"
                label="Not prefer to say"
                name="formHorizontalRadios"
                id="formHorizontalRadios3"
              />
            </Col>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" id="formGridCheckbox">
          <Form.Check type="checkbox" label="Agree to Terms and Conditions" />
        </Form.Group>

        <Form.Group className="mb-3" id="formGridCheckbox">
          <Form.Check type="checkbox" label="Check me in" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form> */}
    </div>
  );
};

export default UserForm;
