import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, Users, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

function BookingPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numPeople, setNumPeople] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await api.get(`tours/${tourId}/`);
        setTour(res.data);
      } catch (err) {
        setError("Không thể tải thông tin tour.");
      } finally {
        setLoading(false);
      }
    };
    
    // Check if logged in
    if (!localStorage.getItem('access_token')) {
      navigate('/login');
      return;
    }

    fetchTour();
  }, [tourId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('bookings/', {
        tour: tourId,
        number_of_people: numPeople,
        contact_email: email,
        contact_phone: phone
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Đặt tour thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (success) return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center border border-green-100">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt Tour Thành Công!</h2>
      <p className="text-gray-600 mb-8">
        Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Chúng tôi sẽ liên hệ với bạn sớm nhất.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition"
      >
        Quay lại Trang chủ
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-primary mb-6 font-medium transition"
      >
        <ArrowLeft size={18} className="mr-2" /> Quay lại
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Detail Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Thông tin khách hàng</h2>
            
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng vé</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400"><Users size={18} /></span>
                  <input 
                    type="number" 
                    min="1" 
                    max={tour?.available_slots || 10}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    value={numPeople}
                    onChange={(e) => setNumPeople(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email liên hệ</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400"><Mail size={18} /></span>
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="ví dụ: user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400"><Phone size={18} /></span>
                  <input 
                    type="tel" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="0123... (10 số)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t mt-8">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : "Xác nhận Đặt Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tóm tắt chuyến đi</h3>
            
            <div className="mb-4 rounded-lg overflow-hidden h-32 bg-gray-100">
               <img 
                src={tour?.images?.[0]?.image_url ? `/images/${tour.images[0].image_url}` : "https://images.unsplash.com/photo-1501785888041-af3ef285b470"} 
                alt="Tour" 
                className="w-full h-full object-cover"
                onError={(e) => {e.target.src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"}}
               />
            </div>

            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{tour?.title}</h4>
            
            <div className="space-y-3 py-4 border-y border-gray-50 mb-4">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Calendar size={16} className="mt-0.5 text-primary" />
                <span>Bắt đầu: {new Date(tour?.start_date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Users size={16} className="mt-0.5 text-primary" />
                <span>Số lượng: {numPeople} người</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Đơn giá</span>
                <span>{Number(tour?.price).toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-red-500 pt-2 border-t mt-2">
                <span>Tổng cộng</span>
                <span>{(Number(tour?.price) * numPeople).toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
