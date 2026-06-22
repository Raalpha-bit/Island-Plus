'use client';

import { motion } from 'framer-motion';
import { User, Lock, Bell, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Settings</h1>
        <p className="text-sm text-gray-400">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Edit Profile', icon: User, active: true },
            { id: 'privacy', label: 'Privacy & Safety', icon: EyeOff },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-purple-royal/20 text-purple-neon' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img src={user?.avatar} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10" />
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-black-surface border border-white/20 flex items-center justify-center text-white hover:bg-white/10">
                  <User className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Profile Photo</h3>
                <p className="text-xs text-gray-400 mb-2">Recommended: Square image, at least 400x400px.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white hover:bg-white/20">Change</button>
                  <button className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white">Remove</button>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Display Name</label>
                  <input type="text" defaultValue={user?.displayName} className="w-full px-4 py-2.5 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Username</label>
                  <input type="text" defaultValue={user?.username} className="w-full px-4 py-2.5 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal outline-none" />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" className="px-6 py-2.5 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
