'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import MemberCard from '../../components/MemberCard'
import SearchBar from '../../components/SearchBar'
import Pagination from '../../components/Pagination'

interface Member {
  id: number
  firstname: string
  lastname: string
  imageurl?: string
  role?: string
  sociallinks?: Record<string, string>
}

interface ApiResponse {
  members: Member[] | {
    grouped: Record<string, Member[]>
    letters: string[]
    flat: Member[]
    total: number
  }
  founders: Member[]
  leaders: Member[]
  total: number
  page: number
  totalPages: number
}

export default function MembersPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterJAGUARX, setFilterJAGUARX] = useState(false)

  const fetchMembers = async (pageNum: number, searchTerm: string, JAGUARXFilter: boolean = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: pageNum.toString() })
      if (searchTerm) params.set('search', searchTerm)
      if (JAGUARXFilter) params.set('JAGUARXOnly', 'true')
      const res = await fetch(`/api/members?${params}`)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const result: ApiResponse = await res.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching members:', error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers(page, search, filterJAGUARX)
  }, [page, search, filterJAGUARX])

  const handleSearch = useCallback((term: string) => {
    setSearch(term)
    setPage(1)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Background Grid Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Bar Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-900 via-white/20 to-neutral-900 z-50" />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">

        {/* Header Section */}
        <header className="mb-16 text-center relative">
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-2"
            style={{ fontFamily: 'var(--font-asylum)' }}
          >
            JAGUARX ONLY
          </h1>
          <div className="flex items-center justify-center gap-4 text-neutral-500 text-sm tracking-widest uppercase">
            <span className="w-12 h-px bg-neutral-800" />
            <span>JAGUARX DATABASE</span>
            <span className="w-12 h-px bg-neutral-800" />
          </div>
        </header>

        {/* Stats / Filter Bar */}
        <div className="mb-12 border-y border-white/10 bg-black/50 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-end p-6 gap-6">


            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              <div className="w-full md:w-64">
                <SearchBar onSearch={handleSearch} />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border transition-colors flex items-center justify-center ${filterJAGUARX ? 'border-white bg-white' : 'border-neutral-600 group-hover:border-neutral-400'}`}>
                  <input
                    type="checkbox"
                    checked={filterJAGUARX}
                    onChange={(e) => {
                      setFilterJAGUARX(e.target.checked)
                      setPage(1)
                    }}
                    className="hidden"
                  />
                  {filterJAGUARX && <div className="w-3 h-3 bg-black" />}
                </div>
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-400 group-hover:text-white transition-colors">
                  JAGUARX ONLY
                </span>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            <span className="text-xs tracking-widest uppercase text-neutral-500 animate-pulse">Loading Data...</span>
          </div>
        ) : (
          <div className="space-y-20">

            {/* Founders Section */}
            {data?.founders && data.founders.length > 0 && !search && (
              <section>
                <div className="flex items-end gap-4 mb-8 border-b border-white/10 pb-2">
                  <h2 className="text-3xl font-bold uppercase tracking-tighter">Founders</h2>
                  <span className="text-xs text-neutral-500 mb-2 tracking-widest">/ 01</span>
                </div>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {data.founders.map((founder) => (
                    <MemberCard key={founder.id} member={founder} />
                  ))}
                </motion.div>
              </section>
            )}

            {/* Leaders Section */}
            {data?.leaders && data.leaders.length > 0 && !search && (
              <section>
                <div className="flex items-end gap-4 mb-8 border-b border-white/10 pb-2">
                  <h2 className="text-3xl font-bold uppercase tracking-tighter">Leaders</h2>
                  <span className="text-xs text-neutral-500 mb-2 tracking-widest">/ 02</span>
                </div>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {data.leaders.map((leader) => (
                    <MemberCard key={leader.id} member={leader} />
                  ))}
                </motion.div>
              </section>
            )}

            {/* Members Section */}
            <section>
              <div className="flex items-end gap-4 mb-8 border-b border-white/10 pb-2">
                <h2 className="text-3xl font-bold uppercase tracking-tighter">Members</h2>
                <span className="text-xs text-neutral-500 mb-2 tracking-widest">/ 03</span>
              </div>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {(() => {
                  let membersToDisplay: Member[] = []

                  if (Array.isArray(data?.members)) {
                    membersToDisplay = data.members
                  } else if (data?.members && typeof data.members === 'object' && 'flat' in data.members) {
                    membersToDisplay = (data.members as { flat: Member[] }).flat
                  }

                  return membersToDisplay.map((member: Member) => (
                    <MemberCard key={member.id} member={member} />
                  ))
                })()}
              </motion.div>
            </section>

            {/* Footer / Pagination */}
            <div className="pt-12 border-t border-white/10 flex flex-col items-center gap-8">
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages || 1}
                onPageChange={setPage}
              />

              <div className="mt-8 text-center">
                <p className="text-neutral-600 text-xs uppercase tracking-widest">
                  System Design by <a href="https://www.facebook.com/mali.temps/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">Mali Cloud</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}