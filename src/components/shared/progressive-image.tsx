'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define a unified interface that covers all possible image shapes
export interface UnifiedImageProps {
  url?: string;
  src?: string;
  thumbnailUrl?: string | null;
  thumbnailSrc?: string | null;
  mediumUrl?: string | null;
  cdnUrl?: string | null;
  originalSrc?: string | null;
}

interface ProgressiveImageProps {
  source?: UnifiedImageProps | string | null;
  image?: UnifiedImageProps | string | null; // Alias for backward compatibility
  alt?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

/**
 * ProgressiveImage component that mimics Broker-OS ListingMediaGallery logic.
 * It keeps the thumbnail visible until the optimized display image is fully loaded in the background.
 */
export function ProgressiveImage({
  source,
  image,
  alt = 'Property Image',
  className = '',
  imageClassName = '',
  width,
  height,
  priority = false,
  fill = false,
  sizes,
}: ProgressiveImageProps) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [error, setError] = useState(false);
  const loadingRef = useRef<string | null>(null);

  // Use either source or image prop
  const target = source || image;
  const isString = typeof target === 'string';
  
  let displayUrl = '';
  let thumbUrl = '';

  if (isString) {
    displayUrl = target as string;
    thumbUrl = target as string;
  } else if (target) {
    displayUrl = target.url || target.src || '';
    thumbUrl = target.thumbnailUrl || target.thumbnailSrc || displayUrl;
  }

  // Effect to preload the high-res image
  useEffect(() => {
    if (!displayUrl || isHighResLoaded || typeof window === 'undefined') return;
    
    // If high-res is same as thumb, skip preloading
    if (displayUrl === thumbUrl) {
      setIsHighResLoaded(true);
      return;
    }

    const img = new window.Image();
    img.decoding = 'async';
    img.src = displayUrl;
    loadingRef.current = displayUrl;
    
    img.onload = () => {
      if (loadingRef.current === displayUrl) {
        setIsHighResLoaded(true);
      }
    };
    
    img.onerror = () => {
      setError(true);
    };

    return () => {
      loadingRef.current = null;
    };
  }, [displayUrl, thumbUrl, isHighResLoaded]);

  if (!target || (error && !thumbUrl)) {
    return (
      <div className={cn('flex items-center justify-center bg-slate-100 text-slate-300', fill ? 'absolute inset-0' : '', className)}>
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-slate-100', 
        fill ? 'absolute inset-0' : 'inline-block',
        className
      )}
      style={!fill && width && height ? { aspectRatio: `${width}/${height}`, width: '100%' } : undefined}
    >
      {/* 1. Thumbnail / Placeholder Layer (Always present until high-res is ready) */}
      {thumbUrl && (
        <img
          src={thumbUrl}
          alt=""
          aria-hidden="true"
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            isHighResLoaded ? 'opacity-0' : 'opacity-100',
            imageClassName
          )}
          style={{ 
            filter: displayUrl !== thumbUrl ? 'blur(8px)' : 'none', 
            transform: displayUrl !== thumbUrl ? 'scale(1.05)' : 'none',
          }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* 2. Optimized Display Layer (Visible only when loaded) */}
      {displayUrl && (
        <img
          src={displayUrl}
          alt={alt}
          sizes={sizes}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsHighResLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'transition-opacity duration-300',
            fill ? 'absolute inset-0 w-full h-full' : 'w-full h-auto', 
            'object-cover',
            isHighResLoaded ? 'opacity-100' : 'opacity-0',
            imageClassName
          )}
        />
      )}

      {/* Loading Indicator for detailed views (Optional, mimicking Broker-OS) */}
      {!isHighResLoaded && !error && priority && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Optimizing View
        </div>
      )}
    </div>
  );
}
