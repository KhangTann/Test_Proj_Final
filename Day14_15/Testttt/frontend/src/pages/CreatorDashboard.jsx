import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  DollarSign,
  Users as UsersIcon,
  Info,
  Edit,
  TrendingUp,
  PieChart
} from 'lucide-react';

function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState('my-tours');
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States for Create/Edit
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_id: '',
    price: '',
    start_date: '',
    end_date: '',
    max_people: '',
    images: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toursRes, locRes] = await Promise.all([
        api.get('tours/my-tours/'),
        api.get('tours/locations/')
      ]);
      setTours(toursRes.data);
      setLocations(locRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await api.get('bookings/revenue/creator/');
      setRevenueData(res.data);
    } catch (err) {
      console.error('Lỗi tải doanh thu', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'revenue') fetchRevenue();
  }, [activeTab]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location_id: '',
      price: '',
      start_date: '',
      end_date: '',
      max_people: '',
      images: []
    });
    setEditingTour(null);
  };

  const handleEditClick = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      location_id: tour.location?.location_id || '',
      price: tour.price,
      start_date: tour.start_date.split('T')[0],
      end_date: tour.end_date.split('T')[0],
      max_people: tour.max_people,
      images: [] 
    });
    setActiveTab('create'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTour) {
        await api.patch(`tours/${editingTour.tour_id}/update/`, formData);
        alert("Cập nhật tour thành công! Tour đang chờ duyệt lại.");
      } else {
        await api.post('tours/create/', formData);
        alert("Tạo tour thành công! Đang chờ admin duyệt.");
      }
      resetForm();
      setActiveTab('my-tours');
      fetchData();
    } catch (err) {
      alert("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto mb-20">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <LayoutDashboard className="text-primary" /> Kênh Đối Tác
            </h2>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Creator Center</p>
        </div>
        
        <div className="space-y-2">
            <button 
                onClick={() => { setActiveTab('my-tours'); resetForm(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'my-tours' ? 'bg-primary text-white shadow-xl shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <MapIcon size={20} /> Tour của tôi
            </button>
            <button 
                onClick={() => { setActiveTab('create'); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'create' ? 'bg-primary text-white shadow-xl shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                {editingTour ? <Edit size={20} /> : <PlusCircle size={20} />}
                {editingTour ? 'Chỉnh sửa Tour' : 'Đăng Tour mới'}
            </button>
            <button 
                onClick={() => setActiveTab('revenue')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'revenue' ? 'bg-primary text-white shadow-xl shadow-purple-200' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <PieChart size={20} /> Doanh thu
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'my-tours' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Danh sách Tour đã đăng</h2>
                <p className="text-sm text-gray-400 font-medium">Quản lý và theo dõi trạng thái các tour của bạn</p>
              </div>
              <button 
                onClick={() => setActiveTab('create')}
                className="bg-primary text-white p-3 rounded-2xl shadow-lg hover:rotate-90 transition-all duration-500"
              >
                <PlusCircle size={24} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5 text-left">Thông tin Tour</th>
                    <th className="px-8 py-5 text-left">Giá & Chi tiết</th>
                    <th className="px-8 py-5 text-left">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tours.map(tour => (
                    <tr key={tour.tour_id} className="group hover:bg-purple-50/30 transition-colors duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-inner group-hover:scale-110 transition duration-500">
                            {tour.images?.[0] ? (
                                <img src={`/images/${tour.images[0].image_url}`} onError={(e)=>e.target.src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"><MapIcon /></div>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 group-hover:text-primary transition-colors">{tour.title}</div>
                            <div className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-1">
                                <Calendar size={12}/> {new Date(tour.start_date).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-lg text-gray-900">{Number(tour.price).toLocaleString()} ₫</div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                            <UsersIcon size={12}/> {tour.max_people} chỗ
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          tour.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                          tour.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {tour.status === 'APPROVED' ? <CheckCircle size={14}/> : tour.status === 'PENDING' ? <Clock size={14}/> : <XCircle size={14}/>}
                          {tour.status === 'APPROVED' ? 'Đã duyệt' : tour.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleEditClick(tour)}
                          className="p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tours.length === 0 && (
                <div className="p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <MapIcon size={40} />
                    </div>
                    <p className="text-gray-400 font-bold italic">Bạn chưa tạo tour nào khởi hành.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 animate-in slide-in-from-right-8 duration-700">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {editingTour ? 'Cập nhật chuyến đi' : 'Đăng Tour du lịch mới'}
                </h2>
                <p className="text-gray-500 font-medium">Vui lòng điền đầy đủ các thông tin chi tiết về chuyến hành trình</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên Tour</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                    placeholder="VD: Tour khám phá Đà Lạt 3N2Đ"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa điểm</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                    value={formData.location_id}
                    onChange={(e) => setFormData({...formData, location_id: e.target.value})}
                  >
                    <option value="">Chọn địa điểm</option>
                    {locations.map(loc => (
                      <option key={loc.location_id} value={loc.location_id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá tour (VNĐ)</label>
                  <div className="relative">
                      <DollarSign className="absolute left-4 top-4.5 text-gray-400" size={18} />
                      <input 
                        required
                        type="number" 
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số người tối đa</label>
                  <div className="relative">
                      <UsersIcon className="absolute left-4 top-4.5 text-gray-400" size={18} />
                      <input 
                        required
                        type="number" 
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                        value={formData.max_people}
                        onChange={(e) => setFormData({...formData, max_people: e.target.value})}
                      />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày bắt đầu</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày kết thúc</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả chi tiết & Lịch trình</label>
                <textarea 
                  required
                  rows="6"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-gray-800"
                  placeholder="Nhập lịch trình chi tiết từng ngày, các dịch vụ ăn uống, khách sạn bao gồm..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="bg-blue-50 p-6 rounded-[1.5rem] flex items-start gap-4 border border-blue-100">
                <Info className="text-blue-600 shrink-0" size={24} />
                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                    Lưu ý: Tour sau khi được tạo hoặc chỉnh sửa sẽ chuyển sang trạng thái <b>Chờ duyệt</b>. Ban quản trị sẽ kiểm tra nội dung trước khi cho phép tour hiển thị công khai trên hệ thống.
                </p>
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-gray-900 to-purple-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  {editingTour ? 'LƯU THAY ĐỔI' : 'ĐĂNG TOUR NGAY'}
                </button>
                {editingTour && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="px-10 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    HỦY
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Thu nhập của tôi</h2>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-8 rounded-3xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500 rounded-2xl"><TrendingUp size={24} className="text-white"/></div>
                  <span className="font-black text-blue-800 uppercase tracking-wider">Tổng thu nhập (80%)</span>
                </div>
                <p className="text-4xl font-black text-blue-900">{Number(revenueData?.summary?.creator_share_80pct || 0).toLocaleString()} ₫</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">Từ {revenueData?.records?.length || 0} giao dịch thành công</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gray-400 rounded-2xl"><DollarSign size={24} className="text-white"/></div>
                  <span className="font-black text-gray-700 uppercase tracking-wider">Tổng giao dịch</span>
                </div>
                <p className="text-4xl font-black text-gray-800">{Number(revenueData?.summary?.total_revenue || 0).toLocaleString()} ₫</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">Phí nền tảng (20%) đã khấu trừ</p>
              </div>
            </div>

            {/* Revenue Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-10 py-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-black text-gray-800">Chi tiết giao dịch</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5 text-left">Tour</th>
                    <th className="px-8 py-5 text-left">Booking</th>
                    <th className="px-8 py-5 text-right">Tổng tiền</th>
                    <th className="px-8 py-5 text-right">Phần của bạn (80%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(revenueData?.records || []).map(r => (
                    <tr key={r.revenue_id} className="hover:bg-gray-50/50 transition">
                      <td className="px-8 py-5 font-bold text-gray-900">{r.tour_title}</td>
                      <td className="px-8 py-5 text-gray-500 text-sm">#{r.booking_id}</td>
                      <td className="px-8 py-5 text-right font-bold text-gray-700">{Number(r.total_amount).toLocaleString()} ₫</td>
                      <td className="px-8 py-5 text-right">
                        <span className="font-black text-blue-700 text-lg">{Number(r.creator_share).toLocaleString()} ₫</span>
                      </td>
                    </tr>
                  ))}
                  {(!revenueData?.records || revenueData.records.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-8 py-16 text-center text-gray-400 italic">Chưa có giao dịch nào được xác nhận.</td>
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

export default CreatorDashboard;
