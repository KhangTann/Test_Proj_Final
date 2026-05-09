import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setSuccess('');
      return;
    }
    try {
      await api.post('users/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data) {
        const errObj = err.response.data;
        const key = Object.keys(errObj)[0];
        setError(Array.isArray(errObj[key]) ? errObj[key][0] : JSON.stringify(errObj[key]));
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-image-section">
        <div className="register-illustration-card">
          <h2>Bắt đầu hành trình</h2>
          <p>Tạo tài khoản mới với giao diện day5_ha và sử dụng đầy đủ chức năng của Testttt.</p>
        </div>
      </div>
      <div className="register-form-section">
        <div className="reg-form-wrapper">
          <h2 className="reg-form-title">ĐĂNG KÝ</h2>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form className="register-form" onSubmit={handleRegister}>
            <div className="reg-input-group">
              <label>Tên đăng nhập</label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="reg-input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="reg-input-group">
              <label>Mật khẩu</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="reg-input-group">
              <label>Xác nhận mật khẩu</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="reg-input-group">
              <label>Vai trò</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">Khách du lịch</option>
                <option value="CREATOR">Nhà cung cấp tour</option>
              </select>
            </div>
            <button type="submit" className="btn-finish">
              Hoàn tất
            </button>
          </form>
          <div className="login-footer">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="login-now-link">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
