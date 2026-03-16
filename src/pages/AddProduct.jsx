import { useForm, Controller } from "react-hook-form";
import { createAtraction } from "../api/atractionService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthBackground from '../components/AuthBackground';
import Swal from "sweetalert2";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const categories = {
  land: ["horses", "tractors", "rangers"],
  sea: ["surfing", "diving", "sailing"],
  air: ["balloon", "parachute", "gliding"],
};
const categoryLabels = { land: "🏕️ יבשה", sea: "🌊 ים", air: "✈️ אוויר" };
const subCategoryLabels = {
  horses: "🐴 סוסים", tractors: "🚜 טרקטורנים", rangers: "🏎️ רנג'רים",
  surfing: "🏄 גלישה", diving: "🤿 צלילה", sailing: "⛵ שייט",
  balloon: "🎈 כדור פורח", parachute: "🪂 צניחה", gliding: "✈️ טיסה"
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', fontFamily: 'Rubik',
    '& fieldset': { borderColor: 'rgba(52,211,153,0.3)' },
    '&:hover fieldset': { borderColor: '#34d399' },
    '&.Mui-focused fieldset': { borderColor: '#34d399' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)', fontFamily: 'Rubik' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#34d399' },
  '& .MuiFormHelperText-root': { color: '#ef4444' },
};

export default function AddProduct() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const { register, handleSubmit, watch, control, formState: { errors, isSubmitting } } = useForm();
  const selectedCategory = watch("category");

  if (!user || user.role !== "ADMIN") return (
    <AuthBackground>
      <Box sx={{ textAlign: 'center', color: '#ef4444' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Rubik', fontWeight: 900 }}>🚫 גישה אסורה</Typography>
      </Box>
    </AuthBackground>
  );

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, price: Number(data.price), location: { lat: Number(data.lat), lng: Number(data.lng) } };
      delete payload.lat; delete payload.lng;
      await createAtraction(payload);
      Swal.fire({ title: '✅ האטרקציה נוספה!', icon: 'success', timer: 1800, showConfirmButton: false, background: '#04140e', color: '#fff' });
      navigate("/list");
    } catch (err) {
      Swal.fire({ title: 'שגיאה', text: err.response?.data?.message || err.message, icon: 'error', background: '#04140e', color: '#fff' });
    }
  };

  return (
    <AuthBackground>
      <Box sx={{ width: '100%', maxWidth: 620, background: 'rgba(4,20,14,0.92)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px', p: 4, boxShadow: '0 0 60px rgba(0,0,0,0.5)', direction: 'rtl' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Rubik', fontWeight: 900, color: '#fff', mb: 0.5 }}>⚙️ הוספת אטרקציה</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik' }}>מלא את הפרטים להוספת אטרקציה חדשה</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="שם האטרקציה" placeholder="לדוגמה: חוות הסוסים הגליל" sx={inputSx}
                {...register("name", { required: "שדה חובה" })} error={!!errors.name} helperText={errors.name?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="תיאור" placeholder="תיאור קצר..." sx={inputSx}
                {...register("description", { required: "שדה חובה" })} error={!!errors.description} helperText={errors.description?.message} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="מחיר (₪)" placeholder="150" sx={inputSx}
                {...register("price", { required: "שדה חובה", min: { value: 1, message: "חייב להיות חיובי" } })} error={!!errors.price} helperText={errors.price?.message} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="טלפון" placeholder="04-1234567" sx={inputSx}
                {...register("phone", { required: "שדה חובה" })} error={!!errors.phone} helperText={errors.phone?.message} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="כתובת" placeholder="כפר בלום, גליל עליון" sx={inputSx}
                {...register("address", { required: "שדה חובה" })} error={!!errors.address} helperText={errors.address?.message} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="category" control={control} defaultValue="" rules={{ required: "שדה חובה" }}
                render={({ field }) => (
                  <TextField fullWidth select label="קטגוריה" sx={inputSx} {...field} error={!!errors.category} helperText={errors.category?.message}
                    SelectProps={{ MenuProps: { PaperProps: { sx: { background: '#04140e', color: '#fff' } } } }}>
                    {Object.keys(categories).map(cat => <MenuItem key={cat} value={cat}>{categoryLabels[cat]}</MenuItem>)}
                  </TextField>
                )} />
            </Grid>
            <Grid item xs={6}>
              <Controller name="subCategory" control={control} defaultValue="" rules={{ required: "שדה חובה" }}
                render={({ field }) => (
                  <TextField fullWidth select label="תת קטגוריה" sx={inputSx} {...field} disabled={!selectedCategory} error={!!errors.subCategory} helperText={errors.subCategory?.message}
                    SelectProps={{ MenuProps: { PaperProps: { sx: { background: '#04140e', color: '#fff' } } } }}>
                    {(selectedCategory ? categories[selectedCategory] : []).map(sub => <MenuItem key={sub} value={sub}>{subCategoryLabels[sub]}</MenuItem>)}
                  </TextField>
                )} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="נתיב תמונה" placeholder="/img/horses/horses-1.png" sx={inputSx}
                {...register("imgUrl", { required: "שדה חובה" })} error={!!errors.imgUrl} helperText={errors.imgUrl?.message} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="קו רוחב (lat)" placeholder="32.08" sx={inputSx}
                inputProps={{ step: "any" }} {...register("lat", { required: "שדה חובה" })} error={!!errors.lat} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="קו אורך (lng)" placeholder="34.78" sx={inputSx}
                inputProps={{ step: "any" }} {...register("lng", { required: "שדה חובה" })} error={!!errors.lng} />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <AddCircleIcon />}
                sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, py: 1.5, fontSize: '1rem', boxShadow: '0 0 20px rgba(52,211,153,0.3)', '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' } }}>
                {isSubmitting ? "מוסיף..." : "➕ הוסף אטרקציה"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </AuthBackground>
  );
}