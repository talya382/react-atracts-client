import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useLang } from "../LanguageContext";
import './Home.css';

function CounterItem({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <div className="counter-item" ref={ref}>
      <span className="counter-number">{count.toLocaleString()}{suffix}</span>
      <span className="counter-label">{label}</span>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();

  const categories = [
    { id: 'air', title: t.air, desc: t.airDesc, img: '/img/air.png', icon: '✈️' },
    { id: 'sea', title: t.sea, desc: t.seaDesc, img: '/img/surfing/surfing-2.png', icon: '🌊' },
    { id: 'land', title: t.land, desc: t.landDesc, img: '/img/land.jpg.png', icon: '🏕️' },
  ];

  const stats = [
    { label: t.happyCustomers, value: 5000, suffix: '+' },
    { label: t.attractions, value: 63, suffix: '' },
    { label: t.orders, value: 12000, suffix: '+' },
    { label: t.experience, value: 10, suffix: '+' },
  ];

  return (
    <div className="home-container">
      <header className="home-hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSubtitle}</p>
      </header>

      <main className="categories-grid-wrapper">
        <div className="categories-flex">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-card"
              style={{ backgroundImage: `url(${cat.img})` }}
              onClick={() => navigate(`/list/${cat.id}`)}
            >
              <div className="card-overlay"></div>
              <div className="card-inner-content">
                <span className="card-icon">{cat.icon}</span>
                <h2>{cat.title}</h2>
                <p className="card-description">{cat.desc}</p>
                <div className="card-action">{t.viewAttractions}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className="stats-section">
        {stats.map((stat, i) => (
          <CounterItem key={i} {...stat} />
        ))}
      </section>
    </div>
  );
}