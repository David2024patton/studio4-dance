import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = '/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password })
          const { access_token, user } = response.data
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          set({ user, token: access_token, isAuthenticated: true, loading: false })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.detail || 'Login failed'
          set({ error: message, loading: false })
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null })
        try {
          const response = await axios.post(`${API_URL}/auth/register`, userData)
          const { access_token, user } = response.data
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          set({ user, token: access_token, isAuthenticated: true, loading: false })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.detail || 'Registration failed'
          set({ error: message, loading: false })
          return { success: false, error: message }
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization']
        set({ user: null, token: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        const { token } = get()
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          try {
            const response = await axios.get(`${API_URL}/users/me`)
            set({ user: response.data, isAuthenticated: true })
          } catch {
            set({ user: null, token: null, isAuthenticated: false })
          }
        }
      },
    }),
    {
      name: 'studio4-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
