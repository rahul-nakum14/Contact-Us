import axios from "axios"

const API_URL = "http://localhost:3000/api/v1"

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        })

        const { accessToken } = response.data

        localStorage.setItem("accessToken", accessToken)

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Form API
export const createForm = async (formData) => {
  const response = await api.post("/forms", formData)
  return response.data
}

export const fetchForms = async () => {
  const response = await api.get("/forms")
  return response.data
}

export const fetchForm = async (formId) => {
  const response = await api.get(`/forms/${formId}`)
  return response.data
}

export const fetchPublicForm = async (slug) => {
  const response = await api.get(`/forms/public/${slug}`)
  return response.data
}

export const updateForm = async (formId, formData) => {
  const response = await api.put(`/forms/${formId}`, formData)
  return response.data
}

export const deleteForm = async (formId) => {
  const response = await api.delete(`/forms/${formId}`)
  return response.data
}

export const cloneForm = async (formId) => {
  const response = await api.post(`/forms/${formId}/clone`)
  return response.data
}

// Form Responses API
export const submitFormResponse = async (formId, responseData) => {
  const response = await api.post(`/forms/${formId}/submit`, responseData)
  return response.data
}

export const fetchFormResponses = async (formId) => {
  const response = await api.get(`/forms/${formId}/responses`)
  return response.data
}

export const fetchFormStats = async (formId) => {
  const response = await api.get(`/forms/${formId}/stats`)
  return response.data
}

export const exportFormResponses = async (formId, format = "json") => {
  const response = await api.get(`/forms/${formId}/export?format=${format}`)
  return response.data
}

export default api
