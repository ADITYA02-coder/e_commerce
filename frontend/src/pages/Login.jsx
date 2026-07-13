import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const rolePath = currentUser?.roles?.includes("ROLE_ADMIN")
    ? "/admin"
    : currentUser?.roles?.includes("ROLE_SELLER")
      ? "/seller"
      : redirectTo || "/";

  const roleOptions = [
    { value: "customer", label: "Customer", description: "Shop and manage your orders" },
    { value: "seller", label: "Seller", description: "Add products and run your store" },
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
    <div className="auth-shell login-form">
      <div className="auth-card card-container">
        <div className="auth-side-panel auth-side-panel--login col-lg-5">
          <div className="auth-badge">🔐</div>
          <h2>Welcome back</h2>
          <p>
            Sign in to continue your journey with a seamless shopping, selling, or management experience.
          </p>
          <ul>
            <li>✓ Track your orders and wishlist</li>
            <li>✓ Manage your products and storefront</li>
            <li>✓ Access your profile and dashboard</li>
          </ul>
        </div>

        <div className="auth-form-panel col-lg-7">
          <div className="text-center mb-3">
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "22px" }}>
              ✦
            </div>
            <h3>Welcome back</h3>
            <p className="text-muted mb-0">Choose customer or seller and sign in to continue.</p>
          </div>

          <div className="auth-role-grid">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`auth-role-card text-start ${selectedRole === option.value ? "active" : ""}`}
                onClick={() => setSelectedRole(option.value)}
              >
                <div className="fw-semibold">{option.label}</div>
                <small>{option.description}</small>
              </button>
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
                  <Field name="username" type="text" className="auth-input-field form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger auth-alert"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field name="password" type="password" className="auth-input-field form-control" />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger auth-alert"
                  />
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary auth-submit"
                    disabled={loading || !isValid}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="auth-link-row">
            <Link to="/signup">Create a new account</Link>
          </div>
        </div>
      </div>

      {message && (
        <div className="form-group">
          <div className="alert alert-danger auth-alert" role="alert">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
