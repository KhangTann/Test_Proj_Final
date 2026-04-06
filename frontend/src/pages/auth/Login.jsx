import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import travelImg from '../../assets/travel.png'; // Đường dẫn dựa trên cấu trúc folder của bạn

export default function Login() {
  return (
    <div className="login-container">
      {/* Bên trái: Hình ảnh minh họa */}
      <div className="login-image-section">
        <img src={travelImg} alt="Travel Illustration" className="illustration" />
      </div>

      {/* Bên phải: Form đăng nhập */}
      <div className="login-form-section">
        <div className="form-wrapper">
          <h2 className="form-title">ĐĂNG NHẬP</h2>
          
          <form className="login-form">
            <div className="input-group">
              <label>Số điện thoại: <span>*</span></label>
              <input type="text" placeholder="Nhập số điện thoại" required />
            </div>

            <div className="input-group">
              <label>Mật khẩu: <span>*</span></label>
              <input type="password" placeholder="Nhập mật khẩu" required />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Nhớ mật khẩu</span>
              </label>
              <Link to="/forgot-password" name="forgot-password" className="forgot-link">
                Quên mật khẩu
              </Link>
            </div>

            <button type="submit" className="btn-login">ĐĂNG NHẬP</button>

            <div className="register-footer">
              <p>Chưa có tài khoản?</p>
              <Link to="/register" className="register-link">Đăng ký ngay</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}