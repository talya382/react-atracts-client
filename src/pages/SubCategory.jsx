import { useNavigate, useParams } from "react-router-dom";
import "./SubCategory.css";

const subCategories = {
  land: {
    video: '/img/land.mp4',
    title: 'הרפתקה ביבשה',
    subs: [
      { id: 'horses', title: 'רכיבה על סוסים', icon: '🐴', img: '/img/horses/horses-4.png' },
      { id: 'tractors', title: 'טרקטורנים', icon: '🚜', img: '/img/tractors/tractors-1.png' },
      { id: 'rangers', title: "רנג'רים", icon: '🏎️', img: "/img/rangers/rangers-13.png" },
    ]
  },
  sea: {
    video: '/img/sea.mp4',
    title: 'חוויות בים',
    subs: [
      { id: 'surfing', title: 'גלישה', icon: '🏄', img: '/img/surfing/surfing-1.png' },
      { id: 'diving', title: 'צלילה', icon: '🤿', img: '/img/diving/diving-8.png' },
      { id: 'sailing', title: 'שייט', icon: '⛵', img: '/img/sailing/sailing-9.png' },
    ]
  },
  air: {
    video: "/img/air.mp4",
    title: 'ריגושים באוויר',
    subs: [
      { id: 'balloon', title: 'כדור פורח', icon: '🎈', img: '/img/balloon/balloon-8.png' },
      { id: 'parachute', title: 'צניחה חופשית', icon: '🪂', img: '/img/parachute/parachute-10.png' },
      { id: 'gliding', title: 'טיסה בשמי הארץ', icon: '✈️', img: '/img/fling/gliding-5.png' },
    ]
  },
};

export default function SubCategory() {
  const { category } = useParams();
  const navigate = useNavigate();
  const data = subCategories[category];

  if (!data) return <div className="error-msg">הקטגוריה לא נמצאה</div>;

  return (
    <div className="subcategory-page">
      {/* סרטון רקע שנותן אווירה */}
      <video className="bg-video" src={data.video} autoPlay muted loop playsInline />
      <div className="bg-overlay" />

      <div className="subcategory-container">
        <header className="subcategory-header">
            <h1>{data.title}</h1>
            <p>בחרו תת-קטגוריה כדי לראות את כל האטרקציות</p>
        </header>

        <div className="subs-expanding-flex">
          {data.subs.map((sub) => (
            <div
              key={sub.id}
              className="sub-panel"
              style={{ backgroundImage: `url(${sub.img})` }}
              onClick={() => navigate(`/list/${category}/${sub.id}`)}
            >
              <div className="sub-panel-overlay"></div>
              <div className="sub-panel-content">
                <span className="sub-icon">{sub.icon}</span>
                <h2>{sub.title}</h2>
                <div className="sub-action-btn">כניסה לקטגוריה</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}