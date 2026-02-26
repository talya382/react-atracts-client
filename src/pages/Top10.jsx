import { useState, useEffect } from "react";
import { getTop10 } from "../api/atractionService";
import OrderModal from "./OrderModal";
import { useLang } from "../LanguageContext";
import "./Top10.css";

export default function Top10() {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const { lang } = useLang();

  const tr = {
    he: {
      title: "🏆 טופ 10 האטרקציות",
      subtitle: "האטרקציות הכי פופולריות לפי מספר הזמנות",
      noData: "עדיין אין נתוני הזמנות — הזמינו כדי לראות את הדירוג!",
      orders: "הזמנות",
      bookNow: "הזמן עכשיו",
      loading: "טוען...",
    },
    en: {
      title: "🏆 Top 10 Attractions",
      subtitle: "Most popular attractions by number of orders",
      noData: "No order data yet — book to see the rankings!",
      orders: "orders",
      bookNow: "Book Now",
      loading: "Loading...",
    }
  }[lang];

  useEffect(() => {
    getTop10()
      .then(res => setTop10(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-container">{tr.loading}</div>;

  return (
    <div className="top10-page">
      <div className="top10-container">

        <div className="top10-header">
          <h1>{tr.title}</h1>
          <p>{tr.subtitle}</p>
        </div>

        <div className="top10-list">
          {top10.length === 0 ? (
            <div className="no-data">{tr.noData}</div>
          ) : (
            top10.map((item, index) => (
              <div key={item._id} className={`top10-card ${index < 3 ? 'top3' : ''}`}>

                <div className="rank-badge">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>

                <div className="top10-img">
                  <img src={item.imgUrl} alt={item.name} />
                </div>

                <div className="top10-info">
                  <h3>{item.name}</h3>
                  <p className="top10-desc">{item.description}</p>
                  <div className="top10-meta">
                    <span>📍 {item.address?.split(",")[0]}</span>
                    <span>💰 {item.price} ₪</span>
                    <span>🛒 {item.orderCount} {tr.orders}</span>
                  </div>
                </div>

                <div className="top10-actions">
                  <button className="buy-btn" onClick={() => setSelectedAttraction(item)}>
                    {tr.bookNow}
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      <OrderModal
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
      />
    </div>
  );
}