import { useForm } from 'react-hook-form';
import { addUser } from '../api/userService';
import { useDispatch } from 'react-redux';
import { userIn } from '../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import './Login.css';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await addUser(data);
            dispatch(userIn(res.data));
            navigate("/");
        } catch (err) {
            setError("root", { message: "ההרשמה נכשלה, נסה שנית" });
        }
    };

    return (
        <AuthBackground>
            <div className="auth-card">
                <div className="auth-header">
                    <h2>🏔️ הרשמה</h2>
                    <p>צור חשבון חדש</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="auth-field">
                        <label>שם משתמש</label>
                        <input type="text" placeholder="השם שלך"
                            {...register("userName", { required: "שדה חובה", minLength: { value: 2, message: "לפחות 2 תווים" } })} />
                        {errors.userName && <span className="auth-error">{errors.userName.message}</span>}
                    </div>
                    <div className="auth-field">
                        <label>אימייל</label>
                        <input type="email" placeholder="your@email.com"
                            {...register("email", { required: "שדה חובה" })} />
                        {errors.email && <span className="auth-error">{errors.email.message}</span>}
                    </div>
                    <div className="auth-field">
                        <label>סיסמה</label>
                        <input type="password" placeholder="••••••••"
                            {...register("password", { required: "שדה חובה", minLength: { value: 4, message: "לפחות 4 תווים" } })} />
                        {errors.password && <span className="auth-error">{errors.password.message}</span>}
                    </div>
                    {errors.root && <p className="auth-error-root">{errors.root.message}</p>}
                    <button type="submit" className="auth-btn" disabled={isSubmitting}>
                        {isSubmitting ? "נרשם..." : "הירשם"}
                    </button>
                </form>
                <p className="auth-switch">
                    יש לך חשבון? <Link to="/login">התחבר כאן</Link>
                </p>
            </div>
        </AuthBackground>
    );
}