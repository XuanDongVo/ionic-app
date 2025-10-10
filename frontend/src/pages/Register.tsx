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
      setError('Passwords do not match!');
      return;
    }

     if(password.length<8){
        setError('Password Length is bigger or equal 8');
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
        // alert('Đăng ký thành công!');
        history.push('/login');
      } else {
        setError(response.data.message || 'Register Fail!');
      }
    } catch (err: any) {
      setError('Register Fail!! Again please.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <Link to="/login">← Back to Login</Link>

        <h1 className="register-title">Register</h1>
        <p className="register-subtitle">And start taking notes</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Example: John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <label>Retype Password</label>
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
            {loading ? 'Registering...' : <>Register <span className="arrow">→</span></>}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{' '}
          <a href="#" onClick={() => history.push('/login')}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
