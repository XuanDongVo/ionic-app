import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("⚠️ Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      // GỌI API GỬI MÃ XÁC NHẬN
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: email,
      });

      if (response.data.success) {
        localStorage.setItem("resetEmail", email);
        setMessage("✅ Verification code has been sent to your email.");
        // Chờ 1–2s rồi chuyển sang trang nhập mã
        setTimeout(() => {
          history.push("/verify-email");
        }, 1500);
      } else {
        setError(response.data.message || "❌ Failed to send reset code.");
      }
    } catch (err: any) {
      setError("❌ Error sending email. Please check your address or try again later.");
    } finally {
      setLoading(false);
    }
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

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <button type="submit" className="forgot-button" disabled={loading}>
          {loading ? "Sending..." : "Send Code"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
