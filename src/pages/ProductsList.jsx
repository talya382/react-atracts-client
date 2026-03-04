import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getAllAtractions, getTop10 } from "../api/atractionService";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./ProductsList.css";
import OrderModal from "./OrderModal";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useLang } from "../LanguageContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const subCategoryDescriptions = {
  he: {
    horses: { text: "רכיבה על סוסים היא חוויה בלתי נשכחת שמחברת אתכם לטבע ולנוף הישראלי המרהיב." },
    tractors: { text: "טרקטורנים זוהי הרפתקה אמיתית לאוהבי שטח ואדרנלין!" },
    rangers: { text: "רכיבה על רנג'רים היא השילוב המושלם בין ריגוש לנוף." },
    surfing: { text: "גלישה על גלים היא אחת החוויות הטהורות ביותר שהטבע מציע." },
    diving: { text: "מתחת לפני המים מסתתר עולם שלם של פלאים." },
    sailing: { text: "שייט הוא חופש אמיתי — הרוח בשיער, המים מתחת לרגלים והאופק הפתוח לפניכם." },
    balloon: { text: "טיסה בכדור פורח היא חוויה שאין לה תחליף." },
    parachute: { text: "צניחה חופשית היא האדרנלין הגדול ביותר שתחוו בחייכם!" },
    gliding: { text: "טיסה בשמי ישראל על מטוסים קלים, גלשונים ואולטרה-לייט." },
  },
  en: {
    horses: { text: "Horse riding is an unforgettable experience that connects you to Israel's stunning nature and landscapes." },
    tractors: { text: "ATV riding is a real adventure for off-road and adrenaline lovers!" },
    rangers: { text: "Ranger riding is the perfect combination of thrill and scenery." },
    surfing: { text: "Surfing waves is one of the purest experiences nature has to offer." },
    diving: { text: "Beneath the water's surface lies a whole world of wonders." },
    sailing: { text: "Sailing is true freedom — the wind in your hair, water beneath your feet." },
    balloon: { text: "A hot air balloon ride is an irreplaceable experience." },
    parachute: { text: "Skydiving is the greatest adrenaline rush you'll ever experience!" },
    gliding: { text: "Flying over Israel's skies in light aircraft, hang gliders and ultralights." },
  }
};

function MapResizer() {
  const map = useMap();
  useEffect(() => { setTimeout(() => { map.invalidateSize(); }, 500); }, [map]);
  return null;
}

