import React, { useState } from "react";
import "./style.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("")

  const fakeDb = {
    email: "as@gmail.com",
    password: "123456",
    role: "seller",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (fakeDb.role === role) {
      if (fakeDb.email === email && fakeDb.password === password && role === fakeDb.role) {
        alert("Login Successful");
        const logedUserDetails = {
    email: email,
    password:password,
    role: role,
  };
    console.log(logedUserDetails);
        return (window.location.href = "http://localhost:3000/xyz");
      }
    }
    return alert("Invalid Credentials");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <img
            src="https://i.ibb.co/wCczj1m/illustration.png"
            alt="illustration"
          />
        </div>
        <div className="login-right">
          <h2>Welcome Back :)</h2>
          <p>
            To keep connected with us please login with your personal
            information by email address and password 🔐
          </p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Justin@ghostlamp.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Role</label>
              <select
                required
                className="input-group-select"
                style={{ height: "40px" }}
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="" disabled selected>
                  Select your role
                </option>
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forget Password?</a>
            </div>
            <button type="submit" className="btn-primary">
              Login Now
            </button>
            <button type="button" className="btn-secondary">
              Create Account
            </button>
          </form>
          <p className="social-text">Or you can join with</p>
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
