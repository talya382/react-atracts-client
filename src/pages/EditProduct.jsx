import { useForm } from "react-hook-form";
import { getAtractionById, updateAtraction } from "../api/atractionService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AuthBackground from '../components/AuthBackground';
import "./AddProduct.css";

const categories = {
  land: ["horses", "tractors", "rangers"],
  sea: ["surfing", "diving", "sailing"],
  air: ["balloon", "parachute", "gliding"],
};

const categoryLabels = {
  land: "🏕️ יבשה", sea: "🌊 ים", air: "✈️ אוויר"
};

const subCategoryLabels = {
  horses: "🐴 סוסים", tractors: "🚜 טרקטורנים", rangers: "🏎️ רנג'רים",
  surfing: "🏄 גלישה", diving: "🤿 צלילה", sailing: "⛵ שייט",
  balloon: "🎈 כדור פורח", parachute: "🪂 צניחה", gliding: "✈️ טיסה"
};

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [loadingData, setLoadingData] = useState(true);

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const selectedCategory = watch("category");

  // הגנה — רק מנהל
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="add-page">
        <div className="add-card">
          <h2 style={{ color: '#ef4444', textAlign: 'center' }}>🚫 גישה אסורה</h2>
        </div>
      </div>
    );
  }

  useEffect(() => {
    getAtractionById(id)
      .then(res => {
        const a = res.data;
        reset({
          name: a.name,
          description: a.description,
          price: a.price,
          phone: a.phone,
          address: a.address,
          category: a.category,
          subCategory: a.subCategory,
          imgUrl: a.imgUrl,
          lat: a.location?.lat,
          lng: a.location?.lng,
        });
        setLoadingData(false);
      })
      .catch(() => {
        alert("שגיאה בטעינת האטרקציה");
        navigate("/list");
      });
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        location: {
          lat: Number(data.lat),
          lng: Number(data.lng),
        }
      };
      delete payload.lat;
      delete payload.lng;
      await updateAtraction(id, payload);
      alert("✅ האטרקציה עודכנה בהצלחה!");
      navigate("/list");
    } catch (err) {
      alert("שגיאה בעדכון: " + (err.response?.data?.message || err.message));
    }
  };

  if (loadingData) return (
    <div className="add-page">
      <div className="add-card" style={{ textAlign: 'center' }}>
        <p style={{ color: '#34d399' }}>טוען נתונים...</p>
      </div>
    </div>
  );

  return (
    <AuthBackground>
      <div className="add-card">
        <div className="add-header">
          <h2>✏️ עריכת אטרקציה</h2>
          <p>עדכן את פרטי האטרקציה</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="add-form">

          <div className="add-field">
            <label>שם האטרקציה</label>
            <input {...register("name", { required: "שדה חובה" })} />
            {errors.name && <span className="add-error">{errors.name.message}</span>}
          </div>

          <div className="add-field">
            <label>תיאור</label>
            <textarea rows={3} {...register("description", { required: "שדה חובה" })} />
            {errors.description && <span className="add-error">{errors.description.message}</span>}
          </div>

          <div className="add-row">
            <div className="add-field">
              <label>מחיר (₪)</label>
              <input type="number" {...register("price", { required: "שדה חובה", min: { value: 1, message: "מחיר חייב להיות חיובי" } })} />
              {errors.price && <span className="add-error">{errors.price.message}</span>}
            </div>
            <div className="add-field">
              <label>טלפון</label>
              <input {...register("phone", { required: "שדה חובה" })} />
              {errors.phone && <span className="add-error">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="add-field">
            <label>כתובת</label>
            <input {...register("address", { required: "שדה חובה" })} />
            {errors.address && <span className="add-error">{errors.address.message}</span>}
          </div>

          <div className="add-row">
            <div className="add-field">
              <label>קטגוריה</label>
              <select {...register("category", { required: "שדה חובה" })}>
                <option value="">בחר קטגוריה</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                ))}
              </select>
              {errors.category && <span className="add-error">{errors.category.message}</span>}
            </div>
            <div className="add-field">
              <label>תת קטגוריה</label>
              <select {...register("subCategory", { required: "שדה חובה" })} disabled={!selectedCategory}>
                <option value="">בחר תת קטגוריה</option>
                {selectedCategory && categories[selectedCategory]?.map(sub => (
                  <option key={sub} value={sub}>{subCategoryLabels[sub]}</option>
                ))}
              </select>
              {errors.subCategory && <span className="add-error">{errors.subCategory.message}</span>}
            </div>
          </div>

          <div className="add-field">
            <label>נתיב תמונה</label>
            <input {...register("imgUrl", { required: "שדה חובה" })} />
            {errors.imgUrl && <span className="add-error">{errors.imgUrl.message}</span>}
          </div>

          <div className="add-row">
            <div className="add-field">
              <label>קו רוחב (lat)</label>
              <input type="number" step="any" {...register("lat", { required: "שדה חובה" })} />
              {errors.lat && <span className="add-error">{errors.lat.message}</span>}
            </div>
            <div className="add-field">
              <label>קו אורך (lng)</label>
              <input type="number" step="any" {...register("lng", { required: "שדה חובה" })} />
              {errors.lng && <span className="add-error">{errors.lng.message}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="add-btn" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? "מעדכן..." : "💾 שמור שינויים"}
            </button>
            <button type="button"
              onClick={() => navigate("/list")}
              style={{
                flex: 1, padding: '14px', borderRadius: '8px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)', fontFamily: "'Rubik', sans-serif",
                fontWeight: '600', cursor: 'pointer', fontSize: '1rem'
              }}>
              ביטול
            </button>
          </div>

        </form>
      </div>
      </AuthBackground>
  );
}