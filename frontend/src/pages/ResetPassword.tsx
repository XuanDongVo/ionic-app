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

    if (!email) {
      alert("Missing verification data. Please verify your email again.");
      history.push("/forgot-password");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ Gửi yêu cầu reset password (không cần OTP nữa)
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", {
        email,
        newPassword: password,
        newPasswordConfirm: confirmPassword,
      });

      if (response.data.success) {
        alert("✅ Password reset successful! Please login again.");
        localStorage.removeItem("resetEmail");
        history.push("/login");
      } else {
        alert(response.data.message || "❌ Reset password failed!");
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
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
      <Link to="/login" className="back-link">← Back to Login</Link>

      <h1 className="reset-title">Create a New Password</h1>
      <p className="reset-subtitle">
        Your new password should be different from the previous one
      </p>

      <form className="reset-form" onSubmit={handleSubmit}>
        <label htmlFor="password" className="reset-label">
          New Password
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
          Minimum 8 characters, use a mix of numbers and letters.
        </small>

        <label htmlFor="confirmPassword" className="reset-label">
          Retype New Password
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
          {loading ? "Creating..." : "Create Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
