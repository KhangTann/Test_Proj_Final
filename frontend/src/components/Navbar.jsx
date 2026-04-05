import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '1rem', background: '#eee' }}>
      <Link to="/">Trang chủ</Link>
      <Link to="/login">Đăng nhập</Link>
      <Link to="/register">Đăng ký</Link>
    </nav>
  );
}
export default Navbar;