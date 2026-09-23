'use client';

import { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
}

export function ImageWithFallback({
    src,
    alt,
    width,
    height,
    className,
    priority,
    loading,
}: ImageWithFallbackProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect fill="#f3e6d6" width={width} height={height} />
                <text
                    x={width / 2}
                    y={height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="16"
                    fill="#a89968"
                >
                    Image not found
                </text>
            </svg>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            loading={priority ? 'eager' : loading || 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setHasError(true)}
        />
    );
}