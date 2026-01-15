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
  youtubeId = 'h_6-zy6Fjjc',
  title = 'Come Through',
  artist = 'The Weeknd'
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
              className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-4 w-80 relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)' }}
            >
              {/* Tech Accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">Hide Player</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-500 uppercase">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  Now Playing
                </div>
              </div>

              {/* Thumbnail */}
              <div className="relative mb-4 aspect-video bg-black border border-white/5 group overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
              </div>

              {/* Song Info */}
              <div className="mb-6 text-center">
                <h3 className="text-white font-bold text-lg uppercase tracking-wider truncate mb-1" style={{ fontFamily: 'var(--font-asylum)' }}>{title}</h3>
                <p className="text-neutral-500 text-xs uppercase tracking-widest">{artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6 px-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer progress-slider"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 clip-path-button"
                  style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 px-2 border-t border-white/5 pt-4">
                <button
                  onClick={toggleMute}
                  className="text-neutral-500 hover:text-white transition-colors"
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
                  className="flex-1 h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer volume-slider"
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
              className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-2 cursor-pointer hover:border-white/30 transition-colors group w-64"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}
            >
              <div className="flex items-center gap-3">
                {/* Mini Thumbnail */}
                <div className="relative w-10 h-10 bg-black border border-white/10 flex-shrink-0">
                  <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-2 bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-0.5 h-3 bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-0.5 h-1.5 bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <Music2 className="w-3 h-3 text-white/50" />
                    )}
                  </div>
                </div>

                {/* Song Info - Compact */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-white text-xs font-bold uppercase tracking-wider truncate" style={{ fontFamily: 'var(--font-asylum)' }}>{title}</p>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest truncate">{artist}</p>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlayPause()
                  }}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0 border border-white/10"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 text-white" />
                  ) : (
                    <Play className="w-3 h-3 text-white ml-0.5" />
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
          width: 4px;
          height: 12px;
          background: #ef4444;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .progress-slider:hover::-webkit-slider-thumb {
          background: #fff;
        }

        .progress-slider::-moz-range-thumb {
          width: 4px;
          height: 12px;
          background: #ef4444;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 8px;
          height: 8px;
          background: #fff;
          cursor: pointer;
          transform: rotate(45deg);
        }

        .volume-slider::-moz-range-thumb {
          width: 8px;
          height: 8px;
          background: #fff;
          cursor: pointer;
          border: none;
          transform: rotate(45deg);
        }

        @keyframes bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
      `}</style>
    </>
  )
}