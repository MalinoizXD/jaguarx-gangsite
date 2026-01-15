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
    <div className="min-h-screen bg-black p-0 m-0">
      <div className="w-full">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white text-center py-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Gang Members
        </motion.h1>

        <div className="px-8 mb-8">
          <SearchBar onSearch={handleSearch} />

          {/* JAGUARX Filter */}
          <div className="flex justify-center mt-4">
            <label className="flex items-center space-x-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={filterJAGUARX}
                onChange={(e) => {
                  setFilterJAGUARX(e.target.checked)
                  setPage(1) // Reset to first page when filter changes
                }}
                className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
              />
              <span className="text-sm">เฉพาะนามสกุล JAGUARX</span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white py-20">Loading...</div>
        ) : (
          <>
            {/* Founders Section */}
            {data?.founders && data.founders.length > 0 && !search && (
              <div className="px-8 mb-8">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-white mb-6 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Founders
                </motion.h2>
                <motion.div
                  className="flex flex-wrap justify-center gap-0 mb-12"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {data.founders.map((founder) => (
                    <div key={founder.id} className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
                      <MemberCard member={founder} />
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Leaders Section */}
            {data?.leaders && data.leaders.length > 0 && !search && (
              <div className="px-8 mb-8">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-white mb-6 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Leaders
                </motion.h2>
                <motion.div
                  className="flex flex-wrap justify-center gap-0 mb-12"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {data.leaders.map((leader) => (
                    <div key={leader.id} className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
                      <MemberCard member={leader} />
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Members Section */}
            <div className="px-8 mb-8">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-white mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Members
              </motion.h2>
            </div>

            {/* Members Section */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-0"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
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

            <div className="px-8 py-8">
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages || 1}
                onPageChange={setPage}
              />
            </div>

            {/* Join Gang CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="mt-10 text-center"
            >
              <p className="text-gray-300 text-base mb-4 font-medium">
                สนใจเข้าตระกลูทักแชทเพจมาได้เลย !!
              </p>
              <motion.a
                href="https://www.facebook.com/profile.php?id=61566647090564"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(66, 103, 178, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#1877F2] to-[#4267B2] shadow-lg hover:shadow-[#1877F2]/40 transition-all duration-300 border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                ติดต่อเพจ Facebook
              </motion.a>
            </motion.div>

            {/* Credit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400 text-sm">
                Created this website with love by{' '}
                <a
                  href="https://www.facebook.com/mali.temps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-400 transition-colors duration-200 font-medium"
                >
                  Mali Cloud ❤️
                </a>
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}