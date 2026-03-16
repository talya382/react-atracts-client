import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTop10 } from "../api/atractionService";
import { useLang } from "../LanguageContext";
import "./SubCategory.css";

export default function SubCategory() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [popularSubs, setPopularSubs] = useState({});

  const subCategories = {
    land: {
      video: 'https://res.cloudinary.com/dwefiwwa0/video/upload/land_fr4ssd.mp4',
      title: t.landTitle,
      subs: [
        { id: 'horses', title: t.horses || 'רכיבה על סוסים', icon: '🐴', img: '/img/horses/horses-4.png' },
        { id: 'tractors', title: t.tractors || 'טרקטורנים', icon: '🚜', img: '/img/tractors/tractors-1.png' },
        { id: 'rangers', title: t.rangers || "רנג'רים", icon: '🏎️', img: "/img/rangers/rangers-13.png" },
      ]
    },
    sea: {
      video: 'https://res.cloudinary.com/dwefiwwa0/video/upload/sea_lw0sl1.mp4',
      title: t.seaTitle,
      subs: [
        { id: 'surfing', title: t.surfing || 'גלישה', icon: '🏄', img: '/img/surfing/surfing-1.png' },
        { id: 'diving', title: t.diving || 'צלילה', icon: '🤿', img: '/img/diving/diving-8.png' },
        { id: 'sailing', title: t.sailing || 'שייט', icon: '⛵', img: '/img/sailing/sailing-9.png' },
      ]
    },
    air: {
      video: 'https://res.cloudinary.com/dwefiwwa0/video/upload/air_phjcxw.mp4',
      title: t.airTitle,
      subs: [
        { id: 'balloon', title: t.balloon || 'כדור פורח', icon: '🎈', img: '/img/balloon/balloon-8.png' },
        { id: 'parachute', title: t.parachute || 'צניחה חופשית', icon: '🪂', img: '/img/parachute/parachute-10.png' },
        { id: 'gliding', title: t.gliding || 'טיסה בשמי הארץ', icon: '✈️', img: '/img/fling/gliding-5.png' },
      ]
    },
  };

  const data = subCategories[category];

  useEffect(() => {
    getTop10().then(res => {
      const counts = {};
      res.data.forEach(item => {
        if (item.subCategory) {
          counts[item.subCategory] = (counts[item.subCategory] || 0) + 1;
        }
      });
      setPopularSubs(counts);
    }).catch(() => {});
  }, []);

  if (!data) return <div className="error-msg">הקטגוריה לא נמצאה</div>;

  return (
    <div className="subcategory-page">
      <video className="bg-video" src={data.video} autoPlay muted loop playsInline />
      <div className="bg-overlay" />

      <div className="subcategory-container">
        <header className="subcategory-header">
          <h1>{data.title}</h1>
          <p>{t.chooseSubCategory}</p>
        </header>

        <div className="subs-expanding-flex">
          {data.subs.map((sub) => (
            <div
              key={sub.id}
              className="sub-panel"
              style={{ backgroundImage: `url(${sub.img})` }}
              onClick={() => navigate(`/list/${category}/${sub.id}`)}
            >
              {popularSubs[sub.id] > 0 && (
                <div className="sub-popular-badge">🔥 {t.popular}</div>
              )}
              <div className="sub-panel-overlay"></div>
              <div className="sub-panel-content">
              <h2>{sub.title}</h2>
                <div className="sub-action-btn">{t.enterCategory}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}