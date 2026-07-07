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

  const roleOptions = [
    {
      value: "customer",
      label: "Customer",
      description: "Shop, track orders, and manage your account",
      accent: "linear-gradient(135deg, #eef8ff, #dcecff)",
    },
    {
      value: "seller",
      label: "Seller",
      description: "List products and grow your store",
      accent: "linear-gradient(135deg, #fff5e8, #ffe2c2)",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Manage users and oversee the marketplace",
      accent: "linear-gradient(135deg, #f3ebff, #e2d4ff)",
    },
  ];

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
    <div className="auth-shell signup-form">
      <div className="auth-card card-container">
        <div className="auth-side-panel auth-side-panel--signup col-lg-5">
          <div className="auth-badge">🛍️</div>
          <h2>Join ShopEase</h2>
          <p>
            Create your account and choose the role that fits your journey, whether you are shopping, selling, or managing the marketplace.
          </p>
          <ul>
            <li>✓ Fast checkout and secure profile</li>
            <li>✓ Seller tools and storefront control</li>
            <li>✓ Admin insights and marketplace oversight</li>
          </ul>
        </div>

        <div className="auth-form-panel col-lg-7">
          <div className="text-center mb-3">
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "22px" }}>
              ✦
            </div>
            <h3>Create your account</h3>
            <p className="text-muted mb-0">Pick your role and get started in minutes.</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting, isValid, values, setFieldValue }) => (
              <Form>
                {!successful && (
                  <div>
                    <div className="auth-role-grid">
                      {roleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`auth-role-card text-start ${values.role === option.value ? "active" : ""}`}
                          onClick={() => setFieldValue("role", option.value)}
                        >
                          <div className="fw-semibold">{option.label}</div>
                          <small>{option.description}</small>
                        </button>
                      ))}
                    </div>
                    <Field type="hidden" name="role" />

                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <Field name="username" type="text" className="auth-input-field form-control" />
                      <ErrorMessage name="username" component="div" className="alert alert-danger auth-alert" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field name="email" type="email" className="auth-input-field form-control" />
                      <ErrorMessage name="email" component="div" className="alert alert-danger auth-alert" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <Field name="password" type="password" className="auth-input-field form-control" />
                      <ErrorMessage name="password" component="div" className="alert alert-danger auth-alert" />
                    </div>

                    <div className="form-group mt-3">
                      <button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting || !isValid}>
                        {isSubmitting ? "Signing Up..." : "Create account"}
                      </button>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
          <div className="auth-link-row">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </div>
      </div>

      {message && (
        <div className="form-group">
          <div className={successful ? "alert alert-success auth-alert" : "alert alert-danger auth-alert"} role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
