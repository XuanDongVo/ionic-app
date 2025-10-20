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
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      // GỌI API GỬI MÃ XÁC NHẬN
      const response = await axios.post("http://10.0.2.2:8080/api/auth/forgot-password", {
        email: email,
      });

      if (response.data.success) {
        localStorage.setItem("resetEmail", email);
        setMessage("Mã xác thực đã được chuyển vui lòng kiểm tra trong email");
        setTimeout(() => {
          history.push("/verify-email");
        }, 1000);
      } else {
        setError(response.data.message || "Lỗi gửi mã");
      }
    } catch (err: any) {
      setError("Lỗi gửi mã, Vui lòng kiểm tra lại email và thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <button className="back-link" onClick={() => history.push("/login")}>
        ← Quay lại trang đăng nhập
      </button>

      <h1 className="forgot-title">Quên mật khẩu</h1>
      <p className="forgot-subtitle">
        Nhập email của bạn để xác thực và tiến hành đổi mật khẩu
      </p>

      <form className="forgot-form" onSubmit={handleSendCode}>
        <label htmlFor="email" className="forgot-label">
          Địa chỉ Email
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
          {loading ? "Sending..." : "Gửi mã"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
