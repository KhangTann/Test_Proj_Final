import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin, Calendar, Users, Clock, AlertCircle, Star, Send } from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function AddReviewForm({ tourId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post(`tours/${tourId}/reviews/`, { rating, comment });
      setComment('');
      onReviewAdded();
    } catch (err) {
      alert("Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-xl">
        <p className="text-gray-600 mb-2 border-b pb-2">Bạn cần đăng nhập để viết đánh giá.</p>
        <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300">Điểm đánh giá:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`transition-colors ${num <= rating ? 'text-yellow-400' : 'text-gray-500'}`}
            >
              <Star size={24} fill={num <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <textarea
          required
          rows="3"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-primary focus:ring-0 transition-all text-sm outline-none text-white"
          placeholder="Bạn cảm thấy thế nào về dịch vụ tour?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}

function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`tours/${id}/`);
        setTour(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Tour không tồn tại hoặc chưa được duyệt.");
        } else {
          setError("Có lỗi xảy ra khi tải thông tin tour.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Rất tiếc!</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <Link to="/search" className="bg-primary px-6 py-2 rounded-lg text-white font-medium hover:bg-purple-700">Quay lại danh sách</Link>
    </div>
  );

  if (!tour) return null;

  const avgRating = tour.reviews?.length > 0 
    ? (tour.reviews.reduce((acc, r) => acc + r.rating, 0) / tour.reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-6xl mx-auto rounded-3xl bg-white shadow-xl overflow-hidden border border-gray-100 mb-20 animate-in fade-in duration-700">
      {/* Slider */}
      <div className="h-[500px] w-full bg-gray-100 relative group overflow-hidden">
        {tour.images && tour.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            className="w-full h-full"
          >
            {tour.images.map((img) => (
              <SwiperSlide key={img.image_id}>
                <img 
                  src={`/images/${img.image_url}`} 
                  onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"}} 
                  alt={tour.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80" alt="Placeholder" className="w-full h-full object-cover" />
        )}
        <div className="absolute top-6 left-6 z-10">
             <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-primary shadow-lg border border-white">
                <MapPin size={14} className="inline mr-1" /> {tour.location?.name}
             </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{tour.title}</h1>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill={i < Math.round(Number(avgRating)) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm font-medium">({tour.reviews?.length || 0} đánh giá khách hàng)</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <Calendar className="mx-auto mb-2 text-purple-600" size={20} />
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ngày đi</p>
                    <p className="text-sm font-bold text-gray-800">{new Date(tour.start_date).toLocaleDateString("vi-VN")}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <Clock className="mx-auto mb-2 text-blue-600" size={20} />
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Thời gian</p>
                    <p className="text-sm font-bold text-gray-800">3 ngày 2 đêm</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <Users className="mx-auto mb-2 text-green-600" size={20} />
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Chỗ trống</p>
                    <p className="text-sm font-bold text-gray-800">{tour.available_slots} / {tour.max_people}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <Star className="mx-auto mb-2 text-orange-600" size={20} />
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Giá từ</p>
                    <p className="text-sm font-bold text-gray-800">{Number(tour.price).toLocaleString()}đ</p>
                </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2"> <AlertCircle size={22} className="text-primary"/> Chi tiết chuyến đi</h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line bg-purple-50/30 p-6 rounded-2xl border border-purple-100">
                {tour.description || "Chưa có mô tả chi tiết cho tour này."}
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">Vị trí chuyến đi</h3>
              <div className="w-full h-80 bg-gray-100 rounded-3xl overflow-hidden shadow-inner border-4 border-white">
                <iframe 
                  title="google-map"
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={`https://maps.google.com/maps?q=${tour.location?.latitude || 16.0544},${tour.location?.longitude || 108.2022}&hl=vi&z=14&output=embed`}
                ></iframe>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-10 border-t space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Đánh giá khách hàng</h3>
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                        <Star className="text-yellow-500" fill="currentColor" size={20} />
                        <span className="font-bold text-xl text-yellow-700">
                            {avgRating}
                        </span>
                        <span className="text-yellow-600/50">/ 5.0</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tour.reviews?.map((review) => (
                        <div key={review.review_id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold">
                                        {review.username?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{review.username}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(review.created_at).toLocaleDateString("vi-VN")}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 italic">"{review.comment}"</p>
                        </div>
                    ))}
                    {(!tour.reviews || tour.reviews.length === 0) && (
                        <p className="col-span-2 text-center text-gray-500 py-10 bg-gray-50 rounded-2xl italic">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!</p>
                    )}
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10 w-full">
                        <h4 className="text-2xl font-bold mb-2">Đánh giá của bạn</h4>
                        <AddReviewForm tourId={id} onReviewAdded={() => window.location.reload()} />
                    </div>
                </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-2xl sticky top-8 space-y-6">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Giá tour cố định</p>
                <div className="flex items-end gap-2 text-red-500">
                    <span className="text-4xl font-black">{Number(tour.price).toLocaleString()} ₫</span>
                    <span className="text-gray-400 text-sm mb-1.5 font-bold">/ khách</span>
                </div>
              </div>

              <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Người tối đa</span>
                  <span className="text-sm font-black text-gray-900">{tour.max_people}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Đã đăng ký</span>
                  <span className="text-sm font-black text-blue-600">{tour.max_people - tour.available_slots} / {tour.max_people}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Trạng thái</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg">CÒN CHỖ</span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/book/${id}`)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-200 transition-all duration-300"
              >
                ĐẶT TOUR NGAY
              </button>
              
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-400">Đảm bảo hoàn tiền nếu hủy trước 24h</p>
                <div className="flex justify-center gap-4 opacity-30 grayscale">
                    <img src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png" className="h-[14px]" alt="VNPAY" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-[20px]" alt="STRIPE" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetail;
