import axios from "axios";
let API_URL = "https://react-atracts-server-beityaakov.onrender.com/users";

export function loginUser(user) {
    return axios.post(API_URL + "/login", user);
}
export function addUser(userData) {
    return axios.post(API_URL, userData);
}
export function getAllUsers() {
    return axios.get(API_URL);
}
