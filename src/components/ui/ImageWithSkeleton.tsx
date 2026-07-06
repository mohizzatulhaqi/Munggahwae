'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  wrapperClassName: string;
  imageClassName?: string;
  unoptimized?: boolean;
}

const PROXIED_HOSTNAMES = ['upload.wikimedia.org'];

function resolveSrc(src: string) {
  try {
    const url = new URL(src);
    if (PROXIED_HOSTNAMES.includes(url.hostname)) {
      return `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
  } catch {
    // relative/local src, use as-is
  }
  return src;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  wrapperClassName,
  imageClassName = 'object-cover',
  unoptimized,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <Image
        src={resolveSrc(src)}
        alt={alt}
        fill
        unoptimized={unoptimized}
        onLoad={() => setLoaded(true)}
        className={`${imageClassName} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default ImageWithSkeleton;
