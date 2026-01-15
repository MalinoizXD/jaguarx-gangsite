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
    <div className="flex justify-center mb-8">
      <div className={`relative w-full max-w-md transition-all duration-300 ${
        isFocused ? 'scale-105' : 'scale-100'
      }`}>
        <div className={`absolute inset-0 rounded-xl blur-sm transition-all duration-300 ${
          isFocused 
            ? 'bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20' 
            : 'bg-gradient-to-r from-gray-600/10 to-gray-700/10'
        }`} />
        
        <div className="relative">
          <Search 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              isFocused ? 'text-red-400 scale-110' : 'text-gray-400 scale-100'
            }`} 
            size={20} 
          />
          
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-12 pr-12 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-xl border-2 border-gray-600/50 focus:border-red-500/70 focus:outline-none transition-all duration-300 placeholder-gray-400 focus:placeholder-gray-500 text-center"
          />
          
          {input && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-gray-700/50"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}