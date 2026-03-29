import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "./slices/auth";
import { clearMessage } from "./slices/message";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect");

  if (isLoggedIn && currentUser) {
    return (
      <Navigate
        to={
          currentUser.roles.includes("ROLE_ADMIN")
            ? "/seller"
            : redirectTo || "/"
        }
      />
    );
  }

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
      .then((user) => {
        if (user.roles.includes("ROLE_ADMIN")) {
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
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />
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
