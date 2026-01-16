'use client'

import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Lock, LogOut, Users, UserPlus, Search,
  Trash2, Edit, Check, X, ChevronLeft, ChevronRight,
  AlertTriangle, Upload, Facebook, Globe, Star,
  LayoutGrid, List, Filter
} from 'lucide-react'

// Thai translations - Updated for Esport Theme
const translations = {
  // Authentication
  adminLogin: 'RESTRICTED ACCESS',
  password: 'ACCESS CODE',
  login: 'INITIALIZE',
  checkingAuth: 'AUTHENTICATING...',
  invalidPassword: 'ACCESS DENIED',

  // Main UI
  adminPanel: 'COMMAND CENTER',
  logout: 'DISCONNECT',

  // Form
  addNewMember: 'NEW MEMBER',
  editMember: 'EDIT MEMBER',
  cancel: 'CANCEL',
  firstName: 'NAME',
  lastName: 'SURNAME',
  role: 'ROLE',
  memberOption: 'MEMBER',
  leaderOption: 'LEADER',
  facebookUrl: 'FACEBOOK LINK',
  leader: 'LEADER',
  profileImage: 'PROFILE IMAGE',
  selectedFile: 'FILE SELECTED',
  updateMember: 'UPDATE MEMBER',
  addMember: 'ADD MEMBER',
  uploading: 'UPLOADING...',

  // Success Messages
  loginSuccess: 'LOGIN SUCCESSFUL',
  uploadSuccess: 'UPLOAD COMPLETE',
  memberSaved: 'MEMBER SAVED',
  memberDeleted: 'MEMBER DELETED',
  membersDeleted: 'MEMBERS DELETED',

  // Error Messages
  uploadFailed: 'UPLOAD FAILED',
  saveFailed: 'SAVE FAILED',
  deleteFailed: 'DELETE FAILED',
  deleteMultipleFailed: 'BULK DELETE FAILED',

  // Members Management
  membersManagement: 'MEMBERS MANAGEMENT',
  total: 'TOTAL',
  leaders: 'LEADERS',
  showing: 'SHOWING',

  // Search & Filters
  searchByName: 'SEARCH MEMBERS...',
  leadersOnly: 'LEADERS ONLY',
  deleteSelected: 'PURGE SELECTED',
  selectAll: 'SELECT ALL',
  pageOf: 'OF',
  of: '/',

  // Actions
  edit: 'EDIT',
  delete: 'PURGE',
  previous: 'PREV',
  next: 'NEXT',

  // Messages
  noMembersMatch: 'NO MATCHING RECORDS',
  noMembersFound: 'DATABASE EMPTY',
  confirmDelete: 'CONFIRM PURGE:',
  confirmDeleteSingle: 'CONFIRM PURGE OF THIS TARGET?',
  confirmDeleteQuestion: 'TARGETS?',
  deleteSuccess: 'PURGE SUCCESSFUL'
}

