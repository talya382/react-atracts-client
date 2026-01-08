import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsList from "./pages/ProductsList";
import AddProduct from "./pages/AddProduct";
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* דף הבית ורשימת המוצרים */}
          <Route path="/" element={<ProductsList />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </Router> 
  );
}

export default App;