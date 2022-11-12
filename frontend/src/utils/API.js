import axios from "axios";
import Cookies from "js-cookie";

const domain = "http://54.248.36.249/api";
const version = "1.0";

const API = axios.create({
  baseURL: `${domain}/${version}`,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Share&SaveToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use((response) => {
  return {
    data: response.data.data,
  };
});

async function GET(path, params) {
  const response = await API.get(path, params);
  return response;
}

async function POST(path, form) {
  const response = await API.post(path, form);
  return response;
}

async function PUT(path, form) {
  const response = await API.put(path, form);
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
