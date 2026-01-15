'use client'

import { useEffect } from 'react'
import { AlertOctagon, RefreshCw } from 'lucide-react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body className="bg-black text-white">
                <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-red-500/30">
                    {/* Background Grid */}
                    <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Red Alert Overlay */}
                    <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-red-900/20 via-transparent to-red-900/20 animate-pulse" />

                    <div className="relative z-10 flex flex-col items-center text-center p-4 max-w-2xl w-full">

                        <div className="mb-8">
                            <div className="w-24 h-24 mx-auto bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center mb-6 relative">
                                <AlertOctagon size={48} className="text-red-500" />
                                <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping opacity-20" />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2 text-white">
                                Critical Failure
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-red-500 font-mono text-sm tracking-widest">
                                <span>SYSTEM_CRASH</span>
                                <span className="bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                                    {error.digest || 'FATAL_ERROR'}
                                </span>
                            </div>
                        </div>

                        <div className="w-full max-w-md bg-neutral-900/50 border border-white/10 p-6 rounded-lg backdrop-blur-sm mb-8">
                            <p className="text-neutral-400 text-sm font-mono mb-4 text-left border-b border-white/5 pb-4">
                                The system encountered a critical error and cannot recover automatically.
                            </p>
                            <button
                                onClick={reset}
                                className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)' }}
                            >
                                <RefreshCw size={16} />
                                Hard Reboot
                            </button>
                        </div>

                    </div>
                </div>
            </body>
        </html>
    )
}
