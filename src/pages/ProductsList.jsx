import { useEffect, useState } from "react";
import axios from "axios";
// import { getAtraction } from "../redux/actions/atractionsActions"
import { useDispatch, useSelector } from "react-redux"
import { getAttractions } from "../app/productApi"
import ProductListItem from "../components/ProductListItem";

// פונקציה להבאת הנתונים מהשרת
const ProductsList = () => {
    let [numPages, setNumPages] = useState(0);
    let [arrProducts, setArrProducts] = useState([
        {
            id: 1,
            name: "טיול ג'יפים",
            description: "חוויה אתגרית בטבע",
            price: 250,
            imgUrl: "xoxo.jpg" // ודאי שיש קובץ כזה ב-public/img/
        },
        {
            id: 2,
            name: "סיור עיר העתיקה",
            description: "סיור היסטורי מרגש",
            price: 120,
            imgUrl: "old_city.jpg" // ודאי שיש קובץ כזה ב-public/img/
        }
    ]);
    let [pageNumber, setPageNumber] = useState(1);
    async function f() {
        try {
            let res = await getAttractions();
            setArrProducts(res.data);// שמירת המוצרים בסטייט המקומי
        } catch (error) {
            console.error("שגיאה בטעינת המוצרים:", error);
        }
    }

    // הרצת הפונקציה בטעינה הראשונית של הקומפוננטה
    useEffect(() => {
        f();
    }, []);
    return (
        <div className="products-list" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            האטרקציות שלנו
          </h1>
    
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '25px', 
            justifyContent: 'center' // ממרכז את הכרטיסים בשורה
          }}>
            {arrProducts.length > 0 ? (
              arrProducts.map((item) => (
                <ProductListItem key={item.id} product={item} />
              ))
            ) : (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <p>טוען מוצרים...</p>
                {/* כאן אפשר להוסיף Spinner בעתיד */}
              </div>
            )}
          </div>
    
          {/* אזור ניווט עתידי */}
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
            {/* כאן יבואו כפתורי העמודים (Pagination) */}
          </div>
        </div>
      );
    }
export default ProductsList;