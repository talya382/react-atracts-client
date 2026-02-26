import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToBasket } from "../features/basket/basketSlice";
import { incrementOrder } from "../api/atractionService";
import { useLang } from "../LanguageContext";
import "./OrderModal.css";

export default function OrderModal({ attraction, onClose }) {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const { t, lang } = useLang();

  if (!attraction) return null;

  const handleOrder = async () => {
    for (let i = 0; i < qty; i++) {
      dispatch(addToBasket(attraction));
    }
    try {
      await incrementOrder(attraction._id);
    } catch (err) {
      console.error("שגיאה בעדכון ספירה:", err);
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
              <span>{attraction.price} ₪ {lang === 'he' ? 'לאדם' : 'per person'}</span>
            </div>
          </div>

          <div className="modal-qty">
            <span>{t.ticketCount}</span>
            <div className="qty-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <span className="total-price">{t.total} {attraction.price * qty} ₪</span>
          </div>

          <button className="modal-order-btn" onClick={handleOrder}>
            🛒 {t.addToCart} ({qty} {lang === 'he' ? 'כרטיסים' : 'tickets'})
          </button>
        </div>

      </div>
    </div>
  );
}