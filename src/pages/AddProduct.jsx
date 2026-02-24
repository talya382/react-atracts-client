import { useForm } from "react-hook-form";
import axios from "axios";
 import { createAtraction } from "../api/atractionService";

const AddAtraction = () => {

    let { register, handleSubmit, formState: { errors } } = useForm()
    async function save(data) {
        try {
            let result = await createAtraction(data)
            alert(`האטרקציה ${result.data?.title} נוספה בהצלחה`)
        }
        catch (err) {
            alert("מצטערים אי אפשר להוסיך אותה"+ " "+(err.response?.data?.message || err.message))
            console.log(err)
        }
    }
    return (
        <div className="add-atraction-container">
            <h1>הוספת אטרקציה חדשה</h1>

            <form className="form-add-atraction" onSubmit={handleSubmit(save)}>

                <label>שם האטרקציה</label>
                <input type="text" {...register("title", { required: "שם הוא חובה" })} />
                {errors.title && <div className="error-msg">{errors.title.message}</div>}

                <label>תיאור</label>
                <textarea {...register("description", { required: "תיאור הוא חובה" })} />
                {errors.description && <div className="error-msg">{errors.description.message}</div>}

                <label>כתובת תמונה</label>
                <input type="text" {...register("imgUrl", { required: "תמונה היא חובה" })} />
                {errors.imgUrl && <div className="error-msg">{errors.imgUrl.message}</div>}

                <label>מחיר</label>
                <input type="number" {...register("price", { 
                    required: "מחיר הוא חובה", 
                    min: { value: 0, message: "מחיר לא יכול להיות שלילי" } 
                })} />
                {errors.price && <div className="error-msg">{errors.price.message}</div>}

                <input type="submit" value="הוסף אטרקציה" />

            </form>
        </div>
        );
}

export default AddAtraction;