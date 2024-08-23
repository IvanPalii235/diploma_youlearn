import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuthStatus: (status) => set({ isAuthenticated: status }),
  setUser: (user) => set({ user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
