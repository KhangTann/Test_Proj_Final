import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('users/login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/');
    } catch (err) {
      setError('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <div className="travel-illustration-card">
          <h2>TourBooking</h2>
          <p>Tận hưởng hành trình với giao diện mới, vẫn giữ nguyên toàn bộ chức năng đăng nhập.</p>
        </div>
      </div>

      <div className="login-form-section">
        <div className="form-wrapper">
          <h2 className="form-title">ĐĂNG NHẬP</h2>
          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-login">
              Đăng nhập
            </button>
          </form>

          <div className="register-footer">
            <span>Chưa có tài khoản? </span>
            <Link to="/register" className="register-link">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
