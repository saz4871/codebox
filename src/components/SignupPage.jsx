import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { register } from '../api';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await register({ name, email, password, role: 'user' });
      if (response.status === 201) {
        alert(`Account created for ${name}`);
        navigate("/login");
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Your Account</h2>
        <p>Join CodeBox and start building your developer profile.</p>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="ikram"
            />
          </div>

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
              placeholder="Create a secure password"
            />
          </div>

          <div className="button-container">
            <button type="submit">Sign Up</button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
