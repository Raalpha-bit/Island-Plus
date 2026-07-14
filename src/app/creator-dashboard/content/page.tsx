'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, Video, MoreHorizontal, Lock, Eye, Loader2, X } from 'lucide-react';
import { Api } from '@/lib/api';
import MediaUploader from '@/components/common/MediaUploader';

export default function ContentPage() {
  const [content, setContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [requiredTier, setRequiredTier] = useState<string>(''); // empty = free preview or public
  const [isFreePreview, setIsFreePreview] = useState(false);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await Api.get<any[]>('/creator/posts');
      setContent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load content.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsPublishing(true);
      const mediaList = newMediaUrl ? [{ type: newMediaType, url: newMediaUrl }] : [];
      await Api.post('/posts', {
        title: newTitle,
        text: newText,
        media: mediaList,
        requiredTier: requiredTier || null,
        isFreePreview,
      });

      // Clear form
      setNewTitle('');
      setNewText('');
      setNewMediaUrl('');
      setRequiredTier('');
      setIsFreePreview(false);
      setIsModalOpen(false);

      // Reload content
      loadContent();
    } catch (err: any) {
      alert(err.message || 'Failed to create post.');
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-display)]">Content Management</h1>
          <p className="text-sm text-gray-400">Upload and manage your exclusive content.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 transition-all glow-purple cursor-pointer"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {content.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
          You haven't posted anything yet. Click "New Post" to publish your first content!
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-5 sm:col-span-4">Content</div>
            <div className="col-span-3 hidden sm:block">Visibility</div>
            <div className="col-span-3 hidden md:block">Stats</div>
            <div className="col-span-4 sm:col-span-2 text-right">Status</div>
            <div className="col-span-3 sm:col-span-3 md:col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {content.map((item) => {
              const hasMedia = item.media && item.media.length > 0;
              const mediaType = hasMedia ? item.media[0].type : 'text';
              return (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black-surface flex items-center justify-center shrink-0">
                      {mediaType === 'video' ? (
                        <Video className="w-5 h-5 text-purple-neon" />
                      ) : mediaType === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-purple-neon" />
                      ) : (
                        <span className="text-xs text-gray-500">TXT</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.title || item.body || 'Untitled Post'}</p>
                      <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-3 hidden sm:flex items-center gap-1.5">
                    {item.required_tier ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-purple-neon" />
                        <span className="text-sm text-gray-300 capitalize">{item.required_tier} Tier+</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-sm text-gray-300">Public Subscribers</span>
                      </>
                    )}
                  </div>

                  <div className="col-span-3 hidden md:flex items-center gap-4 text-sm text-gray-300">
                    <span>{item.views_count} views</span>
                    <span>{item.likes_count} likes</span>
                  </div>

                  <div className="col-span-4 sm:col-span-2 text-right">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      Published
                    </span>
                  </div>

                  <div className="col-span-3 sm:col-span-3 md:col-span-1 text-right">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <MoreHorizontal className="w-5 h-5 ml-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-2xl p-6 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Create New Post</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Title (Optional)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. My Trip VLOG"
                    className="w-full px-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description / Body</label>
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    required
                    rows={4}
                    placeholder="Share something with your subscribers..."
                    className="w-full px-4 py-3 rounded-xl bg-black-surface border border-black-border text-white placeholder:text-gray-600 focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Upload Media (Optional)</label>
                  <MediaUploader
                    onUploadSuccess={(url) => {
                      setNewMediaUrl(url);
                      // Guess type from url ending or default to image
                      if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
                        setNewMediaType('video');
                      } else {
                        setNewMediaType('image');
                      }
                    }}
                    bucket="posts"
                  />
                </div>

                {newMediaUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Media Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={newMediaType === 'image'}
                          onChange={() => setNewMediaType('image')}
                          className="accent-purple-neon"
                        />
                        Image
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={newMediaType === 'video'}
                          onChange={() => setNewMediaType('video')}
                          className="accent-purple-neon"
                        />
                        Video
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Required Tier</label>
                    <select
                      value={requiredTier}
                      onChange={(e) => setRequiredTier(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black-surface border border-black-border text-white focus:border-purple-royal focus:ring-1 focus:ring-purple-royal/50 transition-all outline-none capitalize [color-scheme:dark]"
                    >
                      <option value="">Public (Free)</option>
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="black">Black</option>
                    </select>
                  </div>
                  {requiredTier && (
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFreePreview}
                          onChange={(e) => setIsFreePreview(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-neon focus:ring-purple-royal accent-purple-neon"
                        />
                        Free Preview
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="flex-1 py-3 rounded-xl gradient-purple text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all glow-purple flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
