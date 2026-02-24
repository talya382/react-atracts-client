import { useState } from "react";
import {addUser} from "../api/userService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [userData, setUserData] = useState({ name: "", email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addUser(userData); // שימוש ב-API שלך
            if (res.status === 201 || res.status === 200) {
                alert("הרשמה הצליחה!");
                
                // שמירה ברידקס (בהנחה שיש לך Action מתאים)
                dispatch({ type: "USER_LOGIN", payload: res.data });
                
                // מעבר לדף הבית
                navigate("/products");
            }
        } catch (error) {
            console.error("שגיאה בהרשמה:", error);
            alert("ההרשמה נכשלה, נסה שנית.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>הרשמת משתמש חדש</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="שם מלא" onChange={handleChange} required 
                       style={inputStyle} />
                <input type="email" name="email" placeholder="אימייל" onChange={handleChange} required 
                       style={inputStyle} />
                <input type="password" name="password" placeholder="סיסמה" onChange={handleChange} required 
                       style={inputStyle} />
                <button type="submit" style={{ padding: "10px 20px" }}>הירשם ושמור במערכת</button>
            </form>
        </div>
    );
};

const inputStyle = { display: "block", width: "100%", margin: "10px 0", padding: "8px" };

export default Register;