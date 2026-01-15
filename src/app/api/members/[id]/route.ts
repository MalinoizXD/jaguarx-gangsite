import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { data: member, error } = await supabase
    .from('members')
    .update({
      firstname: body.firstname,
      lastname: body.lastname,
      imageurl: body.imageUrl,
      role: body.role,
      // Accept social links from either camelCase (socialLinks) or lowercase (sociallinks)
      sociallinks: body.socialLinks ?? body.sociallinks ?? null,
      priority: body.priority,
    })
    .eq('id', parseInt(id))
    .select()
    .single()
  if (error) throw error
  return NextResponse.json(member)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', parseInt(id))
  if (error) throw error
  return NextResponse.json({ success: true })
}