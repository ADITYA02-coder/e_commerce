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
    <div className="col-md-12 signup-form">
      <div className="card card-container" style={{ maxWidth: "720px", border: "none", borderRadius: "24px", boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)" }}>
        <div className="text-center mb-3">
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px" }}>
            ✦
          </div>
          <h3 className="mb-2">Create your account</h3>
          <p className="text-muted mb-0">Choose the role that fits your journey and get started in minutes.</p>
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
                  <div className="row g-2 mb-3">
                    {roleOptions.map((option) => (
                      <div className="col-md-4" key={option.value}>
                        <button
                          type="button"
                          className={`w-100 text-start border rounded-4 p-3 ${values.role === option.value ? "shadow-sm" : ""}`}
                          onClick={() => setFieldValue("role", option.value)}
                          style={{
                            background: option.accent,
                            borderColor: values.role === option.value ? "#2563eb" : "#e5e7eb",
                            transform: values.role === option.value ? "translateY(-2px)" : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div className="fw-semibold">{option.label}</div>
                          <small className="d-block text-muted">{option.description}</small>
                        </button>
                      </div>
                    ))}
                  </div>
                  <Field type="hidden" name="role" />

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
