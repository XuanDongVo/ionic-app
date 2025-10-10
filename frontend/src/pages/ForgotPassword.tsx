import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    console.log("Sending code to:", email);
    // Sau khi gửi mã thành công có thể chuyển sang verify email
    // history.push("/verify-email");
  };

  return (
    <div className="forgot-container">
      <button className="back-link" onClick={() => history.push("/login")}>
        ← Back to Login
      </button>

      <h1 className="forgot-title">Forgot Password</h1>
      <p className="forgot-subtitle">
        Insert your email address to receive a code for creating a new password
      </p>

      <form className="forgot-form" onSubmit={handleSendCode}>
        <label htmlFor="email" className="forgot-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="forgot-input"
          placeholder="Example: anto_michael@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="forgot-button">
          Send Code
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;