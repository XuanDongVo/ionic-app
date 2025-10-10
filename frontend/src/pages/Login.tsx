import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom"; // ⚠️ dùng useHistory thay vì useNavigate
import axios from "axios";
import './Login.css';

const Login: React.FC = () => {
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.data.token);
                // alert("Đăng nhập thành công!");
                history.push("/home"); 
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            setError("Login fail! Please check your input");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Let’s Login</h1>
                <p className="login-subtitle">And notes your idea</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Example: johndoe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Link to="/forgot-password" className="forgot-password">
                        Forgot Password
                    </Link>

                    {error && <p className="error-text">{error}</p>}

                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : <>Login <span className="arrow">→</span></>}
                    </button>
                </form>

                {/* <div className="divider">
                    <span>Or</span>
                </div> */}

                {/* <button className="google-btn">
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
                    Login with Google
                </button> */}

                <p className="register-text">
                    Don’t have any account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
