import axios from "axios";
let API_URL = "http://localhost:3000/attractions";

export function getAllAtractions() {
  return axios.get(API_URL);
}
export function getAtractionById(id) {
  return axios.get(`${API_URL}/${id}`);
}
export function createAtraction(atractionData) {
  return axios.post(API_URL, atractionData);
}
export function updateAtraction(id, atractionData) {
  return axios.put(`${API_URL}/${id}`, atractionData);
}
export function deleteAtraction(id) {
  return axios.delete(`${API_URL}/${id}`);
}