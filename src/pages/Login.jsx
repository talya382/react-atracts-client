import React from 'react';
import { userIn } from '../features/user/userSlice'; // להסיר את ה-// אם הייבוא הזה קיים בספריית ה-Redux שלך
import { useForm } from 'react-hook-form';
import { loginUser } from '../api/userService';
import { useDispatch } from 'react-redux';
// import { userIn } from '../features/userSlice';
export default function Login() {
    let dispatch = useDispatch()
    // אתחול ה-Hook
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // פונקציה שתופעל בעת שליחה מוצלחת
    const onSubmit = (data) => {
        console.log("נתוני התחברות:", data);
        loginUser(data).then(res => {
            alert("התחברת בהצלחה")
            console.log(res.data)
            dispatch(userIn(res.data))
        })
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>התחברות</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* שדה אימייל */}
                <div style={{ marginBottom: '15px' }}>
                    <label>אימייל:</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "שדה אימייל הוא חובה",
                            // pattern: {
                            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            //     message: "כתובת אימייל לא תקינה"
                            // }
                        })}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}
                </div>

                {/* שדה סיסמה */}
                <div style={{ marginBottom: '15px' }}>
                    <label>סיסמה:</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "שדה סיסמה הוא חובה",
                            minLength: {
                                value: 4,
                                message: "הסיסמה חייבת להכיל לפחות 6 תווים"
                            }
                        })}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>}
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    התחבר
                </button>
            </form>
        </div>
    );
};






