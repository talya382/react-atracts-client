import axios from "axios";
const API_URL = "https://react-atracts-server-beityaakov.onrender.com/attractions";

// headers עם טוקן לבקשות מוגנות
const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// פתוח לכולם
export const getAllAtractions = (category, subCategory, limit = 100) => {
    const params = {};
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;
    params.limit = limit;
    return axios.get(API_URL, { params });
};

export const getAtractionById = (id) => axios.get(`${API_URL}/${id}`);
export const getTop10 = () => axios.get(`${API_URL}/top10`);
export const incrementOrder = (id) => axios.patch(`${API_URL}/${id}/order`);
export const getAtractionPageCount = () => axios.get(`${API_URL}/count`);

// מוגן - רק מנהל
export const createAtraction = (newAttr) => axios.post(API_URL, newAttr, authHeaders());
export const updateAtraction = (id, data) => axios.put(`${API_URL}/${id}`, data, authHeaders());
export const deleteAtraction = (id) => axios.delete(`${API_URL}/${id}`, authHeaders());