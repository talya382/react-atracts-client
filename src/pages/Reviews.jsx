import { useState, useEffect } from "react";
import axios from "axios";
import "./Reviews.css";

const API = "http://localhost:3000/reviews";

function StarRating({ value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={`star ${star <= (hover || value) ? 'filled' : ''}`}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >★</span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 0, text: '', attraction: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get(API)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.rating || !form.text) {
      alert("אנא מלא את כל השדות ובחר דירוג");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(API, form);
      setReviews([res.data, ...reviews]);
      setForm({ name: '', rating: 0, text: '', attraction: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="reviews-page">
      <div className="reviews-container">

        {/* כותרת */}
        <div className="reviews-header">
          <h1>⭐ חוות דעת לקוחות</h1>
          <p>מה הלקוחות שלנו אומרים</p>
          {reviews.length > 0 && (
            <div className="avg-rating">
              <span className="avg-number">{avgRating}</span>
              <StarRating value={Math.round(avgRating)} readOnly />
              <span className="total-reviews">({reviews.length} ביקורות)</span>
            </div>
          )}
        </div>

        {/* טופס הוספה */}
        <div className="review-form">
          <h2>✍️ כתוב חוות דעת</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder="שמך המלא"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="שם האטרקציה (אופציונלי)"
              value={form.attraction}
              onChange={e => setForm({...form, attraction: e.target.value})}
            />
          </div>
          <div className="rating-select">
            <span>דירוג:</span>
            <StarRating value={form.rating} onChange={r => setForm({...form, rating: r})} />
          </div>
          <textarea
            placeholder="ספר לנו על החוויה שלך..."
            value={form.text}
            onChange={e => setForm({...form, text: e.target.value})}
            rows={4}
          />
          <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'שולח...' : '📤 פרסם חוות דעת'}
          </button>
          {success && <div className="success-msg">✅ חוות הדעת נשמרה בהצלחה!</div>}
        </div>

        {/* רשימת ביקורות */}
        {loading ? (
          <div className="reviews-loading">טוען ביקורות...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">עדיין אין ביקורות — היה הראשון!</div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(r => (
              <div key={r._id} className="review-card">
                <div className="review-top">
                  <div className="reviewer-avatar">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{r.name}</h3>
                    {r.attraction && <span className="attraction-tag">📍 {r.attraction}</span>}
                  </div>
                </div>
                <StarRating value={r.rating} readOnly />
                <p className="review-text">{r.text}</p>
                <span className="review-date">
                  {new Date(r.createdAt).toLocaleDateString('he-IL')}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}