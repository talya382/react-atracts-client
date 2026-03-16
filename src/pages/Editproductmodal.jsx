import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getAtractionById, updateAtraction } from "../api/atractionService";
import Swal from "sweetalert2";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

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
    color: '#fff',
    fontFamily: 'Rubik',
    '& fieldset': { borderColor: 'rgba(52,211,153,0.3)' },
    '&:hover fieldset': { borderColor: '#34d399' },
    '&.Mui-focused fieldset': { borderColor: '#34d399' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)', fontFamily: 'Rubik' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#34d399' },
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
};

export default function EditProductModal({ attraction, onClose, onUpdate }) {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const selectedCategory = watch("category");

  useEffect(() => {
    if (!attraction) return;
    reset({
      name: attraction.name,
      description: attraction.description,
      price: attraction.price,
      phone: attraction.phone,
      address: attraction.address,
      category: attraction.category,
      subCategory: attraction.subCategory,
      imgUrl: attraction.imgUrl,
      lat: attraction.location?.lat,
      lng: attraction.location?.lng,
    });
  }, [attraction, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        location: { lat: Number(data.lat), lng: Number(data.lng) }
      };
      delete payload.lat;
      delete payload.lng;
      const res = await updateAtraction(attraction._id, payload);
      Swal.fire({
        title: '✅ עודכן בהצלחה!',
        icon: 'success', timer: 1500,
        showConfirmButton: false,
        background: '#04140e', color: '#fff',
      });
      onUpdate(res.data);
    } catch (err) {
      Swal.fire({
        title: 'שגיאה בעדכון',
        text: err.response?.data?.message || err.message,
        icon: 'error', background: '#04140e', color: '#fff',
      });
    }
  };

  return (
    <Dialog
      open={!!attraction}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: '#04140e',
          border: '1px solid rgba(52,211,153,0.2)',
          borderRadius: '16px',
          color: '#fff',
          direction: 'rtl',
        }
      }}
    >
      <DialogTitle sx={{ fontFamily: 'Rubik', fontWeight: 900, fontSize: '1.3rem', borderBottom: '1px solid rgba(52,211,153,0.15)', pb: 2 }}>
        ✏️ עריכת אטרקציה: {attraction?.name}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField fullWidth label="שם האטרקציה" sx={inputSx}
                {...register("name", { required: true })}
                error={!!errors.name} helperText={errors.name ? "שדה חובה" : ""} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="תיאור" sx={inputSx}
                {...register("description", { required: true })}
                error={!!errors.description} helperText={errors.description ? "שדה חובה" : ""} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="number" label="מחיר (₪)" sx={inputSx}
                {...register("price", { required: true, min: 1 })}
                error={!!errors.price} helperText={errors.price ? "שדה חובה" : ""} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="טלפון" sx={inputSx}
                {...register("phone", { required: true })}
                error={!!errors.phone} helperText={errors.phone ? "שדה חובה" : ""} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="כתובת" sx={inputSx}
                {...register("address", { required: true })}
                error={!!errors.address} helperText={errors.address ? "שדה חובה" : ""} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth select label="קטגוריה" sx={inputSx}
                defaultValue={attraction?.category || ""}
                {...register("category", { required: true })}
                error={!!errors.category}
                SelectProps={{ MenuProps: { PaperProps: { sx: { background: '#04140e', color: '#fff' } } } }}
              >
                {Object.keys(categories).map(cat => (
                  <MenuItem key={cat} value={cat}>{categoryLabels[cat]}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth select label="תת קטגוריה" sx={inputSx}
                defaultValue={attraction?.subCategory || ""}
                {...register("subCategory", { required: true })}
                error={!!errors.subCategory}
                disabled={!selectedCategory}
                SelectProps={{ MenuProps: { PaperProps: { sx: { background: '#04140e', color: '#fff' } } } }}
              >
                {(selectedCategory ? categories[selectedCategory] : []).map(sub => (
                  <MenuItem key={sub} value={sub}>{subCategoryLabels[sub]}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="נתיב תמונה" sx={inputSx}
                {...register("imgUrl", { required: true })}
                error={!!errors.imgUrl} helperText={errors.imgUrl ? "שדה חובה" : ""} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="number" label="קו רוחב (lat)" sx={inputSx}
                inputProps={{ step: "any" }}
                {...register("lat", { required: true })} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth type="number" label="קו אורך (lng)" sx={inputSx}
                inputProps={{ step: "any" }}
                {...register("lng", { required: true })} />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(52,211,153,0.15)', p: 2, gap: 1 }}>
          <Button onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik', border: '1px solid rgba(255,255,255,0.15)', '&:hover': { border: '1px solid rgba(255,255,255,0.3)' } }}>
            ביטול
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              background: 'linear-gradient(135deg, #34d399, #059669)',
              fontFamily: 'Rubik', fontWeight: 700,
              boxShadow: '0 0 20px rgba(52,211,153,0.3)',
              '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' }
            }}>
            {isSubmitting ? "שומר..." : "💾 שמור שינויים"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}