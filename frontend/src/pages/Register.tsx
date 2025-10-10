import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const history = useHistory();

  return (
    <div className="register-container">
      <div className="register-box">
        <Link to="/login">
          ← Back to Login
        </Link>

        <h1 className="register-title">Register</h1>
        <p className="register-subtitle">And start taking notes</p>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Example: John Doe" />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="Example: johndoe@gmail.com" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="********" />
        </div>

        <div className="form-group">
          <label>Retype Password</label>
          <input type="password" placeholder="********" />
        </div>

        <button className="register-btn">
          Register <span className="arrow">→</span>
        </button>

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