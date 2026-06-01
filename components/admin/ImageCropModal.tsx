'use client';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { X, ZoomIn, Check } from 'lucide-react';
import { getCroppedImageBlob } from '@/lib/image-crop';

type AspectMode = '4:3' | '16:9';

const ASPECT_MAP: Record<AspectMode, number> = {
  '4:3': 4 / 3,
  '16:9': 16 / 9,
};

interface ImageCropModalProps {
  imageSrc: string;
  aspectMode?: AspectMode;
  onCancel: () => void;
  onComplete: (file: File) => void;
}

export function ImageCropModal({
  imageSrc,
  aspectMode = '4:3',
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onComplete(file);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            <h3 className="font-semibold text-neutral-900">Crop property image</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Drag to reposition · Scroll or slider to zoom · {aspectMode} aspect ratio
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-[min(60vh,420px)] bg-neutral-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT_MAP[aspectMode]}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <ZoomIn className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={processing || !croppedAreaPixels}
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {processing ? 'Processing…' : 'Apply crop & upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
