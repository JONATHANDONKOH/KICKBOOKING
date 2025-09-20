"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { mockStadiums } from '@/data/mockData'

interface BackgroundCarouselProps {
  autoPlayInterval?: number
  showNavigation?: boolean
}

// Fallback images in case the mock data fails to load
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1920&h=1080&fit=crop"
];

export default function BackgroundCarousel({ 
  autoPlayInterval = 8000,
  showNavigation = false 
}: BackgroundCarouselProps) {
  // Process stadium images with error handling
  const [stadiumImages, setStadiumImages] = useState<Array<{
    id: string;
    name: string;
    imageUrl: string;
    location: string;
  }>>([]);

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Process images on component mount
  useEffect(() => {
    try {
      // Filter out Wembley Stadium (id: "1") and get image URLs
      let filteredStadiums = mockStadiums
        .filter(stadium => stadium.id !== "1") // Exclude Wembley
        .filter(stadium => !["West London, England", "Liverpool, England", "North London, England"].includes(stadium.location));
      // Remove the first Manchester stadium
      const firstManchesterIndex = filteredStadiums.findIndex(stadium => stadium.location.includes("Manchester"));
      if (firstManchesterIndex !== -1) {
        filteredStadiums.splice(firstManchesterIndex, 1);
      }
      const processedImages = filteredStadiums
        .map((stadium, index) => ({
          id: stadium.id,
          name: stadium.name,
          imageUrl: stadium.imageUrl?.replace('w=800&h=600', 'w=1920&h=1080') || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
          location: stadium.location
        }));

      setStadiumImages(processedImages);
    } catch (error) {
      console.error('Error processing stadium data:', error);
      // Use fallback images if there's an error with mock data
      const fallbackImages = FALLBACK_IMAGES.map((url, index) => ({
        id: `fallback-${index}`,
        name: `Stadium ${index + 1}`,
        imageUrl: url,
        location: 'Unknown Location'
      }));
      setStadiumImages(fallbackImages);
    }
  }, []);

  // Preload images with better error handling
  useEffect(() => {
    if (stadiumImages.length === 0) return;

    const preloadImages = async () => {
      const imagePromises = stadiumImages.map((stadium) => {
        return new Promise((resolve) => {
          // Skip if no image URL
          if (!stadium.imageUrl) {
            resolve(true);
            return;
          }
          
          const img = new window.Image();
          img.onload = () => resolve(true);
          img.onerror = () => {
            console.warn(`Failed to load image: ${stadium.imageUrl}`);
            resolve(false); // Don't reject, just resolve with false
          };
          img.src = stadium.imageUrl;
        });
      });

      try {
        const results = await Promise.all(imagePromises);
        const allLoaded = results.every(result => result === true);
        
        if (!allLoaded) {
          console.warn('Some images failed to load, but continuing anyway');
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Unexpected error in preloading:', error);
        setIsLoaded(true); // Still show component even if preloading fails
      }
    };

    preloadImages();
  }, [stadiumImages]);

  // Auto-play functionality with pause control
  useEffect(() => {
    if (!autoPlayInterval || isPaused || stadiumImages.length === 0) return

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        setCurrentIndex((prevIndex) => 
          prevIndex === stadiumImages.length - 1 ? 0 : prevIndex + 1
        )
        
        // Reset transitioning state after animation completes
        setTimeout(() => setIsTransitioning(false), 1000)
      }
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlayInterval, stadiumImages.length, isPaused, isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (!isTransitioning && stadiumImages.length > 0) {
      setIsTransitioning(true)
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 1000)
    }
  }, [isTransitioning, stadiumImages.length])

  const goToPrevious = useCallback(() => {
    if (!isTransitioning && stadiumImages.length > 0) {
      setIsTransitioning(true)
      setCurrentIndex(currentIndex === 0 ? stadiumImages.length - 1 : currentIndex - 1)
      setTimeout(() => setIsTransitioning(false), 1000)
    }
  }, [currentIndex, stadiumImages.length, isTransitioning])

  const goToNext = useCallback(() => {
    if (!isTransitioning && stadiumImages.length > 0) {
      setIsTransitioning(true)
      setCurrentIndex(currentIndex === stadiumImages.length - 1 ? 0 : currentIndex + 1)
      setTimeout(() => setIsTransitioning(false), 1000)
    }
  }, [currentIndex, stadiumImages.length, isTransitioning])

  if (!isLoaded || stadiumImages.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fade Carousel Container */}
      <div className="relative w-full h-full">
        {stadiumImages.map((stadium, index) => (
          <div
            key={stadium.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
          >
            <Image
              src={stadium.imageUrl}
              alt={`${stadium.name} - ${stadium.location}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={90}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              }}
            />
            {/* Enhanced subtle overlay for a more professional look */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />
            
            {/* Subtle vignette effect */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
            
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIHg9IjAiIHk9IjAiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiIC8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiAvPjwvc3ZnPg==')] opacity-30 mix-blend-soft-light" />
          </div>
        ))}
        
        {/* Stadium Info Badge */}
        <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg z-20">
          <p className="text-sm font-medium">{stadiumImages[currentIndex]?.name}</p>
          {!["West London, England", "Liverpool, England", "North London, England"].includes(stadiumImages[currentIndex]?.location) && (
            <p className="text-xs text-gray-300">{stadiumImages[currentIndex]?.location}</p>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {showNavigation && stadiumImages.length > 1 && (
        <>
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {stadiumImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125 ring-2 ring-offset-2 ring-offset-black ring-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Previous/Next Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Play/Pause Button - Only show if there are multiple images */}
      {stadiumImages.length > 1 && (
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all duration-300 z-10 backdrop-blur-sm"
          aria-label={isPaused ? "Play carousel" : "Pause carousel"}
        >
          {isPaused ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>
      )}

      {/* Progress Bar - Only show if there are multiple images */}
      {stadiumImages.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 linear"
            style={{ 
              width: isPaused ? '100%' : '0%',
              transition: isPaused ? 'none' : `width ${autoPlayInterval}ms linear`
            }}
            key={currentIndex} // Reset animation on slide change
          />
        </div>
      )}
    </div>
  )
}