import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../slices/auth";
import { clearMessage } from "../slices/message";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");
  const { isLoggedIn, user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect");

  if (isLoggedIn && currentUser) {
    const rolePath = currentUser.roles?.includes("ROLE_ADMIN")
      ? "/admin"
      : currentUser.roles?.includes("ROLE_SELLER")
        ? "/seller"
        : redirectTo || "/";

    return <Navigate to={rolePath} />;
  }

  const roleOptions = [
    { value: "customer", label: "Customer", description: "Shop and manage your orders" },
    { value: "seller", label: "Seller", description: "Add products and run your store" },
    { value: "admin", label: "Admin", description: "Monitor the marketplace" },
  ];

  const initialValues = { username: "", password: "" };

  const validationSchema = Yup.object({
    username: Yup.string()
      .trim()
      .min(3, "Username or email must be at least 3 characters")
      .max(80, "Username or email is too long")
      .test(
        "username-or-email",
        "Enter a valid email address",
        (value) => {
          if (!value) return false;
          if (!value.includes("@")) return true;
          return Yup.string().email().isValidSync(value);
        }
      )
      .required("Username or email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .matches(/[A-Z]/, "Password must include at least one uppercase letter")
      .matches(/[a-z]/, "Password must include at least one lowercase letter")
      .matches(/[0-9]/, "Password must include at least one number")
      .matches(/[^A-Za-z0-9]/, "Password must include at least one symbol")
      .required("Password is required"),
  });

  const handleLogin = (formValue) => {
    const { username, password } = formValue;
    setLoading(true);

    dispatch(login({ username, password }))
      .unwrap()
      .then((payload) => {
        const userData = payload?.user || payload;
        const roles = userData?.roles || [];

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (roles.includes("ROLE_SELLER")) {
          navigate("/seller");
        } else {
          navigate(redirectTo || "/");
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="col-md-12 login-form">
      <div className="card card-container" style={{ maxWidth: "680px", border: "none", borderRadius: "24px", boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)" }}>
        <div className="text-center mb-3">
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px" }}>
            🔐
          </div>
          <h3 className="mb-2">Welcome back</h3>
          <p className="text-muted mb-0">Choose your role and sign in to continue.</p>
        </div>

        <div className="row g-2 mb-3">
          {roleOptions.map((option) => (
            <div className="col-md-4" key={option.value}>
              <button
                type="button"
                className={`w-100 text-start border rounded-4 p-3 ${selectedRole === option.value ? "shadow-sm" : ""}`}
                onClick={() => setSelectedRole(option.value)}
                style={{
                  background: selectedRole === option.value ? "#f8fbff" : "#fff",
                  borderColor: selectedRole === option.value ? "#2563eb" : "#e5e7eb",
                }}
              >
                <div className="fw-semibold">{option.label}</div>
                <small className="d-block text-muted">{option.description}</small>
              </button>
            </div>
          ))}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isValid }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" className="form-control" />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading || !isValid}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {message && (
        <div className="form-group">
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