interface Member {
  id: number
  firstname: string
  lastname: string
  imageurl?: string
  role?: string
  sociallinks?: Record<string, string>
  priority?: number
  memberType?: string // For form use only
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [password, setPassword] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState<Partial<Member>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // New state for improved UX
  const [searchTerm, setSearchTerm] = useState('')
  const [showLeadersOnly, setShowLeadersOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'priority' | 'no-priority'>('all')
  const [socialFilter, setSocialFilter] = useState<'all' | 'with-social' | 'no-social'>('all')
  const membersPerPage = 20

  // Check for stored authentication on mount
  useEffect(() => {
    const checkStoredAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        try {
          const res = await fetch('/api/auth', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (res.ok) {
            setIsAuthenticated(true)
            fetchMembers()
          } else {
            localStorage.removeItem('admin_token')
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('admin_token')
        }
      }
      setCheckingAuth(false)
    }
    checkStoredAuth()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('admin_token', data.token)
      setIsAuthenticated(true)
      fetchMembers()
      setPassword('')
      toast.success(translations.loginSuccess)
    } else {
      toast.error(translations.invalidPassword)
    }
    setCheckingAuth(false)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setCheckingAuth(false)
    setMembers([])
    setFilteredMembers([])
    setEditing(null)
    setForm({ memberType: 'member' })
    setImageFile(null)
    setSearchTerm('')
    setShowLeadersOnly(false)
    setCurrentPage(1)
    setSelectedMembers([])
    setSelectAll(false)
    setPriorityFilter('all')
    setSocialFilter('all')
  }

  const fetchMembers = async () => {
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/members?admin=true', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
    const data = await res.json()
    setMembers(data.members)
  }

  // Filter and search logic
  useEffect(() => {
    let filtered = members

    if (showLeadersOnly) {
      filtered = filtered.filter(member => member.role !== 'Member')
    }

    if (priorityFilter === 'priority') {
      filtered = filtered.filter(member => member.priority && member.priority > 0)
    } else if (priorityFilter === 'no-priority') {
      filtered = filtered.filter(member => !member.priority || member.priority === 0)
    }

    if (socialFilter === 'with-social') {
      filtered = filtered.filter(member => member.sociallinks && Object.values(member.sociallinks).some(link => link && link.trim() !== ''))
    } else if (socialFilter === 'no-social') {
      filtered = filtered.filter(member => !member.sociallinks || !Object.values(member.sociallinks).some(link => link && link.trim() !== ''))
    }

    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.firstname} ${member.lastname || 'JAGUARX'}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMembers(filtered)
    setCurrentPage(1)
    setSelectedMembers([])
    setSelectAll(false)
  }, [members, searchTerm, showLeadersOnly, priorityFilter, socialFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage)
  const startIndex = (currentPage - 1) * membersPerPage
  const endIndex = startIndex + membersPerPage
  const currentMembers = filteredMembers.slice(startIndex, endIndex)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setForm({ ...form, imageurl: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.firstname?.trim()) {
      toast.error('กรุณากรอกชื่อจริง')
      return
    }

    setUploading(true)

    let imageUrl = form.imageurl

    if (imageFile) {
      const formData = new FormData()
      formData.append('file', imageFile)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
        toast.success(translations.uploadSuccess)
      } else {
        toast.error(translations.uploadFailed)
        setUploading(false)
        return
      }
    }

    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/members/${editing.id}` : '/api/members'

    const token = localStorage.getItem('admin_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const formData = {
      ...form,
      imageUrl,
      role: form.memberType === 'leader' ? 'Leader' : 'Member'
    }
    delete formData.memberType

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      fetchMembers()
      setForm({ memberType: 'member' })
      setImageFile(null)
      setEditing(null)
      toast.success(editing ? translations.memberSaved : translations.memberSaved)
    } else {
      const errorData = await res.json()
      if (res.status === 409 && errorData.similarMembers?.length > 0) {
        const similarNames = errorData.similarMembers.map((m: { firstname: string; lastname: string }) =>
          `${m.firstname} ${m.lastname}`
        ).join(', ')
        toast.error(`${errorData.error}\nSimilar: ${similarNames}`)
      } else {
        toast.error(errorData.error || translations.saveFailed)
      }
    }
    setUploading(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm(translations.confirmDeleteSingle)) {
      const token = localStorage.getItem('admin_token')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers
      })
      if (res.ok) {
        toast.success(translations.memberDeleted)
        fetchMembers()
      } else {
        toast.error(translations.deleteFailed)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedMembers.length === 0) return
    if (confirm(`${translations.confirmDelete} ${selectedMembers.length} ${translations.confirmDeleteQuestion}`)) {
      const token = localStorage.getItem('admin_token')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      try {
        await Promise.all(
          selectedMembers.map(id => fetch(`/api/members/${id}`, {
            method: 'DELETE',
            headers
          }))
        )
        toast.success(`${translations.membersDeleted} (${selectedMembers.length})`)
        fetchMembers()
        setSelectedMembers([])
        setSelectAll(false)
      } catch {
        toast.error(translations.deleteMultipleFailed)
      }
    }
  }

  const handleSelectMember = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id)
        ? prev.filter(memberId => memberId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(currentMembers.map(member => member.id))
    }
    setSelectAll(!selectAll)
  }

  // Loading Screen
  if (checkingAuth) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden'>
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20"></div>
        <div className='relative z-10 flex flex-col items-center gap-4'>
          <div className='w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin'></div>
          <span className='text-red-500 font-bold tracking-[0.2em] animate-pulse'>{translations.checkingAuth}</span>
        </div>
      </div>
    )
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-4'>
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='relative z-10 w-full max-w-md'
        >
          <div className="bg-neutral-900/90 border border-white/10 p-8 md:p-12 relative overflow-hidden group"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>

            <div className="text-center mb-8">
              <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h1 className='text-3xl text-white font-bold tracking-widest mb-2' style={{ fontFamily: 'var(--font-asylum)' }}>
                {translations.adminLogin}
              </h1>
              <p className="text-neutral-500 text-xs tracking-[0.2em]">SECURE CONNECTION REQUIRED</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type='password'
                  placeholder={translations.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full bg-black/50 border border-white/10 text-white py-4 pl-12 pr-4 focus:border-red-600 focus:outline-none transition-colors placeholder:text-neutral-700 font-mono tracking-widest'
                  onKeyPress={(e) => e.key === 'Enter' && checkAuth()}
                />
              </div>

              <button
                onClick={checkAuth}
                className='w-full bg-white text-black font-bold py-4 hover:bg-red-600 hover:text-white transition-all duration-300 tracking-widest relative overflow-hidden group'
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%)' }}
              >
                <span className="relative z-10">{translations.login}</span>
                <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out -z-0"></div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className='min-h-screen bg-black text-white font-chakra relative'>
      <div className="fixed inset-0 bg-[url('/grid.png')] opacity-10 pointer-events-none"></div>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#171717',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'var(--font-chakra-petch)'
        }
      }} />

      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold tracking-widest" style={{ fontFamily: 'var(--font-asylum)' }}>
                  {translations.adminPanel}
                </h1>
                <p className="text-[10px] text-neutral-500 tracking-[0.2em]">SYSTEM V.2.0</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-600/20 text-neutral-400 hover:text-red-500 border border-white/5 hover:border-red-600/50 transition-all duration-300 rounded-sm group"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs tracking-widest">{translations.logout}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: translations.total, value: members.length, icon: Users, color: 'text-white' },
            { label: translations.leaders, value: members.filter(m => m.role !== 'Member').length, icon: Star, color: 'text-yellow-500' },
            { label: 'REGULAR', value: members.filter(m => m.role === 'Member').length, icon: UserPlus, color: 'text-neutral-400' },
            { label: 'CONNECTED', value: members.filter(m => m.sociallinks && Object.values(m.sociallinks).some(link => link && link.trim() !== '')).length, icon: Globe, color: 'text-blue-500' }
          ].map((stat, index) => (
            <div key={index} className="bg-neutral-900/50 border border-white/5 p-6 relative group hover:border-white/20 transition-colors">
              <div className="absolute top-0 right-0 w-2 h-2 bg-white/10 group-hover:bg-red-600 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 bg-white/5 rounded-sm ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-bold font-asylum text-white/20 group-hover:text-white/40 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-xs text-neutral-500 tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/80 border border-white/10 p-6 sticky top-24"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 90% 100%, 0 100%)' }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h2 className="text-lg font-bold tracking-widest flex items-center gap-2">
                  <Edit className="w-4 h-4 text-red-600" />
                  {editing ? translations.editMember : translations.addNewMember}
                </h2>
                {editing && (
                  <button onClick={() => {
                    setEditing(null)
                    setForm({ memberType: 'member' })
                    setImageFile(null)
                  }} className="text-xs text-red-500 hover:text-red-400 tracking-widest">
                    {translations.cancel}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="relative group cursor-pointer">
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
                  />
                  <div className={`w-full aspect-video bg-black/50 border-2 border-dashed ${imageFile ? 'border-green-500/50' : 'border-white/10'} flex flex-col items-center justify-center group-hover:border-white/30 transition-colors`}>
                    {imageFile ? (
                      <div className="text-center">
                        <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <span className="text-xs text-green-500 tracking-widest">{imageFile.name}</span>
                      </div>
                    ) : (
                      <div className="text-center text-neutral-500">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-xs tracking-widest">UPLOAD IMAGE</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-neutral-500 tracking-widest mb-1 block">{translations.firstName}</label>
                    <input
                      type="text"
                      value={form.firstname || ''}
                      onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-red-600 focus:outline-none transition-colors"
                      placeholder="ENTER NAME"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 tracking-widest mb-1 block">{translations.lastName}</label>
                    <input
                      type="text"
                      value={form.lastname || ''}
                      onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-red-600 focus:outline-none transition-colors"
                      placeholder="ENTER SURNAME"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-neutral-500 tracking-widest mb-1 block">{translations.role}</label>
                    <select
                      value={form.memberType || 'member'}
                      onChange={(e) => setForm({ ...form, memberType: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-red-600 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="member">{translations.memberOption}</option>
                      <option value="leader">{translations.leaderOption}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 tracking-widest mb-1 block">PRIORITY</label>
                    <input
                      type="number"
                      value={form.priority || ''}
                      onChange={(e) => setForm({ ...form, priority: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-red-600 focus:outline-none transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-500 tracking-widest mb-1 block">{translations.facebookUrl}</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="url"
                      value={form.sociallinks?.facebook || ''}
                      onChange={(e) => setForm({ ...form, sociallinks: { ...form.sociallinks, facebook: e.target.value } })}
                      className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-sm focus:border-red-600 focus:outline-none transition-colors"
                      placeholder="HTTPS://"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-white text-black font-bold py-3 hover:bg-red-600 hover:text-white transition-colors tracking-widest disabled:opacity-50"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%)' }}
                >
                  {uploading ? translations.uploading : (editing ? translations.updateMember : translations.addMember)}
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Filters */}
            <div className="bg-neutral-900/50 border border-white/10 p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder={translations.searchByName}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 py-2 pl-10 pr-4 text-sm focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLeadersOnly(!showLeadersOnly)}
                  className={`px-3 py-2 text-xs tracking-widest border ${showLeadersOnly ? 'bg-red-600/20 border-red-600 text-red-500' : 'border-white/10 text-neutral-400 hover:border-white/30'}`}
                >
                  LEADERS
                </button>
                {selectedMembers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-2 text-xs tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    DELETE ({selectedMembers.length})
                  </button>
                )}
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] text-neutral-500 tracking-widest uppercase border-b border-white/10">
              <div className="col-span-1 flex items-center">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="accent-red-600" />
              </div>
              <div className="col-span-5">Member</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* List Items */}
            <div className="space-y-2">
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`grid grid-cols-12 gap-4 items-center p-4 bg-neutral-900/30 border ${selectedMembers.includes(member.id) ? 'border-red-600/50 bg-red-600/5' : 'border-white/5 hover:border-white/20'} transition-all duration-200 group`}
                  >
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className="accent-red-600"
                      />
                    </div>
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-10 h-10 bg-black border border-white/10 overflow-hidden">
                        {member.imageurl ? (
                          <img src={member.imageurl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700">
                            <Users className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.firstname} {member.lastname}</p>
                        {member.priority && member.priority > 0 && (
                          <span className="text-[10px] text-yellow-500 tracking-widest">PRIORITY {member.priority}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className={`text-xs tracking-widest px-2 py-1 border ${member.role !== 'Member' ? 'border-red-600 text-red-500' : 'border-neutral-700 text-neutral-500'}`}>
                        {member.role === 'Member' ? 'MEMBER' : 'LEADER'}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditing(member)
                          setForm({
                            firstname: member.firstname,
                            lastname: member.lastname,
                            imageurl: member.imageurl,
                            memberType: member.role === 'Leader' ? 'leader' : 'member',
                            sociallinks: member.sociallinks,
                            priority: member.priority
                          })
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="p-2 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 hover:bg-red-600/20 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-500 tracking-widest">
                  {translations.noMembersMatch}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm tracking-widest text-neutral-500">
                  PAGE {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-white/10 disabled:opacity-30 hover:bg-white/5 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
