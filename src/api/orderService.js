import axios from "axios";
let API_URL = "http://localhost:3000/Orders";

export function getAllOrders() {
    return axios.get(API_URL);
}
export function getOrderById(id) {
    return axios.get(`${API_URL}/${id}`);
}
export function createOrder(orderData) {
    return axios.post(API_URL, orderData);
}
export function updateOrder(id, orderData) {
    return axios.put(`${API_URL}/${id}`, orderData);
}
export function deleteOrder(id) {
    return axios.delete(`${API_URL}/${id}`);
}
