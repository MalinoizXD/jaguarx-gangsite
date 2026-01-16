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
  const isFounder = member.role === 'Founder'
  const isSpecialRole = member.role && member.role !== 'Member'

  // Default fallback image
  const defaultImage = '/uploads/jaguarxlogo.png'
  const imageUrl = member.imageurl || defaultImage

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className={`relative w-full backdrop-blur-sm border rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg
        ${isFounder
          ? 'bg-neutral-900/90 border-amber-500/50 hover:bg-neutral-800/90 hover:border-amber-400 hover:shadow-amber-500/20'
          : 'bg-neutral-900/80 border-white/10 hover:bg-neutral-800/80 hover:border-white/30 hover:shadow-white/5'
        }`}
      >

        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-colors duration-300
            ${isFounder
              ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              : isSpecialRole
                ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                : 'border-neutral-700 group-hover:border-white/50'
            }`}
          >
            <OptimizedImage
              src={imageUrl}
              alt={`${member.firstname} ${member.lastname}`}
              fill
              className="object-cover"
            />
          </div>
          {/* Online/Status Indicator (Optional visual detail) */}
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-neutral-900 rounded-full ${isFounder ? 'bg-amber-400' : 'bg-green-500'}`} />
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            {/* Role Badge if special */}
            {member.role && (
              <div className="flex items-center gap-1 mb-0.5">
                {isFounder && <Crown className="w-3 h-3 text-amber-500" />}
                <span className={`text-[10px] font-bold uppercase tracking-wider
                  ${isFounder
                    ? 'text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]'
                    : isSpecialRole
                      ? 'text-red-400'
                      : 'text-neutral-500'
                  }`}
                >
                  {member.role}
                </span>
              </div>
            )}

            {/* Name */}
            <h3 className={`text-lg font-bold truncate leading-tight transition-colors duration-300
              ${isFounder
                ? 'text-white group-hover:text-amber-400'
                : 'text-white group-hover:text-red-500'
              }`}
            >
              {member.firstname} {member.lastname}
            </h3>

            {/* Facebook Link */}
            {member.sociallinks?.facebook ? (
              <a
                href={member.sociallinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs mt-1 flex items-center gap-1 font-medium transition-colors
                  ${isFounder
                    ? 'text-amber-500/80 hover:text-amber-400'
                    : 'text-blue-400 hover:text-blue-300'
                  }`}
              >
                Facebook
              </a>
            ) : (
              <span className="text-xs text-neutral-600 mt-1 font-medium">No Contact</span>
            )}
          </div>
        </div>

        {/* Decorative Corner Accent */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-2xl">
          <div className={`absolute top-0 right-0 w-4 h-4 rotate-45 transform origin-bottom-left ${isFounder ? 'bg-amber-500/20' : 'bg-white/5'}`} />
        </div>
      </div>
    </motion.div>
  )
}
