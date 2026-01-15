import { NextRequest, NextResponse } from 'next/server'
import { checkAdminPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  if (checkAdminPassword(password)) {
    // Create a simple token (in production, use proper JWT)
    const token = Buffer.from(`admin:${Date.now()}:${Math.random()}`).toString('base64')
    return NextResponse.json({
      success: true,
      token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const token = authHeader.substring(7) // Remove 'Bearer ' prefix

  try {
    // Decode and validate token (simple validation)
    const decoded = Buffer.from(token, 'base64').toString()
    const [role, timestamp, random] = decoded.split(':')

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if token is expired (24 hours)
    const tokenTime = parseInt(timestamp)
    if (Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }

    return NextResponse.json({ success: true, valid: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}