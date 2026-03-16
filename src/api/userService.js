import axios from "axios";
const API_URL = "https://react-atracts-server-beityaakov.onrender.com/users";
// const API_URL = "http://localhost:3000/users";

// פונקציה שמחזירה headers עם טוקן
const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export function loginUser(user) {
    return axios.post(API_URL + "/login", user);
}

export function addUser(userData) {
    return axios.post(API_URL, userData);
}

export function getAllUsers() {
    return axios.get(API_URL, authHeaders());
}