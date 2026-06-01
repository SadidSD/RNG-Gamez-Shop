"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import Button from "@/components/ui/Button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Verifying your email...')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link. No token provided.')
            return
        }

        const verifyToken = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`)
                setStatus('success')
                setMessage(res.data.message || 'Email verified successfully!')
            } catch (error: any) {
                console.error("Verification error:", error)
                setStatus('error')
                setMessage(error.response?.data?.message || 'Verification failed. The link may have expired or is invalid.')
            }
        }

        verifyToken()
    }, [token])

    return (
        <div className="w-full max-w-md bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl text-center">
            {status === 'loading' && (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    <p className="text-neutral-400 text-sm">{message}</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Verified!</h2>
                    <p className="text-neutral-400 text-sm mb-6">{message}</p>
                    <Link href="/login" className="w-full inline-block mt-4">
                        <Button className="w-full bg-white hover:bg-neutral-200 text-black font-semibold h-11 rounded-xl shadow-lg border-none text-sm transition-all flex items-center justify-center">
                            Sign In to Your Account
                        </Button>
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                        <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
                    <p className="text-neutral-400 text-sm mb-6">{message}</p>
                    <Link href="/login" className="w-full inline-block mt-4">
                        <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold h-11 rounded-xl border border-neutral-700 text-sm transition-all flex items-center justify-center">
                            Return to Login
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#09090B] text-white relative overflow-hidden font-sans">
            {/* Soft Radial Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            
            <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center absolute top-6">
                <Link href="/" className="text-sm font-black tracking-widest text-white hover:opacity-80 transition-opacity uppercase">
                    RNG GAMEZ
                </Link>
            </header>

            <main className="relative z-10 w-full flex items-center justify-center my-auto">
                <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-500 w-8 h-8"/></div>}>
                    <VerifyEmailContent />
                </Suspense>
            </main>
        </div>
    )
}
