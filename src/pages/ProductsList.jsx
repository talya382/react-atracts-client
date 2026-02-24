import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useDispatch } from "react-redux";
import { getAllAtractions } from "../api/atractionService";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./ProductsList.css";
import OrderModal from "./OrderModal";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const subCategoryDescriptions = {
  horses: { text: "רכיבה על סוסים היא חוויה בלתי נשכחת שמחברת אתכם לטבע ולנוף הישראלי המרהיב. בין אם אתם מתחילים או רוכבים מנוסים, תגלו שבילים מרתקים בגליל, בנגב, בכרמל ובעמקים. הסוסים שלנו מאולפים ועדינים, המדריכים מקצועיים ומנוסים, והחוויה שתיקחו הביתה תישאר איתכם לנצח." },
  tractors: { text: "טרקטורנים זוהי הרפתקה אמיתית לאוהבי שטח ואדרנלין! רכבו על טרקטורונים עוצמתיים דרך מסלולי בוץ, חול וסלעים באזורים הפראיים ביותר בישראל. מהגולן הסוחף ועד הנגב הצחיח — כל מסלול הוא אתגר חדש. מתאים לקבוצות, ימי גיבוש ומשפחות המחפשות ריגוש אמיתי." },
  rangers: { text: "רכיבה על רנג'רים היא השילוב המושלם בין ריגוש לנוף. מכוניות השטח החזקות יובילו אתכם דרך מסלולים מאתגרים, שבילים נסתרים ומקומות שרק מעטים זכו לראות. חוויה אחרת לגמרי — מהירות, כוח ונוף שיגרום לכם לאבד את הנשימה. מתאים לכל הגילאים ורמות הניסיון." },
  surfing: { text: "גלישה על גלים היא אחת החוויות הטהורות ביותר שהטבע מציע. חופי ישראל מציעים גלים מעולים לגולשים בכל הרמות — מהמתחילים המגלים את הים לראשונה ועד המתקדמים שמחפשים את הגל המושלם. המדריכים שלנו ילמדו אתכם טכניקה נכונה ובטוחה, ותצאו מהמים עם חיוך שלא ירד מהפנים." },
  diving: { text: "מתחת לפני המים מסתתר עולם שלם של פלאים. צללו לעומקי ים סוף וגלו שוניות אלמוגים צבעוניות, דגים מרהיבים ועולם תת-ימי שיותיר אתכם פעורי פה. עם ציוד מקצועי ומדריכים מוסמכים, הים הופך לגן עדן פרטי שלכם." },
  sailing: { text: "שייט הוא חופש אמיתי — הרוח בשיער, המים מתחת לרגלים והאופק הפתוח לפניכם. מהשייט השקט בכנרת ועד ליאכטות יוקרתיות במפרץ אילת, כל חוויית שייט היא עולם ומלואו. מתאים לזוגות רומנטיים, משפחות וחברים שרוצים לחוות את ישראל מהים." },
  balloon: { text: "טיסה בכדור פורח היא חוויה שאין לה תחליף — עלייה שקטה ורכה אל מעל הנופים המרהיבים של ישראל. מהגליל הירוק ועד הנגב הסוחף, תגלו את הארץ ממבט של ציפור. חוויה רומנטית ובלתי נשכחת." },
  parachute: { text: "צניחה חופשית היא האדרנלין הגדול ביותר שתחוו בחייכם! קפיצה מ-4,000 מטר, 60 שניות של נפילה חופשית במהירות של 200 קמ\"ש, ואז הפתיחה השקטה של המצנח ותצפית מרהיבה על ישראל מלמעלה. עם מדריך מוסמך, הצניחה הראשונה שלכם תהיה חווית חיים שלא תשכחו לעולם." },
  gliding: { text: "טיסה בשמי ישראל על מטוסים קלים, גלשונים ואולטרה-לייט היא חוויה מרגשת שמשלבת את תחושת החופש עם נופים עוצרי נשימה. גלשו על זרמי האוויר מהכרמל לים, טוסו מעל הגולן — כל טיסה היא עולם בפני עצמו." },
};

const categoryTitles = {
  land: 'יבשה 🏕️',
  sea: 'ים 🌊',
  air: 'אוויר ✈️'
};

