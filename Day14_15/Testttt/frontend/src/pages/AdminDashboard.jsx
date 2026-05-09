import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock,
  TrendingUp,
  Package,
  UserCheck,
  Clock,
  PieChart,
  DollarSign
} from 'lucide-react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [tours, setTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get('users/me/');
        if (res.data.role !== 'ADMIN') {
          navigate('/');
        }
      } catch (err) {
        navigate('/login');
      }
    };
    checkAdmin();
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await api.get('admin/stats/');
      setStats(res.data);
    } catch (err) {
      setError("Không thể tải thông tin thống kê.");
    }
  };

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await api.get('tours/admin/list/');
      setTours(res.data);
    } catch (err) {
      setError("Không thể tải danh sách tour.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('users/admin/list/');
      setUsers(res.data);
    } catch (err) {
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tours') fetchTours();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'revenue') fetchRevenue();
  }, [activeTab]);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await api.get('bookings/revenue/admin/');
      setRevenueData(res.data);
    } catch (err) {
      setError('Không thể tải dữ liệu doanh thu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTourStatus = async (id, status) => {
    try {
      await api.patch(`tours/admin/${id}/status/`, { status });
      fetchTours();
      fetchStats();
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  const handleToggleUserStatus = async (id) => {
    try {
      await api.patch(`users/admin/${id}/toggle-active/`);
      fetchUsers();
    } catch (err) {
      alert("Cập nhật thất bại");
    }
  };

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-md shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <LayoutDashboard size={20} /> Tổng quan
        </button>
        <button 
          onClick={() => setActiveTab('tours')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'tours' ? 'bg-primary text-white shadow-md shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Map size={20} /> Quản lý Tour
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-md shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Users size={20} /> Người dùng
        </button>
        <button 
          onClick={() => setActiveTab('revenue')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'revenue' ? 'bg-primary text-white shadow-md shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <PieChart size={20} /> Doanh thu
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển hệ thống</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Tổng người dùng" value={stats?.total_users || 0} icon={Users} color="bg-blue-600" />
              <StatsCard title="Tổng Tour" value={stats?.total_tours || 0} icon={Package} color="bg-purple-600" />
              <StatsCard title="Phí nền tảng (20%)" value={`${Number(stats?.admin_revenue || 0).toLocaleString()} ₫`} icon={TrendingUp} color="bg-green-600" />
              <StatsCard title="Chờ duyệt" value={stats?.pending_tours || 0} icon={Clock} color="bg-orange-600" />
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg"><DollarSign size={20} className="text-white"/></div>
                  <span className="font-bold text-green-800 text-sm uppercase tracking-wide">Tổng giao dịch</span>
                </div>
                <p className="text-3xl font-black text-green-900">{Number(stats?.total_revenue || 0).toLocaleString()} ₫</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg"><TrendingUp size={20} className="text-white"/></div>
                  <span className="font-bold text-purple-800 text-sm uppercase tracking-wide">Phí Admin (20%)</span>
                </div>
                <p className="text-3xl font-black text-purple-900">{Number(stats?.admin_revenue || 0).toLocaleString()} ₫</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg"><Users size={20} className="text-white"/></div>
                  <span className="font-bold text-blue-800 text-sm uppercase tracking-wide">Thu Creator (80%)</span>
                </div>
                <p className="text-3xl font-black text-blue-900">{Number(stats?.creator_revenue || 0).toLocaleString()} ₫</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gray-800">Chào mừng Admin!</h3>
            <p className="text-gray-600">Đây là khu vực quản trị dành riêng cho việc vận hành hệ thống TourBooking. Bạn có thể kiểm soát các tour mới đăng và quản lý tài khoản người dùng tại đây.</p>
          </div>
        )}

        {activeTab === 'tours' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Tour Du Lịch</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">ID</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Tên Tour</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Giá</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Trạng thái</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tours.map(tour => (
                    <tr key={tour.tour_id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">#{tour.tour_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{tour.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{Number(tour.price).toLocaleString()} ₫</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          tour.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                          tour.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {tour.status === 'APPROVED' ? 'Đã duyệt' : tour.status === 'PENDING' ? 'Mới' : 'Từ chối'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {tour.status !== 'APPROVED' && (
                            <button 
                              onClick={() => handleUpdateTourStatus(tour.tour_id, 'APPROVED')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Phê duyệt"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {tour.status !== 'REJECTED' && (
                            <button 
                              onClick={() => handleUpdateTourStatus(tour.tour_id, 'REJECTED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Từ chối"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tours.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">Không có dữ liệu tour.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Người Dùng</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Tên người dùng</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Vai trò</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Trạng thái</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Khóa/Mở</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.user_id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {user.username[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'CREATOR' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.is_active ? (
                          <span className="flex items-center text-green-600 gap-1"><UserCheck size={14}/> Hoạt động</span>
                        ) : (
                          <span className="flex items-center text-red-600 gap-1"><Lock size={14}/> Bị khóa</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button 
                          onClick={() => handleToggleUserStatus(user.user_id)}
                          className={`p-2 rounded-lg transition ${user.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={user.is_active ? "Khóa tài khoản" : "Mở khóa"}
                        >
                          {user.is_active ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Báo cáo Doanh thu</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Tổng giao dịch</p>
                <p className="text-3xl font-black text-green-900">{Number(revenueData?.summary?.total_revenue || 0).toLocaleString()} ₫</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Phí nền tảng (20%)</p>
                <p className="text-3xl font-black text-purple-900">{Number(revenueData?.summary?.admin_share_20pct || 0).toLocaleString()} ₫</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border border-blue-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Trả Creator (80%)</p>
                <p className="text-3xl font-black text-blue-900">{Number(revenueData?.summary?.creator_share_80pct || 0).toLocaleString()} ₫</p>
              </div>
            </div>

            {/* Revenue Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Booking</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Tour</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Creator</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600">Tổng tiền</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 text-purple-700">Admin (20%)</th>
                    <th className="px-6 py-4 text-sm font-bold text-gray-600 text-blue-700">Creator (80%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(revenueData?.records || []).map(r => (
                    <tr key={r.revenue_id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">#{r.booking_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.tour_title}</td>
                      <td className="px-6 py-4 text-sm text-blue-700 font-semibold">{r.creator_username}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{Number(r.total_amount).toLocaleString()} ₫</td>
                      <td className="px-6 py-4 text-sm font-bold text-purple-700">{Number(r.admin_share).toLocaleString()} ₫</td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-700">{Number(r.creator_share).toLocaleString()} ₫</td>
                    </tr>
                  ))}
                  {(!revenueData?.records || revenueData.records.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic">Chưa có dữ liệu doanh thu. Hãy xác nhận một giao dịch thanh toán trước.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
