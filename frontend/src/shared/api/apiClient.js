import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// Shared Axios instance used by all feature API modules.
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

export const getApiErrorMessage = (error, fallbackMessage = "Something went wrong.") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return fallbackMessage;
};

export const unwrapApiData = (response) => {
  if (response.data?.data) {
    return response.data.data;
  }

  return response.data;
};
