import axios from 'axios'

// Determine base URL based on environment
const getBaseURL = () => {
  const envBaseURL = import.meta.env.VITE_API_BASE_URL || ''
  
  // Development mode (npm run dev) - uses .env.development
  if (import.meta.env.DEV && envBaseURL) {
    console.log('🔧 DEV mode - Using env:', envBaseURL)
    return envBaseURL
  }
  
  // Production mode with env variable set (real production server)
  if (import.meta.env.PROD && envBaseURL && envBaseURL.startsWith('http')) {
    console.log('🚀 PROD mode - Using env:', envBaseURL)
    return envBaseURL
  }
  
  // Default: use relative URLs (same origin as Vue app)
  console.log('📍 Using relative URLs (same origin)')
  return ''
}

// Create axios instance with base URL from environment variable
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000,  // 60 seconds for R2 image uploads
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor (for future auth tokens if needed)
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here in the future
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (for global error handling)
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
