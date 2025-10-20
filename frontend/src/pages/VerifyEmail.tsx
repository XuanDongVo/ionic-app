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
    try {
      const res = await fetch("http://10.0.2.2:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        history.push("/reset-password");
      } else {
        alert(data.message || "Xác thực thất bại.");
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      alert("Lỗi");
    }
  };


  const handleResend = async () => {
    try {
      const res = await fetch("http://10.0.2.2:8080/api/auth/resend-otp", {
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
        ← Quay trở lại trang đăng nhập
      </button>

      <h1 className="verify-title">Xác thực Email</h1>
      <p className="verify-subtitle">
        Vui lòng nhập mã xác thực đƯợc gửi từ email của bạn
      </p>

      <form className="verify-form" onSubmit={handleVerify}>
        <label htmlFor="code" className="verify-label">
          Mã xác thực
        </label>
        <input
          id="code"
          type="text"
          className="verify-input"
          placeholder="Nhập mã 6 số"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="verify-button" disabled={loading}>
          {loading ? "Verifying..." : "Xác thực"}
        </button>
      </form>

      <div className="verify-resend">
        Bạn không nhận được mã?{" "}
        <span className="resend-link" onClick={handleResend}>
          Gửi lại
        </span>

      </div>
    </div>
  );
};

export default VerifyEmail;
