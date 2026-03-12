import axios from "axios";
let API_URL = "https://react-atracts-server-beityaakov.onrender.com/orders";

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
