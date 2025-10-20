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
            const response = await axios.post("http://10.0.2.2:8080/api/auth/login", {
                email,
                password,
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.data.token);
                history.push("/home");
            } else {
                setError(response.data.message);
            }
        } catch (err: any) {
            setError("Đăng nhập thất bại vui lòng kiểm tra lại email và mật khẩu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Hãy bắt đầu đăng nhập</h1>
                <p className="login-subtitle">Và thực hiện những kế hoạch của bạn</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Địa chỉ Email</label>
                        <input
                            type="email"
                            placeholder="Example: johndoe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Link to="/forgot-password" className="forgot-password">
                        Quên mật khẩu
                    </Link>

                    {error && <p className="error-text">{error}</p>}

                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : <>Đăng nhập <span className="arrow">→</span></>}
                    </button>
                </form>

                <p className="register-text">
                    Nếu bạn chưa có tài khoản <Link to="/register">Hãy đăng kí ngay tại đây</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
