import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = (searchParams.get('search') || '').trim().substring(0, 100) // Limit search length
    const isAdmin = searchParams.get('admin') === 'true'
    const JAGUARXOnly = searchParams.get('JAGUARXOnly') === 'true'
    const limit = isAdmin ? 10000 : 60 // Large limit for admin to get all members

    let founders: any[] = []
    let leaders: any[] = []
    let members: any[] = []
    let total: number = 0

    if (isAdmin) {
      // For admin: return all members without pagination
      const { data: allMembers, error } = await supabase
        .from('members')
        .select('*')
        .order('lastname')
      if (error) throw error
      const memberList = allMembers || []
      total = memberList.length

      // Separate by role
      founders = memberList.filter((m: any) => m.role === 'Founder')
      leaders = memberList.filter((m: any) => m.role === 'Leader')
      members = memberList // Return ALL members for admin, not just regular members
    } else {
      // For public: paginated regular members + leaders
      let query = supabase.from('members').select('*')

      if (!search) {
        query = query.eq('role', 'Member')
      }
      if (JAGUARXOnly) {
        query = query.eq('lastname', 'JAGUARX')
      }
      if (search) {
        query = query.or(`firstname.ilike.%${search}%,lastname.ilike.%${search}%`)
      }

      // Get all regular members first, then sort and paginate
      const { data: allRegularMembers, error } = await query.order('lastname')
      if (error) throw error

      // Sort members: priority takes precedence over everything else
      const sortedMembers = (allRegularMembers || []).sort((a: any, b: any) => {
        // Priority sorting (lower number = higher priority)
        if (a.priority !== null && b.priority === null) return -1
        if (a.priority === null && b.priority !== null) return 1
        if (a.priority !== null && b.priority !== null && a.priority !== b.priority) {
          return a.priority - b.priority
        }

        // If both have same priority (or both null), sort alphabetically by firstName
        return a.firstname.localeCompare(b.firstname)
      })

      // Apply pagination after sorting
      const paginatedMembers = sortedMembers.slice((page - 1) * limit, page * limit)
      const totalCount = sortedMembers.length

      // Only fetch founders and leaders separately when not searching
      if (!search) {
        const { data: allNonMembers, error: leadersError } = await supabase
          .from('members')
          .select('*')
          .neq('role', 'Member')
          .order('lastname')
        if (leadersError) throw leadersError

        const nonMembers = allNonMembers || []
        founders = nonMembers.filter((m: any) => m.role === 'Founder')
        leaders = nonMembers.filter((m: any) => m.role === 'Leader')
      }

      // Group members by first letter of firstName
      const groupedMembers: Record<string, any[]> = {}

      paginatedMembers.forEach((member: any) => {
        const firstLetter = member.firstname.charAt(0).toUpperCase()
        if (!groupedMembers[firstLetter]) {
          groupedMembers[firstLetter] = []
        }
        groupedMembers[firstLetter].push(member)
      })

      // Sort the letters
      const sortedLetters = Object.keys(groupedMembers).sort()

      members = {
        grouped: groupedMembers,
        letters: sortedLetters,
        flat: paginatedMembers, // Keep flat array for backward compatibility
        total: totalCount
      } as any
      total = totalCount
    }

    return NextResponse.json({
      members,
      founders,
      leaders,
      total,
      page,
      totalPages: isAdmin ? 1 : Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get the next available ID to avoid sequence conflicts
    const { data: maxIdResult, error: maxIdError } = await supabase
      .from('members')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)

    if (maxIdError) {
      console.error('Error getting max ID:', maxIdError)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการสร้าง ID ใหม่' },
        { status: 500 }
      )
    }

    const nextId = (maxIdResult?.[0]?.id || 0) + 1

    // Insert member - allow duplicate names
    const { data: member, error } = await supabase
      .from('members')
      .insert({
        id: nextId, // Explicitly set ID to avoid sequence conflicts
        firstname: body.firstname,
        lastname: body.lastname,
        imageurl: body.imageUrl,
        role: body.role || 'Member',
        // Accept social links from either camelCase (socialLinks) or lowercase (sociallinks)
        sociallinks: body.socialLinks ?? body.sociallinks ?? null,
        priority: body.priority,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating member:', error)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก' },
        { status: 500 }
      )
    }

    return NextResponse.json(member)
  } catch (error: any) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    )
  }
}