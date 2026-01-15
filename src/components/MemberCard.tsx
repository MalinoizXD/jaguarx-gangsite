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
  const defaultImage = '/uploads/placeholder_agent.png'
  const imageUrl = member.imageurl || defaultImage

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative p-2"
    >
      {/* Card Container with Angled Corners */}
      <div
        className="relative w-full aspect-[3/4] bg-neutral-900 overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)'
        }}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <OptimizedImage
            src={imageUrl}
            alt={`${member.firstname} ${member.lastname}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        </div>

        {/* Tech Overlays */}
        <div className="absolute inset-0 pointer-events-none border border-white/10" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30" />

        {/* Role Badge (Top Left) */}
        {member.role && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className={`h-1 w-8 ${isSpecialRole ? 'bg-red-500' : 'bg-neutral-500'}`} />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
              {member.role}
            </span>
          </div>
        )}

        {/* Info Section (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full p-4 pb-8">
          <h3 className="text-xl font-bold text-white uppercase tracking-tighter leading-none mb-1">
            {member.firstname}
          </h3>
          <h3 className="text-lg font-bold text-neutral-500 uppercase tracking-tighter leading-none">
            {member.lastname}
          </h3>

          {/* Social Link (Hidden by default, visible on hover) */}
          {member.sociallinks?.facebook && (
            <div className="mt-3 overflow-hidden h-0 group-hover:h-auto transition-all duration-300">
              <a
                href={member.sociallinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                FACEBOOK PROFILE
              </a>
            </div>
          )}
        </div>

        {/* Hover Glitch Effect Line */}
        <div className="absolute bottom-0 right-0 w-full h-1 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
      </div>
    </motion.div>
  )
}
