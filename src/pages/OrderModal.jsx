import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToBasket } from "../features/basket/basketSlice";
import "./OrderModal.css";

export default function OrderModal({ attraction, onClose }) {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  if (!attraction) return null;

  const handleOrder = () => {
    for (let i = 0; i < qty; i++) {
      dispatch(addToBasket(attraction));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-image" style={{ backgroundImage: `url(${attraction.imgUrl})` }} />

        <div className="modal-content">
          <h2>{attraction.name}</h2>
          <p className="modal-desc">{attraction.description}</p>

          <div className="modal-details">
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span>{attraction.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <span>{attraction.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💰</span>
              <span>{attraction.price} ₪ לאדם</span>
            </div>
          </div>

          <div className="modal-qty">
            <span>כמות כרטיסים:</span>
            <div className="qty-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <span className="total-price">סה"כ: {attraction.price * qty} ₪</span>
          </div>

          <button className="modal-order-btn" onClick={handleOrder}>
            🛒 הוסף לסל ({qty} כרטיסים)
          </button>
        </div>

      </div>
    </div>
  );
}