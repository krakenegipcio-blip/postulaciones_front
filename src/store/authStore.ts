import { create } from 'zustand';

interface User {
  id: number;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isCheckingAuth: true,
  user: null,
  login: (user) => set({ isAuthenticated: true, user, isCheckingAuth: false }),
  logout: () => set({ isAuthenticated: false, user: null }),
  checkAuth: async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/me`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        set({ isAuthenticated: true, user: data.user, isCheckingAuth: false });
      } else {
        set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, user: null, isCheckingAuth: false });
    }
  }
}));
