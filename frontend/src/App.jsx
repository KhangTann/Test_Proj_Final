// function App() {
//   return (
//     <div>
//       <h1>Dự án TourGo</h1>
//     </div>
//   )
// }

// export default App
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/client/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Introduce from "./pages/client/Introduce";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/introduce" element={<Introduce />} />
      </Routes>
    </Router>
  );
}

export default App;