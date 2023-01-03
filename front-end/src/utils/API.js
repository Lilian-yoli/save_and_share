import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Share&SaveToken");
    const { url } = config;
    const isGoogleApi = url.includes('googleapis');
    if (isGoogleApi) return config;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


async function GET(path, params) {
  const response = await API.get(path, params);
  return response;
}

async function POST(path, form) {
  const response = await API.post(path, form);
  return response;
}

async function PUT(path, form, params) {
  const response = await API.put(path, form, params);
  return response;
}

async function PATCH(path, form) {
  const response = await API.patch(path, form);
  return response;
}

async function DELETE(path, params) {
  const response = await API.delete(path, params);
  return response;
}

export { GET, POST, PUT, PATCH, DELETE };
