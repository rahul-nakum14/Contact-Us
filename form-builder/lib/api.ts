import axios from "axios"

const API_URL = "https://color-master.onrender.com/api/v1"

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

// Add this function to handle slug generation
export const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() || `untitled-form-${Date.now().toString().slice(-5)}`
  )
}

// Fix: Generate unique names for untitled forms
export const createForm = async (formData) => {
  try {
    // Get existing forms to check for untitled forms
    const existingForms = JSON.parse(localStorage.getItem("forms") || "[]")

    // If no title provided, generate a unique "Untitled Form" name
    let title = formData.title
    if (!title || title.trim() === "") {
      // Count existing untitled forms to create a unique name
      const untitledForms = existingForms.filter((form) => form.title.startsWith("Untitled Form"))

      if (untitledForms.length === 0) {
        title = "Untitled Form"
      } else {
        // Find the highest number and increment
        const numbers = untitledForms
          .map((form) => {
            const match = form.title.match(/Untitled Form (\d+)/)
            return match ? Number.parseInt(match[1], 10) : 0
          })
          .filter((num) => !isNaN(num))

        const highestNumber = numbers.length > 0 ? Math.max(...numbers) : 0
        title = `Untitled Form ${highestNumber + 1}`
      }
    }

    // Generate a slug from the title
    const slug = generateSlug(title)

    // Add the title and slug to the form data
    const formWithSlug = {
      ...formData,
      title,
      slug,
    }

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would be an API call
    const newForm = {
      _id: `form_${Date.now()}`,
      ...formWithSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: 0,
    }

    // Store in localStorage for demo purposes
    const forms = [...existingForms]
    forms.push(newForm)
    localStorage.setItem("forms", JSON.stringify(forms))

    return newForm
  } catch (error) {
    console.error("Error creating form:", error)
    throw error
  }
}

// Fix: Use localStorage for demo purposes to avoid 404 errors
export const fetchForms = async () => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    return forms
  } catch (error) {
    console.error("Error fetching forms:", error)
    throw error
  }
}

// Fix: Use localStorage for demo purposes to avoid 404 errors
export const fetchForm = async (formId) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const form = forms.find((f) => f._id === formId)

    if (!form) {
      throw new Error("Form not found")
    }

    return form
  } catch (error) {
    console.error("Error fetching form:", error)
    throw error
  }
}

// Fix: Use localStorage for demo purposes to avoid 404 errors
export const fetchPublicForm = async (slug) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const form = forms.find((f) => f.slug === slug)

    if (!form) {
      throw new Error("Form not found")
    }

    return form
  } catch (error) {
    console.error("Error fetching public form:", error)
    throw error
  }
}

// Fix: Use localStorage for demo purposes to avoid 404 errors
export const updateForm = async (formId, formData) => {
  try {
    // Generate a new slug if the title has changed
    const slug = generateSlug(formData.title)

    // Add the slug to the form data
    const formWithSlug = {
      ...formData,
      slug,
      updatedAt: new Date().toISOString(),
    }

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const formIndex = forms.findIndex((f) => f._id === formId)

    if (formIndex === -1) {
      throw new Error("Form not found")
    }

    forms[formIndex] = {
      ...forms[formIndex],
      ...formWithSlug,
    }

    localStorage.setItem("forms", JSON.stringify(forms))

    return forms[formIndex]
  } catch (error) {
    console.error("Error updating form:", error)
    throw error
  }
}

// Fix: Use localStorage for demo purposes to avoid 404 errors
export const deleteForm = async (formId) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const newForms = forms.filter((f) => f._id !== formId)

    localStorage.setItem("forms", JSON.stringify(newForms))

    return { success: true }
  } catch (error) {
    console.error("Error deleting form:", error)
    throw error
  }
}

