'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

const Logo3D = dynamic(() => import('./Logo3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
    )
})

export default function AnimatedHero() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [scrollY, setScrollY] = useState(0)
    const heroRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // setIsLoaded(true) - Controlled by Logo3D now

        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect()
            setMousePosition({
                x: (e.clientX - rect.left - rect.width / 2) / 50,
                y: (e.clientY - rect.top - rect.height / 2) / 50
            })
        }
    }

    return (
        <div
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen overflow-hidden bg-black"
            style={{
                backgroundImage: 'url(/uploads/1760010475208-0une9deywda1ye.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                fontFamily: 'var(--font-asylum)'
            }}
        >
            {/* Grain overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Dark overlay for background image */}
            <div className="absolute inset-0 z-5 bg-black/70" />

            {/* Atmospheric gradient overlay */}
            <div
                className="absolute inset-0 z-10"
                style={{
                    background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20, 20, 25, 0) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 100%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 100%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)
          `
                }}
            />

            {/* Dynamic light leak effect */}
            <div
                className="absolute top-0 right-0 w-full h-full z-5 transition-transform duration-1000 ease-out"
                style={{
                    background: `radial-gradient(circle at ${50 + mousePosition.x * 2}% ${30 + mousePosition.y * 2}%, rgba(255,255,255,0.02) 0%, transparent 40%)`,
                    transform: `translateY(${scrollY * 0.1}px)`
                }}
            />

            {/* Hero content container */}
            <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">

                {/* Top navigation hint */}
                <div
                    className={`absolute top-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                    <div className="flex items-center gap-2 text-neutral-500 text-xs tracking-[0.3em] uppercase">
                        <span className="w-8 h-px bg-neutral-700" />
                        <span>Est. 2025</span>
                        <span className="w-8 h-px bg-neutral-700" />
                    </div>
                </div>

                {/* Cinematic Corner Accents */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                    <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-white/10 rounded-tl-3xl" />
                    <div className="absolute top-8 right-8 w-32 h-32 border-r-2 border-t-2 border-white/10 rounded-tr-3xl" />
                    <div className="absolute bottom-8 left-8 w-32 h-32 border-l-2 border-b-2 border-white/10 rounded-bl-3xl" />
                    <div className="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-white/10 rounded-br-3xl" />
                </div>


                {/* Main hero */}
                <div className="relative flex flex-col items-center z-10">

                    {/* 3D Spinning Logo */}
                    <div className={`w-full max-w-2xl mx-auto transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <Logo3D onLoaded={() => setIsLoaded(true)} />
                    </div>


                    {/* Brand name with reveal animation */}
                    <div className="relative mt-12">
                        {/* Glow effect behind text - Outside overflow hidden to prevent clipping */}
                        <div
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-40 pointer-events-none transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                            aria-hidden="true"
                        >
                            <div
                                className="w-full h-full rounded-full blur-[80px] opacity-20"
                                style={{
                                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 70%)'
                                }}
                            />
                        </div>

                        {/* Text container - Removed overflow-hidden to prevent font clipping */}
                        <div
                            className={`relative z-10 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        >
                            <h1
                                className="text-6xl md:text-8xl lg:text-9xl font-bold"
                                style={{
                                    background: 'linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 50%, #606060 100%)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    padding: '0.2em 0.5em', // Generous padding on all sides
                                    lineHeight: '1.4', // Increased line height
                                    marginLeft: '-0.2em', // Optical alignment compensation
                                    marginRight: '-0.2em'
                                }}
                            >
                                JAGUARX
                            </h1>
                        </div>
                    </div>

                    {/* Divider */}
                    <div
                        className={`mt-10 flex items-center gap-4 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                    >
                        <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                        <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
                    </div>


                    {/* CTA Button */}
                    <div
                        className={`mt-12 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        {/* Member Page Button */}
                        <a
                            href="/members"
                            className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm tracking-widest uppercase overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-transparent border border-neutral-600/50 rounded-sm transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/5" />
                            <svg
                                className="relative z-10 w-4 h-4 text-neutral-500 group-hover:text-white transition-all duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="relative z-10 text-neutral-400 group-hover:text-white transition-colors duration-300">
                                MEMBERS
                            </span>
                        </a>
                    </div>

                    {/* Credit */}
                    <div className={`mt-16 text-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-neutral-600 text-xs uppercase tracking-widest">
                            System Design by <a href="https://www.facebook.com/mali.temps/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">Mali Cloud</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
