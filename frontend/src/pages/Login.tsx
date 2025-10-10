import React from 'react';
import { Link } from "react-router-dom";
import './Login.css';

const Login: React.FC = () => {
    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Let’s Login</h1>
                <p className="login-subtitle">And notes your idea</p>

                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Example: johndoe@gmail.com" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="********" />
                </div>

                <Link to="/forgot-password" className="forgot-password">
                    Forgot Password
                </Link>

                <button className="login-btn">
                    Login <span className="arrow">→</span>
                </button>

                <div className="divider">
                    <span>Or</span>
                </div>

                <button className="google-btn">
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
                    Login with Google
                </button>

                <p className="register-text">
                    Don’t have any account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;