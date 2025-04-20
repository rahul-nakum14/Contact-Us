"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"

const API_URL = "https://urban-eureka-6qgj4g649x42r4xr-3000.app.github.dev/api/v1"

type User = {
  id: string
  username: string
  email: string
  isVerified: boolean
  [key: string]: any
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (username: string, email: string, password: string) => Promise<any>
  logout: () => void
  refreshAccessToken: () => Promise<string>
  forgotPassword: (email: string) => Promise<any>
  resetPassword: (token: string, password: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken) as User
        setUser(decoded)
      } catch (error) {
        console.error("Invalid token:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    }

    setIsLoading(false)
  }, [])

  // Redirect to dashboard if already logged in and on auth pages
  useEffect(() => {
    if (!isLoading && user) {
      const path = window.location.pathname
      if (path === "/login" || path === "/signup" || path === "/forgot-password" || path === "/reset-password") {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router])

  const login = async (input: string, password: string): Promise<User> => {
    try {
      // Simple check to determine if input is an email
      const isEmail = input.includes("@");
  
      const response = await axios.post(`${API_URL}/auth/login`, {
        [isEmail ? "email" : "username"]: input,
        password,
      });
  
      const { accessToken, refreshToken } = response.data;
  
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
  
      const decoded = jwtDecode<User>(accessToken);
      setUser(decoded);
  
      return decoded;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      return Promise.reject(message);
    }
  };
  

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
      })

      return response.data
    } catch (error: any) {
      console.error("Signup error:", error)
      throw error.response?.data || error
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser(null)
    router.push("/login")
  }

  const refreshAccessToken = async (): Promise<string> => {
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

      const decoded = jwtDecode(accessToken) as User
      setUser(decoded)

      return accessToken
    } catch (error) {
      console.error("Token refresh error:", error)
      logout()
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      })

      return response.data
    } catch (error: any) {
      console.error("Forgot password error:", error)
      throw error.response?.data || error
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password,
      })

      return response.data
    } catch (error: any) {
      console.error("Reset password error:", error)
      throw error.response?.data || error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshAccessToken,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
