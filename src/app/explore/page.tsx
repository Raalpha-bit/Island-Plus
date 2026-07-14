'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, CheckCircle, Users, Radio, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { categories } from '@/lib/mock/creators';
import { Api } from '@/lib/api';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [creatorsData, setCreatorsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCreators() {
      try {
        const data = await Api.get<any[]>('/creators');
        setCreatorsData(data);
      } catch (err) {
        console.error("Failed to fetch creators", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCreators();
  }, []);

  const filteredCreators = creatorsData.filter((c) => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'All' || c.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black-deep">
      <Navbar />
      
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-[family-name:var(--font-display)]">
            Explore <span className="gradient-text-purple">Creators</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Discover the best content creators, exclusive communities, and premium entertainment.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-card text-white placeholder:text-gray-500 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl glass-card text-white hover:bg-white/5 transition-all md:w-auto">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </button>
        </div>

        {/* Categories / Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveTab('All')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'All' ? 'bg-white text-black' : 'glass-card text-gray-300 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === cat.name ? 'bg-white text-black' : 'glass-card text-gray-300 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreators.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/creator/${creator.username}`} className="block group">
                  <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                    <div className="relative h-40">
                      <img src={creator.cover} alt={creator.displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black-card to-transparent" />
                      {creator.isLive && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-xs font-semibold text-white backdrop-blur-sm">
                          <Radio className="w-3 h-3 animate-pulse" /> LIVE
                        </div>
                      )}
                    </div>
                    <div className="relative px-5 pb-5">
                      <div className="relative -mt-10 mb-3 flex justify-between items-end">
                        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-black-card">
                          <img src={creator.avatar} alt={creator.displayName} className="w-full h-full object-cover" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-royal/20 text-purple-neon text-xs font-semibold">
                          ${creator.subscriptionPrice}/mo
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-base font-bold text-white truncate">{creator.displayName}</h3>
                        {creator.verified && <CheckCircle className="w-4 h-4 text-purple-neon flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">@{creator.username}</p>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">{creator.bio}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{(creator.followers / 1000).toFixed(0)}K followers</span>
                        <span>{creator.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredCreators.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No creators found matching your criteria.
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
