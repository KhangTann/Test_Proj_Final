
// function Register() {
//   return (
//     <div>
//       <h1>Trang Đăng Ký</h1>
//       <p>Vui lòng chọn vai trò: Người đặt tour hoặc Người tạo tour.</p>
//     </div>
//   );
// }

// export default Register; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import travelImg from '../../assets/travel.png';

export default function Register() {
  const [gender, setGender] = useState('male');

  return (
    <div className="register-container">
      {/* Bên trái: Hình ảnh minh họa (Dùng chung với Login) */}
      <div className="register-image-section">
        <img src={travelImg} alt="Travel Illustration" className="illustration" />
      </div>

      {/* Bên phải: Form đăng ký */}
      <div className="register-form-section">
        <div className="reg-form-wrapper">
          <h2 className="reg-form-title">ĐĂNG KÝ</h2>
          
          <form className="register-form">
            <div className="reg-input-group">
              <label>Tên: <span>*</span></label>
              <input type="text" placeholder="Nhập họ và tên" required />
            </div>

            <div className="reg-input-group">
              <label>Số điện thoại: <span>*</span></label>
              <input type="text" placeholder="Nhập số điện thoại" required />
            </div>

            <div className="reg-input-group">
              <label>Email:</label>
              <input type="email" placeholder="Nhập địa chỉ email" />
            </div>

            <div className="reg-input-group">
              <label>Địa chỉ:</label>
              <input type="text" placeholder="Nhập địa chỉ của bạn" />
            </div>

            {/* Phần chọn giới tính */}
            <div className="reg-input-group">
              <label>Giới tính:</label>
              <div className="gender-options">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={gender === 'male'} 
                    onChange={() => setGender('male')} 
                  />
                  <span className="custom-radio"></span> Nam
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={gender === 'female'} 
                    onChange={() => setGender('female')} 
                  />
                  <span className="custom-radio"></span> Nữ
                </label>
              </div>
            </div>

            <div className="reg-input-group">
              <label>Mật khẩu: <span>*</span></label>
              <input type="password" placeholder="Nhập mật khẩu" required />
            </div>

            <div className="reg-input-group">
              <label>Nhập lại mật khẩu: <span>*</span></label>
              <input type="password" placeholder="Xác nhận mật khẩu" required />
            </div>

            <button type="submit" className="btn-finish">HOÀN TẤT</button>

            <div className="login-footer">
              <p>Đã có tài khoản?</p>
              <Link to="/login" className="login-now-link">Đăng nhập ngay</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}