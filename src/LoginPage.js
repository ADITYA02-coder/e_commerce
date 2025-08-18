import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { register } from "./slices/auth";
import { clearMessage } from "./slices/message";

const LoginPage = () => {
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) =>
          val &&
          val.toString().length >= 6 &&
          val.toString().length <= 40
      )
      .required("This field is required!"),
  });

  const handleRegister = (formValue) => {
    const { username, email, password } = formValue;

    setSuccessful(false);

    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
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
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="social-icons">
                  <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="Google"
                  />
                  <img
                    src="https://img.icons8.com/color/48/facebook-new.png"
                    alt="Facebook"
                  />
                  <img
                    src="https://img.icons8.com/color/48/twitter.png"
                    alt="Twitter"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block" >Sign Up</button>
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>

      {message && (
        <div className="form-group">
          <div
            className={successful ? "alert alert-success" : "alert alert-danger"}
            role="alert"
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;


























// import React, { useState } from "react";
// import "./style.css";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("")

//   const fakeDb = {
//     email: "as@gmail.com",
//     password: "123456",
//     role: "seller",
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (fakeDb.role === role) {
//       if (fakeDb.email === email && fakeDb.password === password && role === fakeDb.role) {
//         alert("Login Successful");
//         const logedUserDetails = {
//     email: email,
//     password:password,
//     role: role,
//   };
//     console.log(logedUserDetails);
//         return (window.location.href = "http://localhost:3000/seller");
//       }
//     }
//     return alert("Invalid Credentials");
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-left">
//           <img
//             src="https://i.ibb.co/wCczj1m/illustration.png"
//             alt="illustration"
//           />
//         </div>
//         <div className="login-right">
//           <h2>Welcome Back :)</h2>
//           <p>
//             To keep connected with us please login with your personal
//             information by email address and password 🔐
//           </p>
//           <form onSubmit={handleLogin}>
//             <div className="input-group">
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Justin@ghostlamp.io"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label>Role</label>
//               <select
//                 required
//                 className="input-group-select"
//                 style={{ height: "40px" }}
//                 onChange={(e) => setRole(e.target.value)}
//                 value={role}
//               >
//                 <option value="" disabled selected>
//                   Select your role
//                 </option>
//                 <option value="user">User</option>
//                 <option value="seller">Seller</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <div className="options">
//               <label>
//                 <input type="checkbox" /> Remember Me
//               </label>
//               <a href="#">Forget Password?</a>
//             </div>
//             <button type="submit" className="btn-primary">
//               Login Now
//             </button>
//             <button type="button" className="btn-secondary">
//               Create Account
//             </button>
//           </form>
//           <p className="social-text">Or you can join with</p>
//           <div className="social-icons">
//             <img
//               src="https://img.icons8.com/color/48/google-logo.png"
//               alt="Google"
//             />
//             <img
//               src="https://img.icons8.com/color/48/facebook-new.png"
//               alt="Facebook"
//             />
//             <img
//               src="https://img.icons8.com/color/48/twitter.png"
//               alt="Twitter"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
