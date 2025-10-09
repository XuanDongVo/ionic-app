import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !retypePassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== retypePassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("New password:", password);
    // Gửi API đặt lại mật khẩu ở đây
    // Sau khi thành công:
    // history.push("/login");
  };

  return (
    <div className="reset-container">
      <Link to="/login">
                ← Back to Login
              </Link>

      <h1 className="reset-title">Create a New Password</h1>
      <p className="reset-subtitle">
        Your new password should be different from the previous password
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
          min. 8 character, combination of 0-9, A-Z, a-z
        </small>

        <label htmlFor="retypePassword" className="reset-label">
          Retype New Password
        </label>
        <input
          id="retypePassword"
          type="password"
          className="reset-input"
          placeholder="********"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
        />

        <button type="submit" className="reset-button">
          Create Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
