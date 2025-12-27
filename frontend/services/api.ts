import { API_URL } from "@/constants/config";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosPrivate = axios.create({
  baseURL: API_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token to all requests
axiosPrivate.interceptors.request.use(
    async (config) =>{
        try{
            const token = await AsyncStorage.getItem('userToken');
            if(token){
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }
        catch(error){
            console.error('Error reading token from storage:', error);
            return config;
        }
    }, (error) => {
        // Handle request error
        return Promise.reject(error);
    }
)

// Response interceptor - handles errors globally
axiosPrivate.interceptors.response.use(
  (response) => {
    // If response is successful, just return the data
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.log('Unauthorized - clearing token');
          await AsyncStorage.removeItem('userToken');
          // You can trigger navigation to login screen here
          // or dispatch a logout action if using state management
          break;
          
        case 403:
          // Forbidden
          console.log('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.log('Resource not found');
          break;
          
        case 500:
          // Server error
          console.log('Server error');
          break;
          
        default:
          console.log('API Error:', data?.message || 'Unknown error');
      }
      
      // Return formatted error
      return Promise.reject({
        status,
        message: data?.message || 'Something went wrong',
        errors: data?.errors || null,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
      return Promise.reject({
        status: null,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      return Promise.reject({
        status: null,
        message: error.message || 'Request failed',
      });
    }
  }
);