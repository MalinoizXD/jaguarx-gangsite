'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause, X, Music2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AutoPlayMusicProps {
  src: string
  volume?: number
  youtubeId?: string
  title?: string
  artist?: string
}

export default function AutoPlayMusic({
  src,
  volume = 0.3,
  youtubeId = 'l21wGxlWwPw',
  title = 'fukumean',
  artist = 'Gunna'
}: AutoPlayMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVolume, setCurrentVolume] = useState(volume)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Get YouTube thumbnail
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`

  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return

    const audio = audioRef.current
    if (!audio) return

    // Set initial volume
    audio.volume = currentVolume

    // Update time
    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateTime)

    // Small delay to ensure DOM is ready (helps with server-side rendering)
    const timer = setTimeout(() => {
      // Try to play with user interaction simulation
      const playAudio = async () => {
        try {
          await audio.play()
          setIsPlaying(true)
        } catch {
          // If autoplay is blocked, try to enable it on any user interaction
          const enableAutoplay = async () => {
            try {
              await audio.play()
              setIsPlaying(true)
              // Remove event listeners after successful play
              document.removeEventListener('click', enableAutoplay)
              document.removeEventListener('touchstart', enableAutoplay)
              document.removeEventListener('keydown', enableAutoplay)
            } catch (err) {
              console.log('Audio autoplay failed:', err)
            }
          }

          // Add event listeners for user interaction
          document.addEventListener('click', enableAutoplay, { once: true })
          document.addEventListener('touchstart', enableAutoplay, { once: true })
          document.addEventListener('keydown', enableAutoplay, { once: true })
        }
      }

      playAudio()
    }, 100) // Small delay to ensure component is fully mounted

    return () => {
      clearTimeout(timer)
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateTime)
      if (audio) {
        audio.pause()
      }
    }
  }, [src, currentVolume])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setCurrentVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = currentVolume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        style={{ display: 'none' }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Music Player UI */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            /* Expanded Player */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-72"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <X
                    className="w-4 h-4 text-white/60 hover:text-white cursor-pointer transition-colors"
                    onClick={() => setIsExpanded(false)}
                  />
                  <span className="text-xs text-white/60">ซ่อนเพลง</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  กำลังเล่นอยู่
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative mb-4 rounded-xl overflow-hidden aspect-video">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Song Info */}
              <div className="mb-4 text-center">
                <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
                <p className="text-white/60 text-xs">{artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer progress-slider"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-gray-900" />
                  ) : (
                    <Play className="w-6 h-6 text-gray-900 ml-1" />
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 px-2">
                <button
                  onClick={toggleMute}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {isMuted || currentVolume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : currentVolume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer volume-slider"
                />
              </div>
            </motion.div>
          ) : (
            /* Compact Player */
            <motion.div
              key="compact"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl cursor-pointer hover:scale-105 transition-transform group"
            >
              <div className="flex items-center gap-3">
                {/* Mini Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <Music2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Song Info - Compact */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-white text-xs font-medium truncate">{title}</p>
                  <p className="text-white/50 text-[10px] truncate">{artist}</p>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlayPause()
                  }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-gray-900" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-900 ml-0.5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .progress-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        @keyframes bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
      `}</style>
    </>
  )
}