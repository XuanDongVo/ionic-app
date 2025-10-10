import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./VerifyEmail.css";

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || ""); // lấy email đã lưu khi forgot
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !email) {
      alert("Please enter the verification code and email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // alert("Verification successful!");
        // localStorage.setItem("resetEmail", email);
        // localStorage.setItem("resetOtp", otp);

        history.push("/reset-password");
      } else {
        alert(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("Something went wrong while verifying code.");
    }
  };


  const handleResend = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // truyền lại email đang nhập
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "OTP resent successfully!");
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Something went wrong while resending OTP");
    }
  };


  return (
    <div className="verify-container">
      <button className="back-link" onClick={() => history.push("/login")}>
        ← Back to Login
      </button>

      <h1 className="verify-title">Verify Email</h1>
      <p className="verify-subtitle">
        Please enter the verification code sent to your email
      </p>

      <form className="verify-form" onSubmit={handleVerify}>
        <label htmlFor="code" className="verify-label">
          Verification Code
        </label>
        <input
          id="code"
          type="text"
          className="verify-input"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="verify-button" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="verify-resend">
        Didn’t get the code?{" "}
        <span className="resend-link" onClick={handleResend}>
          Resend
        </span>

      </div>
    </div>
  );
};

export default VerifyEmail;
