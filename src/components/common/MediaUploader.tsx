'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MediaUploaderProps {
  onUploadSuccess: (url: string) => void;
  bucket?: string;
  maxSizeMB?: number;
}

export default function MediaUploader({
  onUploadSuccess,
  bucket = 'posts',
  maxSizeMB = 10,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      return;
    }

    setError('');
    setIsUploading(true);
    setProgress(10);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      setProgress(30);

      // Upload file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(80);

      // Retrieve public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      setUploadedUrl(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setUploadedUrl(null);
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {uploadedUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-black-surface border border-purple-royal/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Upload Successful</p>
              <p className="text-xs text-gray-500 truncate">{uploadedUrl}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-black-border hover:border-purple-royal/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-purple-neon" />
              <p className="text-sm text-gray-300">Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-purple-royal/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-neon" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Click to upload media</p>
                <p className="text-xs text-gray-500 mt-1">Supports Images and Videos up to {maxSizeMB}MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
