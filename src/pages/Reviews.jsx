import { useState, useEffect } from "react";
import axios from "axios";
import { useLang } from "../LanguageContext";
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
  const { t, lang } = useLang();

  useEffect(() => {
    axios.get(API)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.rating || !form.text) {
      alert(lang === 'he' ? "אנא מלא את כל השדות ובחר דירוג" : "Please fill all fields and select a rating");
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

  const reviewsTranslations = {
    he: {
      title: "⭐ חוות דעת לקוחות",
      subtitle: "מה הלקוחות שלנו אומרים",
      reviews: "ביקורות",
      writeReview: "✍️ כתוב חוות דעת",
      fullName: "שמך המלא",
      attractionName: "שם האטרקציה (אופציונלי)",
      rating: "דירוג:",
      experiencePlaceholder: "ספר לנו על החוויה שלך...",
      sending: "שולח...",
      publish: "📤 פרסם חוות דעת",
      successMsg: "✅ חוות הדעת נשמרה בהצלחה!",
      loading: "טוען ביקורות...",
      noReviews: "עדיין אין ביקורות — היה הראשון!",
    },
    en: {
      title: "⭐ Customer Reviews",
      subtitle: "What our customers say",
      reviews: "reviews",
      writeReview: "✍️ Write a Review",
      fullName: "Your Full Name",
      attractionName: "Attraction Name (optional)",
      rating: "Rating:",
      experiencePlaceholder: "Tell us about your experience...",
      sending: "Sending...",
      publish: "📤 Publish Review",
      successMsg: "✅ Review saved successfully!",
      loading: "Loading reviews...",
      noReviews: "No reviews yet — be the first!",
    }
  };

  const r = reviewsTranslations[lang];

  return (
    <div className="reviews-page">
      <div className="reviews-container">

        <div className="reviews-header">
          <h1>{r.title}</h1>
          <p>{r.subtitle}</p>
          {reviews.length > 0 && (
            <div className="avg-rating">
              <span className="avg-number">{avgRating}</span>
              <StarRating value={Math.round(avgRating)} readOnly />
              <span className="total-reviews">({reviews.length} {r.reviews})</span>
            </div>
          )}
        </div>

        <div className="review-form">
          <h2>{r.writeReview}</h2>
          <div className="form-grid">
            <input
              type="text"
              placeholder={r.fullName}
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input
              type="text"
              placeholder={r.attractionName}
              value={form.attraction}
              onChange={e => setForm({...form, attraction: e.target.value})}
            />
          </div>
          <div className="rating-select">
            <span>{r.rating}</span>
            <StarRating value={form.rating} onChange={val => setForm({...form, rating: val})} />
          </div>
          <textarea
            placeholder={r.experiencePlaceholder}
            value={form.text}
            onChange={e => setForm({...form, text: e.target.value})}
            rows={4}
          />
          <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? r.sending : r.publish}
          </button>
          {success && <div className="success-msg">{r.successMsg}</div>}
        </div>

        {loading ? (
          <div className="reviews-loading">{r.loading}</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">{r.noReviews}</div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(rev => (
              <div key={rev._id} className="review-card">
                <div className="review-top">
                  <div className="reviewer-avatar">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{rev.name}</h3>
                    {rev.attraction && <span className="attraction-tag">📍 {rev.attraction}</span>}
                  </div>
                </div>
                <StarRating value={rev.rating} readOnly />
                <p className="review-text">{rev.text}</p>
                <span className="review-date">
                  {new Date(rev.createdAt).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US')}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}