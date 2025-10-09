import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./VerifyEmail.css";

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState("");
  const history = useHistory();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      alert("Please enter the verification code");
      return;
    }

    console.log("Verifying code:", code);
    // Sau khi xác thực thành công, có thể chuyển hướng tới reset password hoặc home
    // history.push("/reset-password");
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

        <button type="submit" className="verify-button">
          Verify
        </button>
      </form>

      <div className="verify-resend">
        Didn’t get the code?{" "}
        <span className="resend-link" onClick={() => alert("Code resent!")}>
          Resend
        </span>
      </div>
    </div>
  );
};

export default VerifyEmail;
