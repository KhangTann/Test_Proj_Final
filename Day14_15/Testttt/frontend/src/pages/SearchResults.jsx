import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import { MapPin, Calendar, Users } from 'lucide-react';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('q') || '';
  
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // States bộ lọc
  const [filterLoc, setFilterLoc] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [people, setPeople] = useState('');

  useEffect(() => {
    // Lấy danh sách địa điểm cho Sidebar filter
    api.get('tours/locations/').then(res => setLocations(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        let qs = `tours/?`;
        if (searchKeyword) qs += `title=${encodeURIComponent(searchKeyword)}&`;
        if (filterLoc) qs += `location_id=${filterLoc}&`;
        if (minPrice) qs += `min_price=${minPrice}&`;
        if (maxPrice) qs += `max_price=${maxPrice}&`;
        if (startDate) qs += `start_date=${startDate}&`;
        if (people) qs += `people=${people}&`;
        
        const res = await api.get(qs);
        setTours(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [searchKeyword, filterLoc, minPrice, maxPrice, startDate, people]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Lọc Kết Quả</h3>
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
          <select 
            className="w-full border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary border"
            value={filterLoc}
            onChange={(e) => setFilterLoc(e.target.value)}
          >
            <option value="">Tất cả địa điểm</option>
            {locations.map(loc => (
              <option key={loc.location_id} value={loc.location_id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mức giá (VND)</label>
          <div className="flex flex-col gap-2">
            <input 
              type="number" 
              placeholder="Từ" 
              className="w-full border rounded-xl p-2.5 text-sm bg-gray-50 border-gray-100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Đến" 
              className="w-full border rounded-xl p-2.5 text-sm bg-gray-50 border-gray-100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành từ</label>
          <input 
            type="date" 
            className="w-full border rounded-xl p-2.5 text-sm bg-gray-50 border-gray-100"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Số người ít nhất</label>
          <input 
            type="number" 
            placeholder="Số người..." 
            className="w-full border rounded-xl p-2.5 text-sm bg-gray-50 border-gray-100"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </div>

        <button 
            onClick={() => {
                setFilterLoc('');
                setMinPrice('');
                setMaxPrice('');
                setStartDate('');
                setPeople('');
                setSearchParams({});
            }}
            className="w-full py-2.5 text-sm font-bold text-gray-500 hover:text-red-500 transition"
        >
            Xóa tất cả bộ lọc
        </button>
      </aside>

      {/* Results Grid */}
      <div className="w-full md:w-3/4">
        {searchKeyword && (
          <h2 className="text-2xl font-semibold mb-6">
            Kết quả tìm kiếm cho: <span className="text-primary">"{searchKeyword}"</span>
          </h2>
        )}
        
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : tours.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">Không tìm thấy tour nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {tours.map(tour => (
              <div key={tour.tour_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {tour.images?.length > 0 ? (
                    <img src={`/images/${tour.images[0].image_url}`} onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"}} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80" alt="Placeholder" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary">
                    {tour.location?.name || 'Đang cập nhật'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2">
                    <Link to={`/tours/${tour.tour_id}`}>{tour.title}</Link>
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={16} className="mr-2" />
                    <span>{new Date(tour.start_date).toLocaleDateString("vi-VN")} - {new Date(tour.end_date).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Chỉ từ</p>
                      <p className="text-xl font-bold text-red-500">{Number(tour.price).toLocaleString("vi-VN")} ₫</p>
                    </div>
                    <Link to={`/tours/${tour.tour_id}`} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