// Fix: Use localStorage for demo purposes to avoid 404 errors
export const cloneForm = async (formId) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const form = forms.find((f) => f._id === formId)

    if (!form) {
      throw new Error("Form not found")
    }

    const newForm = {
      ...form,
      _id: `form_${Date.now()}`,
      title: `${form.title} (Copy)`,
      slug: generateSlug(`${form.title} (Copy)`),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: 0,
    }

    forms.push(newForm)
    localStorage.setItem("forms", JSON.stringify(forms))

    return newForm
  } catch (error) {
    console.error("Error cloning form:", error)
    throw error
  }
}

// Form Responses API - Using localStorage for demo
export const submitFormResponse = async (formId, responseData) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms and responses from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const responses = JSON.parse(localStorage.getItem("formResponses") || "{}")

    // Find the form
    const formIndex = forms.findIndex((f) => f._id === formId)
    if (formIndex === -1) {
      throw new Error("Form not found")
    }

    // Create response object
    const response = {
      _id: `response_${Date.now()}`,
      formId,
      data: responseData,
      createdAt: new Date().toISOString(),
    }

    // Add response to responses
    if (!responses[formId]) {
      responses[formId] = []
    }
    responses[formId].push(response)

    // Update form response count
    forms[formIndex].responses = (forms[formIndex].responses || 0) + 1

    // Save to localStorage
    localStorage.setItem("forms", JSON.stringify(forms))
    localStorage.setItem("formResponses", JSON.stringify(responses))

    return response
  } catch (error) {
    console.error("Error submitting form response:", error)
    throw error
  }
}

export const fetchFormResponses = async (formId) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get responses from localStorage
    const responses = JSON.parse(localStorage.getItem("formResponses") || "{}")

    return responses[formId] || []
  } catch (error) {
    console.error("Error fetching form responses:", error)
    throw error
  }
}

// Fix: Improve stats calculation for recent responses
export const fetchFormStats = async (formId) => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get forms and responses from localStorage
    const forms = JSON.parse(localStorage.getItem("forms") || "[]")
    const responses = JSON.parse(localStorage.getItem("formResponses") || "{}")

    const form = forms.find((f) => f._id === formId)
    if (!form) {
      throw new Error("Form not found")
    }

    const formResponses = responses[formId] || []

    // Calculate recent responses (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentResponses = formResponses.filter((response) => {
      const responseDate = new Date(response.createdAt)
      return responseDate >= sevenDaysAgo
    })

    return {
      totalResponses: formResponses.length,
      recentResponses: recentResponses.length,
      lastResponse: formResponses.length > 0 ? formResponses[formResponses.length - 1].createdAt : null,
      responsesPerDay: calculateResponsesPerDay(formResponses),
    }
  } catch (error) {
    console.error("Error fetching form stats:", error)
    throw error
  }
}

// Helper function to calculate responses per day
function calculateResponsesPerDay(responses) {
  const responsesPerDay = {}

  responses.forEach((response) => {
    const date = new Date(response.createdAt).toISOString().split("T")[0]
    responsesPerDay[date] = (responsesPerDay[date] || 0) + 1
  })

  // Convert to array format
  return Object.keys(responsesPerDay).map((date) => ({
    _id: date,
    count: responsesPerDay[date],
  }))
}

export const exportFormResponses = async (formId, format = "json") => {
  try {
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get responses from localStorage
    const responses = JSON.parse(localStorage.getItem("formResponses") || "{}")
    const formResponses = responses[formId] || []

    if (format === "json") {
      return formResponses
    } else if (format === "csv") {
      // Simple CSV conversion for demo
      if (formResponses.length === 0) {
        return "No data"
      }

      const headers = Object.keys(formResponses[0].data).join(",")
      const rows = formResponses
        .map((response) => {
          return Object.values(response.data).join(",")
        })
        .join("\n")

      return `${headers}\n${rows}`
    } else {
      throw new Error("Unsupported format")
    }
  } catch (error) {
    console.error("Error exporting form responses:", error)
    throw error
  }
}

export default api
