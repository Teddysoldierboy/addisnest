'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';


interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const safeImages = images.length > 0 ? images : ['/images/placeholder.jpg'];
  
  const prev = useCallback(() => {
    setActiveIndex(i => (i === 0 ? safeImages.length - 1 : i - 1));
  }, [safeImages.length]);
  
  const next = useCallback(() => {
    setActiveIndex(i => (i === safeImages.length - 1 ? 0 : i + 1));
  }, [safeImages.length]);

  return (
    <>
      <div className="relative w-full">
        {/* Main Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={safeImages[activeIndex]}
            alt={`${title} - image ${activeIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 70vw"
          />
          
          {/* Nav Buttons */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-800" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-neutral-800" />
              </button>
            </>
          )}
          
          {/* Expand Button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all"
            aria-label="View fullscreen"
          >
            <Expand className="w-4 h-4 text-neutral-800" />
          </button>

          {/* Counter Badge */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {activeIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {safeImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all',
                  i === activeIndex
                    ? 'border-amber-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90'
                )}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <div
            className="relative w-full max-w-4xl max-h-[85vh] aspect-[16/9] mx-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={safeImages[activeIndex]}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <div className="absolute bottom-4 text-white/70 text-sm">
            {activeIndex + 1} / {safeImages.length}
          </div>
        </div>
      )}
    </>
  );
}