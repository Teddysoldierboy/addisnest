'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ImageCropModal } from '@/components/admin/ImageCropModal';
import { Upload, Loader2 } from 'lucide-react';

interface ImageUploadFieldProps {
  storagePrefix?: string;
  aspectMode?: '4:3' | '16:9';
  onUploaded: (publicUrl: string) => void;
  label?: string;
}

export function ImageUploadField({
  storagePrefix = 'uploads',
  aspectMode = '4:3',
  onUploaded,
  label = 'Upload & crop image',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  async function uploadCroppedFile(file: File) {
    setUploading(true);
    setError('');
    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${storagePrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      setPreview(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('property-images').getPublicUrl(path);

    onUploaded(publicUrl);
    setPreview(null);
    setUploading(false);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors disabled:opacity-60"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Uploading…' : label}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {preview && (
        <ImageCropModal
          imageSrc={preview}
          aspectMode={aspectMode}
          onCancel={() => setPreview(null)}
          onComplete={(file) => uploadCroppedFile(file)}
        />
      )}
    </div>
  );
}