const subCategoryTitles = {
  horses: 'רכיבה על סוסים 🐴',
  tractors: 'טרקטורנים 🚜',
  rangers: "רנג'רים 🏎️",
  surfing: 'גלישה 🏄',
  diving: 'צלילה 🤿',
  sailing: 'שייט ⛵',
  balloon: 'כדור פורח 🎈',
  parachute: 'צניחה חופשית 🪂',
  gliding: 'טיסה בשמי הארץ ✈️',
};

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 500);
  }, [map]);
  return null;
}

export default function ProductsList() {
  const { category, subCategory } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [arrAtractions, setArrAtractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestAtraction, setNearestAtraction] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllAtractions(category, subCategory, 100);
        const allData = res.data?.data || res.data || [];
        const filtered = allData.filter(
          (item) => !subCategory || item.subCategory === subCategory
        );
        setArrAtractions(filtered);
      } catch (err) {
        console.error("שגיאה:", err);
        setArrAtractions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, subCategory]);

  function findNearest() {
    navigator.geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      setUserLocation([userLat, userLng]);
      let nearest = null;
      let minDist = Infinity;
      arrAtractions.forEach(a => {
        if (!a.location?.lat || !a.location?.lng) return;
        const dist = Math.sqrt(
          Math.pow(a.location.lat - userLat, 2) +
          Math.pow(a.location.lng - userLng, 2)
        );
        if (dist < minDist) { minDist = dist; nearest = a; }
      });
      setNearestAtraction(nearest);
    }, () => alert("אנא אפשר גישה למיקום"));
  }

  const descInfo = subCategoryDescriptions[subCategory];

  if (loading) return <div className="loader-container">טוען...</div>;

  return (
    <div className="products-page">

      <div className="products-container">

        {/* ניווט breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>🏠 דף הבית</span>
          {category && (
            <>
              <span className="breadcrumb-sep">←</span>
              <span onClick={() => navigate(`/list/${category}`)}>
                {categoryTitles[category] || category}
              </span>
            </>
          )}
          {subCategory && (
            <>
              <span className="breadcrumb-sep">←</span>
              <span className="breadcrumb-current">
                {subCategoryTitles[subCategory] || subCategory}
              </span>
            </>
          )}
        </div>
        <h1 className="page-title">
           {subCategoryTitles[subCategory] || categoryTitles[category] || 'אטרקציות'}
        </h1>
        {/* פסקת תיאור */}
        {descInfo && (
          <div className="subcategory-description">
            <p>{descInfo.text}</p>
          </div>
        )}

        {/* כפתור מיקום */}
        <div className="search-bar-above-map">
          <button className="location-btn" onClick={findNearest}>
            📍 מצא אטרקציה קרובה אלי
          </button>
          {nearestAtraction && (
            <div className="nearest-result">
              <div className="nearest-info">
                <h3>🏆 הכי קרוב אליך: {nearestAtraction.name}</h3>
                <p>📍 {nearestAtraction.address}</p>
                <p>📞 {nearestAtraction.phone}</p>
                <p>💰 {nearestAtraction.price} ₪</p>
              </div>
              <button className="buy-btn" onClick={() => setSelectedAttraction(nearestAtraction)}>
                🛒 רכוש כרטיסים
              </button>
            </div>
          )}
        </div>

        {/* מפה */}
        <div className="map-section">
          <MapContainer center={[32.0853, 34.7818]} zoom={8} className="leaflet-map-main">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapResizer />
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>המיקום שלי</Popup>
              </Marker>
            )}
            {arrAtractions.map((item) =>
              item.location?.lat ? (
                <Marker key={item._id} position={[item.location.lat, item.location.lng]}>
                  <Popup>{item.name}<br />{item.price} ₪</Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>

        {/* גריד אטרקציות */}
        <div className="attractions-grid-modern">
          {arrAtractions.length > 0 ? (
            arrAtractions.map((item) => (
              <div key={item._id} className="modern-card">
                <div className="card-image">
                  <img src={item.imgUrl} alt={item.name}
                    style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                  <div className="price-badge">{item.price} ₪</div>
                </div>
                <div className="card-content">
                  <h3>{item.name}</h3>
                  <p className="card-desc">{item.description}</p>
                  <div className="card-footer">
                    <span>📍 {item.address?.split(",")[0]}</span>
                    <button className="buy-btn" onClick={() => setSelectedAttraction(item)}>
                      הזמן עכשיו
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
              <h2>לא נמצאו אטרקציות בקטגוריה זו</h2>
            </div>
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