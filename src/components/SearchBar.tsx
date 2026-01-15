'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input)
    }, 300)

    return () => clearTimeout(timer)
  }, [input, onSearch])

  const clearSearch = () => {
    setInput('')
    onSearch('')
  }

  return (
    <div className="flex justify-center w-full">
      <div className={`relative w-full transition-all duration-300 ${isFocused ? 'opacity-100' : 'opacity-80'
        }`}>
        {/* Tech Borders */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />

        <div className="relative flex items-center bg-black/50 border border-white/10 backdrop-blur-md">
          <div className="pl-4 text-neutral-500">
            <Search size={16} />
          </div>

          <input
            type="text"
            placeholder="SEARCH DATABASE..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 bg-transparent text-white text-sm tracking-widest uppercase focus:outline-none placeholder-neutral-600"
          />

          {input && (
            <button
              onClick={clearSearch}
              className="pr-4 text-neutral-500 hover:text-white transition-colors"
              title="CLEAR"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}