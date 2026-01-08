import axios from "axios";


const BASE_URL = "http://localhost:5000/attractions"; 

export const getAttractions = async () => {
    const response = await axios.get(BASE_URL);
    return response;
};


