import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register: React.FC = () => {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

     if(password.length<6){
        setError('Độ dài mật khẩu phải lớn hơn 6');
        return;
      }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
      });

     

      if (response.data.success) {
        history.push('/login');
      } else {
        setError(response.data.message || 'Register Fail!');
      }
    } catch (err: any) {
      setError('Đăng kí thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <Link to="/login">← Quay lại trang đăng nhập</Link>

        <h1 className="register-title">Đăng kí</h1>
        <p className="register-subtitle">Và bắt đầu lên kế hoạch</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Tên</label>
            <input
              type="text"
              placeholder="Example: John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <label>Xác nhận lại mật khẩu</label>
            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : <>Đăng kí <span className="arrow">→</span></>}
          </button>
        </form>

        <p className="login-text">
          Bạn đã có tài khoản?{' '}
          <a href="#" onClick={() => history.push('/login')}>
            Hãy đăng nhập ở đây
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
