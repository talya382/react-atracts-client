import axios from "axios";
let API_URL = "http://localhost:3000/user";

export function loginUser(user) {
    return axios.post(API_URL + "/login", user);
}
export function addUser(userData) {
    return axios.post(API_URL, userData);
}
export function getAllUsers() {
    return axios.get(API_URL);
}
