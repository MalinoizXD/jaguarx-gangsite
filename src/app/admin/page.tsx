'use client'

import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

// Thai translations - using natural Thai phrases that Thai people understand
const translations = {
  // Authentication
  adminLogin: 'เข้าสู่ระบบแอดมิน',
  password: 'รหัสผ่าน',
  login: 'เข้าสู่ระบบ',
  checkingAuth: 'กำลังตรวจสอบการเข้าสู่ระบบ...',
  invalidPassword: 'รหัสผ่านไม่ถูกต้อง',

  // Main UI
  adminPanel: 'แผงควบคุมแอดมิน',
  logout: 'ออกจากระบบ',

  // Form
  addNewMember: 'เพิ่มสมาชิกใหม่',
  editMember: 'แก้ไขสมาชิก',
  cancel: 'ยกเลิก',
  firstName: 'ชื่อจริง',
  lastName: 'นามสกุล',
  role: 'ตำแหน่ง/บทบาท',
  memberOption: 'สมาชิก',
  leaderOption: 'หัวหน้า',
  facebookUrl: 'ลิงก์เฟซบุ๊ก',
  // websiteUrl: 'ลิงก์เว็บไซต์',
  leader: 'หัวหน้า',
  profileImage: 'รูปโปรไฟล์',
  selectedFile: 'เลือกไฟล์แล้ว',
  updateMember: 'อัปเดตสมาชิก',
  addMember: 'เพิ่มสมาชิก',
  uploading: 'กำลังอัปโหลด...',

  // Success Messages
  loginSuccess: 'เข้าสู่ระบบสำเร็จ',
  uploadSuccess: 'อัปโหลดรูปภาพสำเร็จ',
  memberSaved: 'บันทึกสมาชิกสำเร็จ',
  memberDeleted: 'ลบสมาชิกสำเร็จ',
  membersDeleted: 'ลบสมาชิกหลายคนสำเร็จ',

  // Error Messages
  uploadFailed: 'อัปโหลดรูปภาพล้มเหลว',
  saveFailed: 'บันทึกสมาชิกล้มเหลว',
  deleteFailed: 'ลบสมาชิกล้มเหลว',
  deleteMultipleFailed: 'ลบสมาชิกหลายคนล้มเหลว',

  // Members Management
  membersManagement: 'การจัดการสมาชิก',
  total: 'ทั้งหมด',
  leaders: 'หัวหน้า',
  showing: 'แสดง',

  // Search & Filters
  searchByName: 'ค้นหาตามชื่อ...',
  leadersOnly: 'เฉพาะหัวหน้า',
  deleteSelected: 'ลบที่เลือก',
  selectAll: 'เลือกทั้งหมด',
  pageOf: 'หน้า',
  of: 'จาก',

  // Actions
  edit: 'แก้ไข',
  delete: 'ลบ',
  previous: 'ก่อนหน้า',
  next: 'ถัดไป',

  // Messages
  noMembersMatch: 'ไม่มีสมาชิกที่ตรงกับตัวกรองของคุณ',
  noMembersFound: 'ไม่พบสมาชิก',
  confirmDelete: 'ลบสมาชิกจำนวน',
  confirmDeleteSingle: 'ลบสมาชิกคนนี้หรือไม่?',
  confirmDeleteQuestion: 'คนหรือไม่?',
  deleteSuccess: 'ลบสมาชิกสำเร็จ'
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
            // Token is invalid, remove it
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
      // Store token in localStorage
      localStorage.setItem('admin_token', data.token)
      setIsAuthenticated(true)
      fetchMembers()
      setPassword('') // Clear password field
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

    // Filter by leaders if selected
    if (showLeadersOnly) {
      filtered = filtered.filter(member => member.role !== 'Member')
    }

    // Filter by priority
    if (priorityFilter === 'priority') {
      filtered = filtered.filter(member => member.priority && member.priority > 0)
    } else if (priorityFilter === 'no-priority') {
      filtered = filtered.filter(member => !member.priority || member.priority === 0)
    }

    // Filter by social links
    if (socialFilter === 'with-social') {
      filtered = filtered.filter(member => member.sociallinks && Object.values(member.sociallinks).some(link => link && link.trim() !== ''))
    } else if (socialFilter === 'no-social') {
      filtered = filtered.filter(member => !member.sociallinks || !Object.values(member.sociallinks).some(link => link && link.trim() !== ''))
    }

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.firstname} ${member.lastname || 'JAGUARX'}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMembers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
    setSelectedMembers([]) // Clear selections when filters change
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

    // Validate required fields
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

    // Convert memberType to role for API
    const formData = {
      ...form,
      imageUrl,
      role: form.memberType === 'leader' ? 'Leader' : 'Member'
    }
    delete formData.memberType // Remove memberType from the data sent to API

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
      toast.success(editing ? 'อัปเดตสมาชิกสำเร็จ' : 'เพิ่มสมาชิกสำเร็จ')
    } else {
      const errorData = await res.json()

      if (res.status === 409 && errorData.similarMembers?.length > 0) {
        // Show similar members in the error
        const similarNames = errorData.similarMembers.map((m: { firstname: string; lastname: string }) =>
          `${m.firstname} ${m.lastname}`
        ).join(', ')
        toast.error(`${errorData.error}\nสมาชิกที่มีชื่อคล้ายกัน: ${similarNames}`)
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
        toast.success(`${translations.membersDeleted} (${selectedMembers.length} คน)`)
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

  // Show loading screen while checking authentication
  if (checkingAuth) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div
          className='bg-gray-800 p-8 rounded-lg flex items-center space-x-4'
        >
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
          <span className='text-white'>{translations.checkingAuth}</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div
          className='bg-gray-800 p-8 rounded-lg'
        >
          <h1 className='text-2xl text-white mb-4'>{translations.adminLogin}</h1>
          <input
            type='password'
            placeholder={translations.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-2 mb-4 bg-gray-700 text-white rounded'
            onKeyPress={(e) => e.key === 'Enter' && checkAuth()}
          />
          <button
            onClick={checkAuth}
            className='w-full bg-red-600 text-white py-2 rounded hover:bg-red-700'
          >
            {translations.login}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-900 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl text-white'>{translations.adminPanel}</h1>
          <button
            onClick={logout}
            className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'
          >
            {translations.logout}
          </button>
        </div>

        {/* Dashboard Overview */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8'>
          <div
            className='bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-blue-100 text-sm font-medium'>Total Members</p>
                <p className='text-white text-3xl font-bold'>{members.length}</p>
              </div>
              <div className='bg-blue-500/20 p-3 rounded-full'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
                </svg>
              </div>
            </div>
          </div>

          <div
            className='bg-gradient-to-br from-yellow-600 to-yellow-700 p-6 rounded-xl shadow-lg'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-yellow-100 text-sm font-medium'>Leaders</p>
                <p className='text-white text-3xl font-bold'>{members.filter(m => m.role !== 'Member').length}</p>
              </div>
              <div className='bg-yellow-500/20 p-3 rounded-full'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' />
                </svg>
              </div>
            </div>
          </div>

          <div
            className='bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-green-100 text-sm font-medium'>Regular Members</p>
                <p className='text-white text-3xl font-bold'>{members.filter(m => m.role === 'Member').length}</p>
              </div>
              <div className='bg-green-500/20 p-3 rounded-full'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
              </div>
            </div>
          </div>

          <div
            className='bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-purple-100 text-sm font-medium'>With Social Links</p>
                <p className='text-white text-3xl font-bold'>{members.filter(m => m.sociallinks && Object.values(m.sociallinks).some(link => link && link.trim() !== '')).length}</p>
              </div>
              <div className='bg-purple-500/20 p-3 rounded-full'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-gradient-to-br from-gray-800 to-gray-850 p-8 rounded-2xl shadow-2xl border border-gray-700 mb-8'
        >
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-2xl text-white font-bold'>
                {editing ? `${translations.editMember} ${editing.firstname} ${editing.lastname || 'JAGUARX'}` : translations.addNewMember}
              </h2>
              <p className='text-gray-400 text-sm mt-1'>
                {editing ? 'Update member information and settings' : 'Add a new member to the gang'}
              </p>
            </div>
            {editing && (
              <button
                type='button'
                onClick={() => {
                  setEditing(null)
                  setForm({ memberType: 'member' })
                  setImageFile(null)
                }}
                className='text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700'
                title='Cancel editing'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>

          {/* Basic Information Section */}
          <div className='mb-8'>
            <h3 className='text-lg text-white font-semibold mb-4 flex items-center gap-2'>
              <svg className='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  {translations.firstName} *
                </label>
                <input
                  type='text'
                  placeholder={translations.firstName}
                  value={form.firstname || ''}
                  onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                  className='w-full p-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  {translations.lastName}
                </label>
                <input
                  type='text'
                  placeholder={translations.lastName}
                  value={form.lastname || ''}
                  onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                  className='w-full p-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
              </div>
            </div>
          </div>

          {/* Role & Priority Section */}
          <div className='mb-8'>
            <h3 className='text-lg text-white font-semibold mb-4 flex items-center gap-2'>
              <svg className='w-5 h-5 text-yellow-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' />
              </svg>
              Role & Priority
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  {translations.role}
                </label>
                <select
                  value={form.memberType || 'member'}
                  onChange={(e) => setForm({ ...form, memberType: e.target.value })}
                  className='w-full p-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                >
                  <option value="member">{translations.memberOption}</option>
                  <option value="leader">{translations.leaderOption}</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  Priority (1 = highest)
                </label>
                <input
                  type='number'
                  placeholder='Priority (leave empty for normal)'
                  value={form.priority || ''}
                  onChange={(e) => setForm({ ...form, priority: e.target.value ? parseInt(e.target.value) : undefined })}
                  className='w-full p-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                  min="1"
                />
                <p className='text-xs text-gray-500 mt-1'>Higher priority members appear first in listings</p>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className='mb-8'>
            <h3 className='text-lg text-white font-semibold mb-4 flex items-center gap-2'>
              <svg className='w-5 h-5 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
              </svg>
              Social Links
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  {translations.facebookUrl}
                </label>
                <input
                  type='url'
                  placeholder='https://facebook.com/username'
                  value={form.sociallinks?.facebook || ''}
                  onChange={(e) => setForm({
                    ...form,
                    sociallinks: {
                      ...form.sociallinks,
                      facebook: e.target.value
                    }
                  })}
                  className='w-full p-3 bg-gray-700/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                />
              </div>
            </div>
          </div>

          {/* Profile Image Section */}
          <div className='mb-8'>
            <h3 className='text-lg text-white font-semibold mb-4 flex items-center gap-2'>
              <svg className='w-5 h-5 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              Profile Image
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <label className='flex-1'>
                  <div className='relative'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                    <div className='w-full p-4 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-500 transition-all duration-200 text-center'>
                      <svg className='w-8 h-8 text-gray-400 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                      </svg>
                      <p className='text-gray-300 text-sm'>Click to upload or drag and drop</p>
                      <p className='text-gray-500 text-xs mt-1'>PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </label>
                {imageFile && (
                  <div className='flex items-center gap-2 text-green-400'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span className='text-sm'>{imageFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            {editing && (
              <button
                type='button'
                onClick={() => {
                  setEditing(null)
                  setForm({ memberType: 'member' })
                  setImageFile(null)
                }}
                className='px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium'
              >
                {translations.cancel}
              </button>
            )}
            <button
              type='submit'
              disabled={uploading}
              className='px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              {uploading ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  {translations.uploading}
                </div>
              ) : (
                editing ? translations.updateMember : translations.addMember
              )}
            </button>
          </div>
        </form>

        <div className='bg-gray-800 p-6 rounded-lg'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl text-white'>{translations.membersManagement}</h2>
            <div className='text-gray-400 text-sm'>
              {translations.total}: {members.length} | {translations.leaders}: {members.filter(m => m.role !== 'Member').length} | {translations.showing}: {filteredMembers.length}
            </div>
          </div>

          {/* Enhanced Search and Filter Controls */}
          <div
            className='bg-gradient-to-r from-gray-750 to-gray-700 p-6 rounded-2xl border border-gray-600 mb-6 shadow-lg'
          >
            <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
              <div className='flex-1 max-w-md w-full lg:w-auto'>
                <div className='relative'>
                  <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                  <input
                    type='text'
                    placeholder={translations.searchByName}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400'
                  />
                </div>
              </div>

              <div className='flex flex-wrap gap-3 items-center w-full lg:w-auto'>
                {/* Role Filter */}
                <div className='flex items-center gap-2 min-w-0'>
                  <label className='text-sm text-gray-300 font-medium hidden sm:inline'>Role:</label>
                  <select
                    value={showLeadersOnly ? 'leaders' : 'all'}
                    onChange={(e) => setShowLeadersOnly(e.target.value === 'leaders')}
                    className='px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm'
                  >
                    <option value="all">All Members</option>
                    <option value="leaders">Leaders Only</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className='flex items-center gap-2 min-w-0'>
                  <label className='text-sm text-gray-300 font-medium hidden sm:inline'>Priority:</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'priority' | 'no-priority')}
                    className='px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm'
                  >
                    <option value="all">All</option>
                    <option value="priority">Priority Only</option>
                    <option value="no-priority">No Priority</option>
                  </select>
                </div>

                {/* Social Links Filter */}
                <div className='flex items-center gap-2 min-w-0'>
                  <label className='text-sm text-gray-300 font-medium hidden sm:inline'>Social:</label>
                  <select
                    value={socialFilter}
                    onChange={(e) => setSocialFilter(e.target.value as 'all' | 'with-social' | 'no-social')}
                    className='px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm'
                  >
                    <option value="all">All</option>
                    <option value="with-social">With Links</option>
                    <option value="no-social">No Links</option>
                  </select>
                </div>

                {selectedMembers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className='px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                    {translations.deleteSelected} ({selectedMembers.length})
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || showLeadersOnly || priorityFilter !== 'all' || socialFilter !== 'all') && (
              <div
                className='flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-600'
              >
                <span className='text-sm text-gray-400'>Active filters:</span>
                {searchTerm && (
                  <span className='inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs'>
                    Search: &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className='hover:text-blue-200'>×</button>
                  </span>
                )}
                {showLeadersOnly && (
                  <span className='inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs'>
                    Leaders Only
                    <button onClick={() => setShowLeadersOnly(false)} className='hover:text-yellow-200'>×</button>
                  </span>
                )}
                {priorityFilter !== 'all' && (
                  <span className='inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs'>
                    {priorityFilter === 'priority' ? 'Priority Only' : 'No Priority'}
                    <button onClick={() => setPriorityFilter('all')} className='hover:text-red-200'>×</button>
                  </span>
                )}
                {socialFilter !== 'all' && (
                  <span className='inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs'>
                    {socialFilter === 'with-social' ? 'With Social Links' : 'No Social Links'}
                    <button onClick={() => setSocialFilter('all')} className='hover:text-purple-200'>×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Members List */}
          <div className='space-y-2'>
            {/* Select All Header */}
            {currentMembers.length > 0 && (
              <div
                className='flex items-center justify-between bg-gradient-to-r from-gray-750 to-gray-700 p-4 rounded-xl border border-gray-600 shadow-lg'
              >
                <div className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className='w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500'
                  />
                  <span className='text-white font-medium text-sm'>{translations.selectAll} ({currentMembers.length})</span>
                </div>
                <div className='text-gray-400 text-sm'>
                  {translations.pageOf} {currentPage} {translations.of} {totalPages}
                </div>
              </div>
            )}

            {currentMembers.map((member) => (
              <div
                key={member.id}
                className='bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl p-4 hover:bg-gray-650 hover:border-gray-500 transition-all duration-200 group'
              >
                <div className='flex flex-col sm:flex-row items-start justify-between'>
                  <div className='flex items-start space-x-4 flex-1 w-full sm:w-auto'>
                    <div className='relative flex-shrink-0'>
                      <input
                        type='checkbox'
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                        className='absolute -top-2 -left-2 w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 z-10'
                      />
                      {member.imageurl ? (
                        <img
                          src={member.imageurl}
                          alt={`${member.firstname} ${member.lastname || 'JAGUARX'}`}
                          className='w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-2 ring-gray-600 group-hover:ring-blue-500 transition-all duration-200'
                        />
                      ) : (
                        <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center ring-2 ring-gray-600 group-hover:ring-blue-500 transition-all duration-200'>
                          <svg className='w-8 h-8 sm:w-10 sm:h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-2'>
                        <h3 className='text-white font-semibold text-lg truncate'>
                          {member.firstname} {member.lastname || 'JAGUARX'}
                        </h3>
                        {member.priority && (
                          <span className='bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30 self-start sm:self-auto'>
                            P{member.priority}
                          </span>
                        )}
                      </div>

                      <div className='flex flex-wrap items-center gap-2 mb-3'>
                        {member.role === 'Founder' && (
                          <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg'>
                            👑 Founder
                          </span>
                        )}
                        {member.role === 'Leader' && (
                          <span className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg'>
                            ⭐ Leader
                          </span>
                        )}
                        {member.role === 'Member' && (
                          <span className='bg-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full font-medium'>
                            👤 Member
                          </span>
                        )}
                        {member.role && member.role !== 'Founder' && member.role !== 'Leader' && member.role !== 'Member' && (
                          <span className='bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium'>
                            {member.role}
                          </span>
                        )}
                      </div>

                      {member.sociallinks && Object.keys(member.sociallinks).length > 0 && (
                        <div className='flex items-center gap-2'>
                          {member.sociallinks.facebook && (
                            <a
                              href={member.sociallinks.facebook}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-400 hover:text-blue-300 transition-colors'
                              title='Facebook'
                            >
                              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0'>
                    <button
                      onClick={() => {
                        setEditing(member)
                        setForm({ ...member, memberType: member.role === 'Leader' ? 'leader' : 'member' })
                        setImageFile(null)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex-1 sm:flex-none'
                      title='Edit member'
                    >
                      <svg className='w-4 h-4 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg flex-1 sm:flex-none'
                      title='Delete member'
                    >
                      <svg className='w-4 h-4 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-center items-center space-x-2 mt-6'>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className='bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {translations.previous}
              </button>

              <div className='flex space-x-1'>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  if (pageNum > totalPages) return null
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className='bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {translations.next}
              </button>
            </div>
          )}

          {filteredMembers.length === 0 && (
            <div className='text-center text-gray-400 py-8'>
              {searchTerm || showLeadersOnly ? translations.noMembersMatch : translations.noMembersFound}
            </div>
          )}
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  )
}
