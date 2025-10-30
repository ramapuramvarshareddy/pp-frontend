import axios from "axios";

const API = axios.create({
  baseURL: 'https://pp-backend-a6z1.onrender.com/api',
  withCredentials: true,
});

export default API;
