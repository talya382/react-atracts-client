import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/list" element={<ProductsList />} />
        <Route path="/list/:category" element={<SubCategory />} />
        <Route path="/list/:category/:subCategory" element={<ProductsList />} />
        <Route path="/add-product" element={<AddAtraction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/basket" element={<Basket />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;