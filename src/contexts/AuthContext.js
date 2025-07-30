"use client"

import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"
import { authAPI } from "../services/api"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("dashboard_token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // Verify token validity
      authAPI
        .verify()
        .then((response) => {
          console.log("response: ", response);
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem("dashboard_token")
          delete api.defaults.headers.common["Authorization"]
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      console.log("response:,, ", response);
      const { token, user } = response.data

      // Check if user has dashboard access (vendor, admin, or super_admin)
      if (!["vendor", "admin", "super_admin"].includes(user.role)) {
        throw new Error("Access denied. Dashboard access required.")
      }

      localStorage.setItem("dashboard_token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Login failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem("dashboard_token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    toast.success("Logged out successfully")
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
