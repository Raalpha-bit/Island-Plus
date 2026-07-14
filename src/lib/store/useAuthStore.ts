import { create } from 'zustand';
import { createClient } from '../supabase/client';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  role: 'member' | 'creator' | 'admin';
  is_verified: boolean;
  country: string | null;
  wallet_balance: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
    dob?: string;
    role?: 'member' | 'creator' | 'admin';
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    const supabase = createClient();
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      // Fetch profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          set({ user: profile, isAuthenticated: true });
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  },

  register: async (data) => {
    const supabase = createClient();
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            username: data.username,
            display_name: data.displayName || data.username,
            dob: data.dob,
            role: data.role || 'member',
          },
        },
      });
      if (error) throw new Error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true }),

  fetchProfile: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (profile) {
      set({ user: profile, isAuthenticated: true });
    }
  },
}));
