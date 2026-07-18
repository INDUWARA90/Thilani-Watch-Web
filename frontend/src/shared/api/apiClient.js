import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return "Something went wrong.";
};

export const unwrapApiData = (response) => {
  if (response.data?.data) {
    return response.data.data;
  }

  return response.data;
};