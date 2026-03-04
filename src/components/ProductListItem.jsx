import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const ProductListItem = ({ product }) => {
    const dispatch = useDispatch();
    const imagePath = `/img/${product.imgUrl}`;

    return (
        <div style={{
            background: 'rgba(4, 20, 14, 0.85)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            fontFamily: "'Rubik', sans-serif",
            transition: 'all 0.2s ease',
            cursor: 'pointer',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.border = '1px solid rgba(52, 211, 153, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.1)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.border = '1px solid rgba(52, 211, 153, 0.2)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
            <img
                src={imagePath}
                alt={product.name}
                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
                <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>
                    {product.name}
                </h3>
                <p style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: '600', marginBottom: '14px' }}>
                    {product.price} ₪
                </p>
                <button
                    onClick={() => {
                        console.log("נלחץ!", product)
                        dispatch(addToCart(product))
                    }}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #34d399, #059669)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontFamily: "'Rubik', sans-serif",
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 16px rgba(52, 211, 153, 0.3)',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(52, 211, 153, 0.5)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(52, 211, 153, 0.3)'}
                >
                    🛒 הוסף לסל
                </button>
            </div>
        </div>
    );
};

export default ProductListItem;