import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllAtractions } from "../api/atractionService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// תיקון אייקון ברירת מחדל של Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const subCategoryNames = {
  horses: 'רכיבה על סוסים',
  tractors: 'טרקטורנים',
  rangers: "רנג'רים"
};

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function SubCategoryMap() {
  const { category, subCategory } = useParams();
  const [attractions, setAttractions] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [nearest, setNearest] = useState(null);

  useEffect(() => {
    getAllAtractions()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        const filtered = data.filter(
          item => item.category === category && item.subCategory === subCategory
        );
        setAttractions(filtered);
      })
      .catch(err => console.error(err));
  }, [category, subCategory]);

  async function findNearest() {
    if (!userLocation || attractions.length === 0) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userLocation)}&country=israel&format=json&limit=1`
    );
    const data = await res.json();

    if (!data.length) {
      alert("לא נמצאה העיר, נסה שוב");
      return;
    }

    const userLat = parseFloat(data[0].lat);
    const userLng = parseFloat(data[0].lon);

    let closest = null;
    let minDist = Infinity;

    attractions.forEach(item => {
      if (item.location?.lat && item.location?.lng) {
        const dist = calculateDistance(userLat, userLng, item.location.lat, item.location.lng);
        if (dist < minDist) {
          minDist = dist;
          closest = item;
        }
      }
    });

    if (closest) {
      setNearest({ ...closest, distance: Math.round(minDist) });
    } else {
      alert("אין אטרקציות עם מיקום מוגדר");
    }
  }

  const israelCenter = [31.5, 34.8];

  return (
    <div style={{ direction: 'rtl', padding: '20px' }}>
      <h1>{subCategoryNames[subCategory]}</h1>

      <MapContainer center={israelCenter} zoom={8} style={{ height: '400px', width: '100%', borderRadius: '12px', marginBottom: '20px' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {attractions.map(item => (
          item.location?.lat && item.location?.lng ? (
            <Marker key={item._id} position={[item.location.lat, item.location.lng]}>
              <Popup>
                <strong>{item.name}</strong><br />
                {item.address}<br />
                📞 {item.phone}
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="הזן את העיר שלך (למשל: תל אביב)"
          value={userLocation}
          onChange={e => setUserLocation(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button
          onClick={findNearest}
          style={{ padding: '10px 20px', borderRadius: '8px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          מצא קרוב אלי
        </button>
      </div>

      {nearest && (
        <div style={{ background: '#f0f8ff', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3>האטרקציה הקרובה אליך:</h3>
          <p><strong>שם:</strong> {nearest.name}</p>
          <p><strong>כתובת:</strong> {nearest.address}</p>
          <p><strong>טלפון:</strong> {nearest.phone}</p>
          <p><strong>מחיר:</strong> {nearest.price} ₪</p>
          <p><strong>מרחק:</strong> {nearest.distance} ק"מ</p>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {attractions.map(item => (
          <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px', width: '250px' }}>
            {item.imgUrl && <img src={item.imgUrl} alt={item.name} style={{ width: '100%', borderRadius: '8px' }} />}
            <h4>{item.name}</h4>
            <p>{item.address}</p>
            <p>📞 {item.phone}</p>
            <p>💰 {item.price} ₪</p>
          </div>
        ))}
      </div>
    </div>
  );
}