import { BrowserRouter as Router, Routes, Route,useLocation  } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProductsList from "./pages/ProductsList";
import AddAtraction from "./pages/AddProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Basket from "./pages/Basket";
import Home from "./pages/Home.jsx";
import SubCategory from "./pages/SubCategory.jsx";
import Footer from "./pages/Footer";
import Reviews from "./pages/Reviews";
import Top10 from "./pages/Top10";
import Notifications from "./components/Notifications";
import ChatBot from "./components/ChatBot";
import CartDrawer from "./components/CartDrawer"; 
import EditProduct from "./pages/EditProduct";
import "./App.css";


function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {isHome && (
  <>
    <video
      src="https://res.cloudinary.com/dwefiwwa0/video/upload/home_ppcs1n.mp4"
      autoPlay muted loop playsInline
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: 0
      }}
    />
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 1
    }} />
  </>
)}
<NavBar style={{ position: 'relative', zIndex: 100 }} />
<CartDrawer /> 
<div style={{ position: 'relative', zIndex: 2 }}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/top10" element={<Top10 />} />
    <Route path="/list" element={<ProductsList />} />
    <Route path="/edit-product/:id" element={<EditProduct />} />
    <Route path="/list/:category" element={<SubCategory />} />
    <Route path="/list/:category/:subCategory" element={<ProductsList />} />
    <Route path="/add-product" element={<AddAtraction />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Register />} />
    <Route path="/basket" element={<Basket />} />
    <Route path="/reviews" element={<Reviews />} />
  </Routes>
  <Footer />
  <ChatBot />
  <Notifications />
</div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


export default App;