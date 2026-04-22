import { useState, useEffect } from "react";
import axios from "axios";
import { useLang } from "../LanguageContext";
import Swal from "sweetalert2";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import ReviewsIcon from "@mui/icons-material/RateReview";

const API_URL = "https://react-atracts-server-beityaakov.onrender.com/reviews";
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', fontFamily: 'Rubik',
    '& fieldset': { borderColor: 'rgba(52,211,153,0.3)' },
    '&:hover fieldset': { borderColor: '#34d399' },
    '&.Mui-focused fieldset': { borderColor: '#34d399' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)', fontFamily: 'Rubik' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#34d399' },
};

export default function Reviews() {
  const { lang } = useLang();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, text: '', attraction: '' });

  const tr = {
    he: {
      title: "ביקורות לקוחות", subtitle: "מה אומרים עלינו?",
      addReview: "הוסף ביקורת", yourName: "השם שלך",
      attraction: "שם האטרקציה (אופציונלי)", reviewText: "הביקורת שלך",
      submit: "שלח ביקורת", rating: "דירוג",
      noReviews: "אין ביקורות עדיין — היה הראשון!",
      general: "כללי", success: "הביקורת נשלחה!",
    },
    en: {
      title: "Customer Reviews", subtitle: "What do they say about us?",
      addReview: "Add Review", yourName: "Your Name",
      attraction: "Attraction name (optional)", reviewText: "Your review",
      submit: "Submit Review", rating: "Rating",
      noReviews: "No reviews yet — be the first!",
      general: "General", success: "Review submitted!",
    }
  }[lang];

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setReviews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) {
      Swal.fire({ title: 'שדות חסרים', icon: 'warning', background: '#04140e', color: '#fff' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(API_URL, { ...form, attraction: form.attraction || 'כללי' });
      setReviews(prev => [res.data, ...prev]);
      setForm({ name: '', rating: 5, text: '', attraction: '' });
      Swal.fire({ title: tr.success, icon: 'success', timer: 1500, showConfirmButton: false, background: '#04140e', color: '#fff' });
    } catch (err) {
      Swal.fire({ title: 'שגיאה', text: err.message, icon: 'error', background: '#04140e', color: '#fff' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 4 }, pt: { xs: 10, md: 12 }, direction: 'rtl', maxWidth: 900, mx: 'auto' }}>

      {/* כותרת */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
          <ReviewsIcon sx={{ color: '#34d399', fontSize: 40 }} />
          <Typography variant="h3" sx={{ fontFamily: 'Rubik', fontWeight: 900, color: '#fff' }}>{tr.title}</Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik' }}>{tr.subtitle}</Typography>
      </Box>

      {/* טופס הוספת ביקורת */}
      <Card sx={{ background: 'rgba(4,20,14,0.92)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Rubik', fontWeight: 700, color: '#fff', mb: 2 }}>
            ✍️ {tr.addReview}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label={tr.yourName} sx={inputSx} value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <TextField fullWidth label={tr.attraction} sx={inputSx} value={form.attraction}
                  onChange={e => setForm(f => ({ ...f, attraction: e.target.value }))} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Rubik' }}>{tr.rating}:</Typography>
                <Rating value={form.rating} onChange={(e, val) => setForm(f => ({ ...f, rating: val }))}
                  icon={<StarIcon sx={{ color: '#fbbf24' }} />}
                  emptyIcon={<StarIcon sx={{ color: 'rgba(255,255,255,0.2)' }} />} />
              </Box>

              <TextField fullWidth multiline rows={3} label={tr.reviewText} sx={inputSx}
                value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />

              <Button type="submit" variant="contained" endIcon={<SendIcon />} disabled={submitting}
                sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, py: 1.2, alignSelf: 'flex-start', boxShadow: '0 0 20px rgba(52,211,153,0.3)', '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' } }}>
                {submitting ? <CircularProgress size={20} color="inherit" /> : tr.submit}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Divider sx={{ borderColor: 'rgba(52,211,153,0.15)', mb: 3 }} />

      {/* רשימת ביקורות */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#34d399' }} />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'Rubik', mt: 4 }}>{tr.noReviews}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reviews.map(review => (
            <Card key={review._id} sx={{
              background: 'rgba(4,20,14,0.85)', border: '1px solid rgba(52,211,153,0.15)',
              borderRadius: '12px', color: '#fff',
              transition: 'all 0.2s',
              '&:hover': { border: '1px solid rgba(52,211,153,0.3)', transform: 'translateY(-2px)' }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #34d399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'Rubik', fontSize: '1rem' }}>
                      {review.name?.charAt(0).toUpperCase()}
                    </Box>
                    <Box>
                      <Typography sx={{ fontFamily: 'Rubik', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{review.name}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontFamily: 'Rubik' }}>{formatDate(review.createdAt)}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Rating value={review.rating} readOnly size="small"
                      icon={<StarIcon sx={{ color: '#fbbf24', fontSize: 16 }} />}
                      emptyIcon={<StarIcon sx={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }} />} />
                    {review.attraction && review.attraction !== 'כללי' && (
                      <Chip label={review.attraction} size="small"
                        sx={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', fontFamily: 'Rubik', fontSize: '0.75rem', border: '1px solid rgba(52,211,153,0.2)' }} />
                    )}
                  </Box>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Rubik', fontSize: '0.9rem', lineHeight: 1.6 }}>{review.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}