import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  role: 'member' | 'creator' | 'admin';
  verified: boolean;
  walletBalance: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; dob: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1500));
    set({
      user: {
        id: '1', username: 'member_user', displayName: 'Island Member',
        email: 'member@islandplus.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        role: 'member', verified: true, walletBalance: 245.50,
      },
      isAuthenticated: true, isLoading: false,
    });
  },
  register: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 2000));
    set({ isLoading: false });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  setUser: (user) => set({ user, isAuthenticated: true }),
}));
