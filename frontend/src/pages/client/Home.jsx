// export default function Home() {
//   return <h1>Danh sách Tour Du Lịch</h1>;
// }
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Danh sách Tour</h1>
      {/* Nút Introduce nằm ở đây */}
      <Link to="/introduce">
        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Introduce</button>
      </Link>
    </div>
  );
}