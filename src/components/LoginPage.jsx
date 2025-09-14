import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./Login.css";
import { login } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const errorRef = useRef(null);
  const loginBoxRef = useRef(null);
  
  // Apply a single animation for the login box on mount
  useEffect(() => {
    if (loginBoxRef.current) {
        gsap.fromTo(loginBoxRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
    }
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const loginButton = e.target.querySelector('button[type="submit"]');
    gsap.to(loginButton, { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1 });

    try {
      // Simulate API call
      const response = {
        data: { token: "your-super-secret-token" }
      };

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        gsap.to(loginBoxRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          onComplete: () => {
            navigate("/dashboard");
          },
        });
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      setError(
        "Login failed: " +
        (err.response?.data?.message || "An unexpected error occurred.")
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" ref={loginBoxRef}>
        <h2>Welcome Back</h2>
        <p>Please login to your CodeBox account</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="button-container">
            <button type="submit">Login</button>
          </div>
        </form>

        {error && <p ref={errorRef} className="error-message">{error}</p>}
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
