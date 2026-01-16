'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    className?: string
    priority?: boolean
    sizes?: string
    quality?: number
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
    onLoad?: () => void
}

export default function OptimizedImage({
    src,
    alt,
    fill = false,
    className = '',
    onLoad,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    // Check if the image is from R2
    const isR2 = src?.includes('r2.dev')

    // Fallback image for errors
    const fallbackSrc = '/uploads/jaguarxlogo.png'

    const imageSrc = error ? fallbackSrc : (src || fallbackSrc)

    const handleLoad = () => {
        setIsLoading(false)
        onLoad?.()
    }

    const handleError = () => {
        setError(true)
        setIsLoading(false)
    }

    // For R2 images, use regular img tag to avoid Next.js Image optimization issues
    if (isR2) {
        return (
            <div className={`relative overflow-hidden w-full h-full ${isLoading ? 'animate-pulse bg-zinc-800' : ''}`}>
                <img
                    src={imageSrc}
                    alt={alt}
                    loading="lazy"
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`${fill ? 'absolute inset-0 w-full h-full object-cover' : ''} ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                />
            </div>
        )
    }

    // For local/other images, use Next.js Image
    return (
        <div className={`relative overflow-hidden w-full h-full ${isLoading ? 'animate-pulse bg-zinc-800' : ''}`}>
            {fill ? (
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                />
            ) : (
                <Image
                    src={imageSrc}
                    alt={alt}
                    width={200}
                    height={200}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                />
            )}
        </div>
    )
}
