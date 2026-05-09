import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
  MapPin, 
  Calendar, 
  CreditCard, 
  History as HistoryIcon, 
  Settings,
  Star,
  QrCode,
  X,
  ShieldCheck,
  ChevronRight,
  Info,
  LogOut,
  Clock
} from 'lucide-react';

function PaymentModal({ booking, onClose, onConfirm, confirming }) {
  const totalPrice = booking.tour_detail?.price * booking.number_of_people;
  const bookingCode = `PAY TOUR BK${booking.booking_id}`;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] w-full max-w-md max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 text-white relative">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90"
                >
                    <X size={20} />
                </button>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                    <QrCode size={24} className="text-purple-400" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Thanh toán an toàn</h3>
                <p className="text-white/60 text-sm font-medium">Sử dụng Mobile Banking để quét mã</p>
            </div>
            
            <div className="p-8 space-y-8 text-center bg-white">
                <div className="relative mx-auto w-64 h-64 p-4 bg-white rounded-[2rem] shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden group">
                    <img 
                        src={`https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(bookingCode)}&accountName=TOUR%20PLATFORM`}
                        alt="VietQR"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 border-[1.5rem] border-white pointer-events-none"></div>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Tổng số tiền</p>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">
                        {Number(totalPrice).toLocaleString()} <span className="text-xl font-bold text-gray-400">₫</span>
                    </p>
                </div>

                <div className="bg-gray-50/80 p-5 rounded-3xl text-left border border-gray-100/50 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Ngân hàng</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-black">MB BANK</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Số tài khoản</span>
                        <span className="text-gray-900 font-black tracking-widest bg-white px-2 py-1 rounded-lg border border-gray-100">1234 56789</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">NỘI DUNG</span>
                        <span className="text-primary font-black uppercase bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">{bookingCode}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                        disabled={confirming}
                        onClick={onConfirm}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-5 rounded-[1.25rem] shadow-2xl shadow-purple-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {confirming ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <ShieldCheck size={20} /> XÁC NHẬN ĐÃ CHUYỂN
                            </>
                        )}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-gray-400">
                        <Info size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tiền sẽ được xử lý tự động sau 3-5 phút</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // QR Modal states
    const [showQR, setShowQR] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, bookingsRes, paymentsRes] = await Promise.all([
                    api.get('users/me/'),
                    api.get('bookings/'),
                    api.get('bookings/payments/')
                ]);
                setUser(userRes.data);
                setBookings(bookingsRes.data);
                setPayments(paymentsRes.data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu cá nhân", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConfirmPayment = async () => {
        console.log("Starting handleConfirmPayment for booking:", selectedBooking.booking_id);
        setConfirming(true);
        try {
            // Fetch existing payments for this booking
            const payRes = await api.get('bookings/payments/');
            console.log("Payments fetched:", payRes.data);
            let payment = payRes.data.find(p => p.booking === selectedBooking.booking_id);
            // Compute total amount for the booking
            const totalPrice = selectedBooking.tour_detail?.price * selectedBooking.number_of_people;
            if (!payment) {
                console.log("No existing payment, creating one...");
                const createRes = await api.post('bookings/payments/', {
                    booking: selectedBooking.booking_id,
                    amount: totalPrice
                });
                console.log("Payment created:", createRes.data);
                payment = createRes.data;
            }
            if (payment) {
                console.log("Confirming payment ID:", payment.payment_id);
                await api.post(`bookings/payments/${payment.payment_id}/confirm/`);
                alert("Xác nhận thanh toán thành công! Trạng thái sẽ được cập nhật.");
                window.location.reload();
            } else {
                console.error("Failed to obtain payment record.");
                alert("Không thể tạo hoặc tìm thanh toán cho đơn hàng này.");
            }
        } catch (err) {
            console.error("Error confirming payment:", err);
            alert("Có lỗi xảy ra khi xác nhận.");
        } finally {
            setConfirming(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            {showQR && selectedBooking && (
                <PaymentModal 
                    booking={selectedBooking} 
                    onClose={() => setShowQR(false)} 
                    onConfirm={handleConfirmPayment}
                    confirming={confirming}
                />
            )}

            {/* Header / Profile Info */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="h-40 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"></div>
                <div className="px-10 pb-10 -mt-20 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-white p-3 shadow-2xl relative">
                        <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-black text-5xl border-4 border-white shadow-inner">
                            {user?.username?.[0].toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user?.username}</h1>
                            <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0 ${
                                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                                user?.role === 'CREATOR' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {user?.role === 'ADMIN' ? 'Quản trị viên' : user?.role === 'CREATOR' ? 'Đối tác Creator' : 'Khách du lịch'}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 text-gray-400 font-bold text-sm">
                            <span className="flex items-center gap-2 justify-center md:justify-start"> <ShieldCheck size={16} /> {user?.email}</span>
                            <span className="hidden md:inline text-gray-200">|</span>
                            <span>ID: #{user?.id?.toString().padStart(6, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Nav */}
                <div className="w-full lg:w-72 space-y-3">
                    <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-1">
                        {[
                            { id: 'bookings', label: 'Lịch sử đặt tour', icon: HistoryIcon, count: bookings.length },
                            { id: 'payments', label: 'Giao dịch ví', icon: CreditCard, count: payments.length },
                            { id: 'settings', label: 'Thiết lập tài khoản', icon: Settings }
                        ].map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${activeTab === item.id ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon size={20} className={activeTab === item.id ? 'text-purple-400' : 'text-gray-300'} />
                                    <span>{item.label}</span>
                                </div>
                                {item.count !== undefined && (
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        {item.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    {activeTab === 'bookings' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Chuyến đi của tôi</h2>
                            </div>
                            
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <div key={booking.booking_id} className="group bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500">
                                        <div className="w-full md:w-40 h-40 rounded-[2rem] bg-gray-100 overflow-hidden shrink-0 shadow-inner">
                                            {booking.tour_detail?.images?.[0] ? (
                                                <img src={booking.tour_detail.images[0].image_url} onError={(e)=>e.target.src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><MapPin size={40}/></div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4 py-2 text-center md:text-left">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{booking.tour_detail?.title}</h3>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs font-bold text-gray-400">
                                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary"/> {booking.tour_detail?.location?.name}</span>
                                                    <span className="hidden md:inline">•</span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {new Date(booking.tour_detail?.start_date).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                                                    booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {booking.status === 'CONFIRMED' ? <ShieldCheck size={14}/> : <Clock size={14}/>}
                                                    {booking.status === 'CONFIRMED' ? 'Đã xác nhận' : booking.status === 'PENDING' ? 'Chờ thanh toán' : 'Đã hủy'}
                                                </span>
                                                <span className="bg-gray-50 px-4 py-1.5 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest">{booking.number_of_people} Người lớn</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center items-center md:items-end gap-6 px-4">
                                            <div className="text-center md:text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Giá trị tour</p>
                                                <p className="text-3xl font-black text-gray-900 tracking-tight">{Number(booking.tour_detail?.price * booking.number_of_people).toLocaleString()} <span className="text-sm font-bold text-gray-400">₫</span></p>
                                            </div>
                                            <div className="w-full">
                                                {booking.status === 'PENDING' && (
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowQR(true);
                                                        }}
                                                        className="w-full bg-green-500 text-white font-black py-3 px-6 rounded-2xl shadow-xl shadow-green-100 hover:bg-green-600 transition flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        <QrCode size={18} className="group-hover/btn:rotate-12 transition-transform" /> 
                                                        <span className="text-xs uppercase tracking-widest">Thanh toán QR</span>
                                                    </button>
                                                )}
                                                {booking.status === 'CONFIRMED' && (
                                                    <Link 
                                                        to={`/tours/${booking.tour}`} 
                                                        className="w-full bg-primary/10 text-primary font-black py-3 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all text-xs uppercase tracking-widest"
                                                    >
                                                        Viết đánh giá <Star size={16} fill="currentColor" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && (
                                    <div className="p-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                                            <HistoryIcon size={40} />
                                        </div>
                                        <p className="text-gray-400 font-black italic tracking-tight">Kế hoạch phiêu lưu của bạn còn đang trống...</p>
                                        <Link to="/" className="inline-block text-primary font-black uppercase text-xs tracking-widest hover:underline">Khám phá tour ngay</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Giao dịch thanh toán</h2>
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <tr>
                                            <th className="px-8 py-5 text-left">Mã Giao dịch</th>
                                            <th className="px-8 py-5 text-left">Số tiền</th>
                                            <th className="px-8 py-5 text-left">Thời gian</th>
                                            <th className="px-8 py-5 text-right">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {payments.map(payment => (
                                            <tr key={payment.payment_id} className="group hover:bg-gray-50/80 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-mono text-xs">PAY</div>
                                                        <span className="font-black text-gray-900 tracking-wider">#{payment.transaction_code || `PAY-${payment.payment_id}`}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-black text-gray-900">{Number(payment.amount).toLocaleString()} ₫</td>
                                                <td className="px-8 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(payment.payment_date).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {payment.status === 'SUCCESS' ? <ShieldCheck size={12}/> : <Clock size={12}/>}
                                                        {payment.status === 'SUCCESS' ? 'Thành công' : 'Đang xử lý'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {payments.length === 0 && (
                                    <div className="p-20 text-center text-gray-400 font-black italic">Không tìm thấy dữ liệu giao dịch.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10 animate-in slide-in-from-right-4 duration-500">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cài đặt bảo mật</h2>
                                <p className="text-gray-400 font-medium">Cập nhật thông tin cá nhân và quản lý quyền riêng tư</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
