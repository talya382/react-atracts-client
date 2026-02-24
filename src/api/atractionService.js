import axios from "axios";
const API_URL = "http://localhost:3000/attractions";

export const getAllAtractions =(category, subCategory,limit=100) => {
  const params = {};
  if (category) params.category = category;
  if (subCategory) params.subCategory = subCategory;
  params.limit = limit;
  return axios.get(API_URL, { params });
};;
export const getAtractionById = (id) => axios.get(`${API_URL}/${id}`);
export const createAtraction = (newAttr) => axios.post(API_URL, newAttr);
export const updateAtraction = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteAtraction = (id) => axios.delete(`${API_URL}/${id}`);
export const getAtractionPageCount = () => axios.get(`${API_URL}/count`);