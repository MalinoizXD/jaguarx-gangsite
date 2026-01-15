'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative selection:bg-red-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Red Alert Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-red-900/10 via-transparent to-red-900/10" />

            <div className="relative z-10 flex flex-col items-center text-center p-4 max-w-2xl">

                {/* Glitch Effect Number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-[150px] md:text-[200px] font-bold leading-relaxed tracking-tighter text-white select-none py-12"
                        style={{ fontFamily: 'var(--font-asylum)' }}>
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center opacity-50 blur-sm animate-pulse text-[150px] md:text-[200px] font-bold leading-relaxed tracking-tighter text-red-500 pointer-events-none py-12"
                        style={{ fontFamily: 'var(--font-asylum)' }}>
                        404
                    </div>
                </motion.div>

                {/* Status Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-center gap-3 text-red-500 mb-4">
                        <AlertTriangle size={24} className="animate-pulse" />
                        <span className="text-xl font-bold tracking-[0.2em] uppercase">Signal Lost</span>
                        <AlertTriangle size={24} className="animate-pulse" />
                    </div>

                    <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-2">
                        Target Not Found
                    </h2>

                    <p className="text-neutral-400 max-w-md mx-auto text-sm md:text-base tracking-wide leading-relaxed">
                        The requested coordinates do not exist in the JaguarX database.
                        The page may have been moved, deleted, or never existed.
                    </p>

                    {/* Tech Divider */}
                    <div className="flex items-center justify-center gap-4 py-8 opacity-50">
                        <div className="w-12 h-px bg-white/20" />
                        <div className="w-2 h-2 rotate-45 border border-white/40" />
                        <div className="w-12 h-px bg-white/20" />
                    </div>

                    {/* Action Button */}
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 clip-path-button"
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                        <Home size={18} />
                        <span>Return to Base</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Corners */}
            <div className="fixed top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/20" />
            <div className="fixed top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-white/20" />
            <div className="fixed bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-white/20" />
            <div className="fixed bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/20" />
        </div>
    )
}
