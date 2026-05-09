import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Map } from 'lucide-react';
import api from '../api';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (token) {
      api.get('users/me/')
        .then(res => setUser(res.data))
        .catch(() => handleLogout());
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className="header-container">
      <nav className="app-navbar">
        <div className="navbar-logo">
          <Link to="/" className="logo-mark" aria-label="Trang chủ TourBooking">
            TB
          </Link>
          <span>TourBooking</span>
        </div>

        <div className="navbar-center">
          <ul className="navbar-links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/search">Khám phá</Link></li>
            {user?.role === 'ADMIN' && (
              <li><Link to="/admin">Quản trị</Link></li>
            )}
            {user?.role === 'CREATOR' && (
              <li><Link to="/creator/dashboard">Quản lý tour</Link></li>
            )}
          </ul>
        </div>

        <div className="navbar-actions">
          <form onSubmit={handleSearch} className="search-inline-form">
            <input
              type="text"
              placeholder="Tìm kiếm tour..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn-search" aria-label="Tìm kiếm tour">
              <Search size={17} />
            </button>
          </form>

          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="pill-action admin-pill"><Shield size={15} />Quản trị</Link>
          )}
          {user?.role === 'CREATOR' && (
            <Link to="/creator/dashboard" className="pill-action creator-pill"><Map size={15} />Đối tác</Link>
          )}

          <div className="auth-buttons">
            {token ? (
              <>
                <Link to="/profile" className="auth-link username-link">{user?.username || 'Tài khoản'}</Link>
                <span className="auth-divider">|</span>
                <button onClick={handleLogout} className="auth-btn-text">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">Đăng nhập</Link>
                <span className="auth-divider">/</span>
                <Link to="/register" className="auth-link">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
