import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-kicker">Chào mừng đến với TourBooking</p>
          <h1 className="hero-title">Khám phá điểm đến mơ ước cùng chúng tôi</h1>
          <p className="hero-subtitle">
            Giao diện theo phong cách day5_ha, nhưng vẫn giữ nguyên luồng tìm kiếm,
            đặt tour và quản trị của Testttt.
          </p>
          <div className="hero-cta-group">
            <Link to="/search" className="hero-btn hero-btn-primary">Tìm kiếm tour</Link>
            <Link to="/register" className="hero-btn hero-btn-secondary">Đăng ký tài khoản</Link>
          </div>
        </div>
      </header>

      <section className="home-feature-grid">
        <article className="feature-card">
          <h3>Đa dạng tour</h3>
          <p>Từ tour nghỉ dưỡng đến trekking, gồm nhiều lịch trình và khoảng giá để chọn.</p>
        </article>
        <article className="feature-card">
          <h3>Đặt chỗ nhanh</h3>
          <p>Tìm tour theo địa điểm, giá, ngày khởi hành và đặt chỗ trong vài bước.</p>
        </article>
        <article className="feature-card">
          <h3>Đánh giá thực tế</h3>
          <p>Xem nhận xét người dùng ngay trên trang chi tiết tour để chọn đúng nhu cầu.</p>
        </article>
      </section>
    </div>
  );
}

export default Home;
