import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = localStorage.getItem("resetEmail");

    if (!password || !confirmPassword) {
      alert("Vui lòng nhập mậT khẩu");
      return;
    }

    if (password.length < 6) {
      alert("Độ dài mật khẩu tối thiểu phải 6 kí tự");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu không trùng khớp");
      return;
    }

    try {
      setLoading(true);

      // ✅ Gửi yêu cầu reset password (không cần OTP nữa)
      const response = await axios.post("http://10.0.2.2:8080/api/auth/reset-password", {
        email,
        newPassword: password,
        newPasswordConfirm: confirmPassword,
      });

      if (response.data.success) {
        alert("Mật khẩu đã được đổi thành công");
        localStorage.removeItem("resetEmail");
        history.push("/login");
      } else {
        alert(response.data.message || " Đổi mậT khẩU thấT bại!");
      }
    } catch (error: any) {
      console.error("Đổi mậT khẩU thấT bại:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred while resetting password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <Link to="/login" className="back-link">← Quay trở lại trang đăng nhập</Link>

      <h1 className="reset-title">Tạo 1 mật khẩu mới</h1>
      <p className="reset-subtitle">
        Mật khẩu mới của bạn nên khác mật khẩu trước đó
      </p>

      <form className="reset-form" onSubmit={handleSubmit}>
        <label htmlFor="password" className="reset-label">
          Mật khẩu mới
        </label>
        <input
          id="password"
          type="password"
          className="reset-input"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <small className="reset-hint">
          Tối thiểu là 6 kí tự.
        </small>

        <label htmlFor="confirmPassword" className="reset-label">
          Nhập lại mật khẩu mới
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="reset-input"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="reset-button" disabled={loading}>
          {loading ? "Creating..." : "Tạo mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