function MapFocuser({ attractions }) {
  const map = useMap();
  useEffect(() => {
    if (attractions.length === 1 && attractions[0].location?.lat) {
      map.setView([attractions[0].location.lat, attractions[0].location.lng], 13, { animate: true });
    } else if (attractions.length > 1) {
      const bounds = attractions.filter(a => a.location?.lat).map(a => [a.location.lat, a.location.lng]);
      if (bounds.length > 0) map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [attractions, map]);
  return null;
}

export default function ProductsList() {
  const { category, subCategory } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, lang } = useLang();

  const categoryTitles = {
    land: `${t.land} 🏕️`,
    sea: `${t.sea} 🌊`,
    air: `${t.air} ✈️`
  };

  const subCategoryTitles = {
    horses: `${t.horses} 🐴`,
    tractors: `${t.tractors} 🚜`,
    rangers: `${t.rangers} 🏎️`,
    surfing: `${t.surfing} 🏄`,
    diving: `${t.diving} 🤿`,
    sailing: `${t.sailing} ⛵`,
    balloon: `${t.balloon} 🎈`,
    parachute: `${t.parachute} 🪂`,
    gliding: `${t.gliding} ✈️`,
  };

  const [arrAtractions, setArrAtractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestAtraction, setNearestAtraction] = useState(null);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [top10Ids, setTop10Ids] = useState([]);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', sortBy: 'default' });
  const [showFilters, setShowFilters] = useState(false);

  const favorites = useSelector(state => state.favorites.arr);

  useEffect(() => {
    getTop10().then(res => setTop10Ids(res.data.map(item => item._id))).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllAtractions(category, subCategory, 100);
        const allData = res.data?.data || res.data || [];
        const filtered = allData.filter(item => !subCategory || item.subCategory === subCategory);
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

  const filteredAtractions = arrAtractions
    .filter(item =>
      item.name.includes(searchQuery) ||
      item.description.includes(searchQuery) ||
      item.address?.includes(searchQuery)
    )
    .filter(item => {
      if (filters.minPrice && item.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && item.price > Number(filters.maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'popular') return (b.orderCount || 0) - (a.orderCount || 0);
      return 0;
    });

  function findNearest() {
    const searchIn = searchQuery ? filteredAtractions : arrAtractions;
    navigator.geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      setUserLocation([userLat, userLng]);
      let nearest = null;
      let minDist = Infinity;
      searchIn.forEach(a => {
        if (!a.location?.lat || !a.location?.lng) return;
        const dist = Math.sqrt(Math.pow(a.location.lat - userLat, 2) + Math.pow(a.location.lng - userLng, 2));
        if (dist < minDist) { minDist = dist; nearest = a; }
      });
      setNearestAtraction(nearest);
    }, () => alert(lang === 'he' ? "אנא אפשר גישה למיקום" : "Please allow location access"));
  }

  const descInfo = subCategoryDescriptions[lang]?.[subCategory];

  if (loading) return (
    <div className="products-page">
      <div className="products-container">
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-desc" />
                <div className="skeleton-line skeleton-desc-2" />
                <div className="skeleton-line skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="products-page">
      <div className="products-container">

        {/* breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>🏠 {t.home}</span>
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
          {subCategoryTitles[subCategory] || categoryTitles[category] || t.allAttractions}
        </h1>

        {descInfo && (
          <div className="subcategory-description">
            <p>{descInfo.text}</p>
          </div>
        )}

        {/* חיפוש */}
        <div className="search-box" style={{ position: "relative" }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}>✕</button>
          )}
          {showSuggestions && searchQuery && filteredAtractions.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredAtractions.slice(0, 5).map((item) => (
                <div key={item._id} className="suggestion-item"
                  onMouseDown={() => { setSearchQuery(item.name); setShowSuggestions(false); }}>
                  <span className="suggestion-name">{item.name}</span>
                  <span className="suggestion-address">📍 {item.address?.split(",")[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* פילטרים */}
        <div className="filters-bar">
          <button className="filter-toggle-btn" onClick={() => setShowFilters(f => !f)}>
            🎯 {t.filters} {showFilters ? '▲' : '▼'}
          </button>
          {(filters.minPrice || filters.maxPrice || filters.sortBy !== 'default') && (
            <button className="filter-clear-btn" onClick={() => setFilters({ minPrice: '', maxPrice: '', sortBy: 'default' })}>
              ✕ {t.clearFilters}
            </button>
          )}
          <span className="filter-results">{filteredAtractions.length} {t.results}</span>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>💰 {t.priceRange}</label>
              <div className="price-range">
                <input type="number" placeholder={t.minPrice} value={filters.minPrice}
                  onChange={e => setFilters(f => ({...f, minPrice: e.target.value}))} />
                <span>—</span>
                <input type="number" placeholder={t.maxPrice} value={filters.maxPrice}
                  onChange={e => setFilters(f => ({...f, maxPrice: e.target.value}))} />
              </div>
            </div>
            <div className="filter-group">
              <label>📊 {t.sortBy}</label>
              <div className="sort-options">
                {[
                  { value: 'default', label: t.sortDefault },
                  { value: 'price-asc', label: `💰 ${t.sortPriceAsc}` },
                  { value: 'price-desc', label: `💰 ${t.sortPriceDesc}` },
                  { value: 'popular', label: `🔥 ${t.sortPopular}` },
                ].map(opt => (
                  <button key={opt.value}
                    className={`sort-btn ${filters.sortBy === opt.value ? 'active' : ''}`}
                    onClick={() => setFilters(f => ({...f, sortBy: opt.value}))}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* מפה */}
        <div className="map-section">
          <MapContainer center={[32.0853, 34.7818]} zoom={8} className="leaflet-map-main">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapResizer />
            <MapFocuser attractions={searchQuery ? filteredAtractions : arrAtractions} />
            {userLocation && <Marker position={userLocation}><Popup>{lang === 'he' ? 'המיקום שלי' : 'My Location'}</Popup></Marker>}
            {filteredAtractions.map((item) =>
              item.location?.lat ? (
                <Marker key={item._id} position={[item.location.lat, item.location.lng]}>
                  <Popup>{item.name}<br />{item.price} ₪</Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>

        {/* כפתור מיקום */}
        <div className="search-bar-above-map">
          <button className="location-btn" onClick={findNearest}>
            📍 {t.findNearest}
          </button>
          {nearestAtraction && (
            <div className="nearest-result">
              <div className="nearest-info">
                <h3>🏆 {t.nearestTitle} {nearestAtraction.name}</h3>
                <p>📍 {nearestAtraction.address}</p>
                <p>📞 {nearestAtraction.phone}</p>
                <p>💰 {nearestAtraction.price} ₪</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="buy-btn" onClick={() => setSelectedAttraction(nearestAtraction)}>
                  {t.purchaseTickets}
                </button>
                <button className="buy-btn"
                  style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}
                  onClick={() => dispatch(addToCart(nearestAtraction))}>
                  🛒
                </button>
              </div>
            </div>
          )}
        </div>

        {/* גריד אטרקציות */}
        <div className="attractions-grid-modern">
          {filteredAtractions.length > 0 ? (
            filteredAtractions.map((item) => (
              <div key={item._id} className="modern-card">
                {top10Ids.includes(item._id) && (
                  <div className="popular-badge">🔥 {t.popular}</div>
                )}
                <button
                  className={`fav-btn ${favorites.some((f) => f._id === item._id) ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); dispatch(toggleFavorite(item)); }}
                >
                  {favorites.some((f) => f._id === item._id) ? "❤️" : "🤍"}
                </button>
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="buy-btn" onClick={() => setSelectedAttraction(item)}>
                        {t.bookNow}
                      </button>
                      <button
                        className="buy-btn"
                        style={{ background: 'linear-gradient(135deg, #34d399, #059669)', padding: '8px 12px' }}
                        onClick={(e) => { 
                          e.stopPropagation();
                          console.log("מוסיף לסל:", item);
                           dispatch(addToCart(item)); }}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
              <h2>😕 {t.noResults} "{searchQuery}"</h2>
              <p style={{ color: "#888" }}>{t.tryOther}</p>
            </div>
          ) : (
            <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
              <h2>{t.noAttractions}</h2>
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