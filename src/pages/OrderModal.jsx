import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToBasket } from "../features/basket/basketSlice";
import { incrementOrder } from "../api/atractionService";
import { useLang } from "../LanguageContext";
import "./OrderModal.css";

export default function OrderModal({ attraction, onClose }) {
  const [qty, setQty] = useState(1);
  const [showTrails, setShowTrails] = useState(false);
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

  // בניית URL לחיפוש מסלולים ב-Google Maps
  const lat = attraction.location?.lat;
  const lng = attraction.location?.lng;
  const mapsQuery = lat && lng
    ? `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=hiking+cycling+trails&center=${lat},${lng}&zoom=13`
    : `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=מסלולי+טיול+${encodeURIComponent(attraction.address || attraction.name)}&zoom=13`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box ${showTrails ? 'modal-box-wide' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ display: 'flex', gap: '0', height: '100%' }}>

          {/* תוכן מודל רגיל */}
          <div style={{ flex: 1, minWidth: 0 }}>
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="modal-order-btn" onClick={handleOrder} style={{ flex: 1 }}>
                  🛒 {t.addToCart} ({qty} {lang === 'he' ? 'כרטיסים' : 'tickets'})
                </button>
                <button
                  onClick={() => setShowTrails(s => !s)}
                  style={{
                    padding: '12px 16px',
                    background: showTrails ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    borderRadius: '10px',
                    color: '#34d399',
                    fontFamily: "'Rubik', sans-serif",
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🚴 {lang === 'he' ? 'מסלולים באזור' : 'Nearby Trails'}
                </button>
              </div>
            </div>
          </div>

          {/* פאנל מסלולים */}
          {showTrails && (
            <div style={{
              width: '380px',
              borderLeft: '1px solid rgba(52, 211, 153, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(4, 20, 14, 0.95)',
              animation: 'slideInPanel 0.3s ease-out',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(52, 211, 153, 0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{ color: '#fff', fontFamily: "'Rubik', sans-serif", fontSize: '0.95rem', margin: 0 }}>
                  🚴 {lang === 'he' ? 'מסלולים וטיולים באזור' : 'Trails & Hikes Nearby'}
                </h3>
                <button onClick={() => setShowTrails(false)} style={{
                  background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', fontSize: '1rem'
                }}>✕</button>
              </div>

              {/* קישורים מהירים */}
              <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid rgba(52,211,153,0.1)' }}>
                {[
                  { label: lang === 'he' ? '🚴 אופניים' : '🚴 Cycling', q: 'cycling trails' },
                  { label: lang === 'he' ? '🥾 טיול רגלי' : '🥾 Hiking', q: 'hiking trails' },
                  { label: lang === 'he' ? '💧 נחלים' : '💧 Streams', q: 'נחל' },
                ].map(opt => (
                  <a
                    key={opt.q}
                    href={`https://www.google.com/maps/search/${encodeURIComponent(opt.q + ' near ' + (attraction.address || attraction.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(52, 211, 153, 0.1)',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      borderRadius: '20px',
                      color: '#34d399',
                      fontSize: '0.8rem',
                      fontFamily: "'Rubik', sans-serif",
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>

              {/* מפה */}
              <div style={{ flex: 1, position: 'relative' }}>
                <iframe
                  title="trails-map"
                  width="100%"
                  height="100%"
                  style={{ border: 'none', minHeight: '350px' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=מסלולי+טיול+${encodeURIComponent(attraction.address || attraction.name)}&output=embed&z=13`}
                />
              </div>

              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(52,211,153,0.1)' }}>
                <a
                  href={`https://www.google.com/maps/search/hiking+trails/@${lat || 32},${lng || 35},13z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #34d399, #059669)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: "'Rubik', sans-serif",
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                  }}
                >
                  {lang === 'he' ? '🗺️ פתח ב-Google Maps' : '🗺️ Open in Google Maps'}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}