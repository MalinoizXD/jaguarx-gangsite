'use client'

import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface Member {
  id: number
  firstname: string
  lastname: string
  imageurl?: string
  role?: string
  sociallinks?: Record<string, string>
}

interface MemberCardProps {
  member: Member
}

export default function MemberCard({ member }: MemberCardProps) {
  const isSpecialRole = member.role && member.role !== 'Member'

  // Default fallback image
  const defaultImage = '/uploads/1759845994308-d20obwggsn.jpg'
  const imageUrl = member.imageurl || defaultImage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group cursor-pointer"
    >
      {/* Outer wrapper adds gradient edge + subtle glow for founders */}
      <div
        className={
          `relative w-full aspect-square overflow-hidden ` +
          (isSpecialRole
            ? 'rounded-none bg-gradient-to-br from-white/25 via-white/5 to-white/10 p-[2px] animate-glow-pulse'
            : '')
        }
      >
        {/* Main Card Container - Square aspect ratio with no spacing */}
        <div className={
          'relative w-full h-full overflow-hidden bg-zinc-900 border ' +
          (isSpecialRole
            ? 'border-white/40 shadow-[0_0_22px_-4px_rgba(255,255,255,0.55)]'
            : 'border-zinc-700')
        }>

          {/* Image Container - Full coverage with optimized loading */}
          <div className="relative w-full h-full overflow-hidden">
            <OptimizedImage
              src={imageUrl}
              alt={`${member.firstname} ${member.lastname || 'JAGUARX'}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              quality={75}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-110 filter group-hover:brightness-110"
            />

            {/* Gradient Overlay */}
            <div className={
              'absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 ' +
              (isSpecialRole ? 'after:content-[""] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_75%,rgba(255,255,255,0.25),transparent_65%)] after:mix-blend-screen' : '')
            } />

            {/* Role Badge */}
            {member.role && member.role !== 'Member' ? (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/10 backdrop-blur-md pl-2 pr-3 py-1 rounded-full border border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                <Crown className="w-4 h-4 text-yellow-400 filter drop-shadow-[0_0_6px_#fbbf24]" />
                <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase">{member.role}</span>
              </div>
            ) : member.role && member.role === 'Member' ? (
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full border border-zinc-700">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {member.role}
                </span>
              </div>
            ) : null}

            {/* Animated ring accent for special roles */}
            {isSpecialRole && (
              <div className="pointer-events-none absolute inset-0 border border-white/20 rounded-none [mask-image:radial-gradient(circle_at_center,transparent_55%,black)]" />
            )}
          </div>

          {/* Info Section - Bottom Overlay - Always Visible */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">

            {/* Name and Social Links in same row */}
            <div className="flex justify-between items-center">

              {/* Name on left */}
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {member.firstname}{member.lastname ? ` ${member.lastname}` : ''}
                </h3>
              </div>

              {/* Social Links on right */}
              {member.sociallinks?.facebook && (
                <div className="flex space-x-2">
                  <a
                    href={member.sociallinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    title="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              )}

            </div>
          </div>

        </div>{/* end inner card */}
      </div>{/* end outer wrapper */}
    </motion.div>
  )
}
