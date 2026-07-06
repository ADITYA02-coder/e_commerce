import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";

const LoginPage = () => {
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    role: "customer",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username must be at most 30 characters.")
      .required("Username is required!"),
    email: Yup.string()
      .trim()
      .email("This is not a valid email.")
      .max(80, "Email is too long.")
      .required("Email is required!"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long.")
      .matches(/[A-Z]/, "Password must include at least one uppercase letter.")
      .matches(/[a-z]/, "Password must include at least one lowercase letter.")
      .matches(/[0-9]/, "Password must include at least one number.")
      .matches(/[^A-Za-z0-9]/, "Password must include at least one symbol.")
      .required("Password is required!"),
  });

  const handleRegister = (formValue) => {
    const { username, email, password, role } = formValue;

    setSuccessful(false);

    dispatch(register({ username, email, password, role }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
        setTimeout(() => navigate("/login"), 800);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  return (
    <div className="col-md-12 signup-form">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
        <h3 className="mb-3 text-center">Create your account</h3>
        <p className="text-muted text-center">Choose a role to begin your journey.</p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, isValid }) => (
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Field name="username" type="text" className="form-control" />
                    <ErrorMessage name="username" component="div" className="alert alert-danger" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="alert alert-danger" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field name="password" type="password" className="form-control" />
                    <ErrorMessage name="password" component="div" className="alert alert-danger" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <Field as="select" name="role" className="form-control">
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </Field>
                  </div>

                  <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || !isValid}>
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>

      {message && (
        <div className="form-group">
          <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
