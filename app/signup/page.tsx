"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import Link from "next/link"
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        storeName: "Customer Store"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, formData)
            if (res.data && res.data.message && !res.data.access_token) {
                setIsSuccess(true)
            } else if (res.data && res.data.access_token) {
                await login(formData.email, formData.password)
            } else {
                router.push('/login?registered=true')
            }
        } catch (err: any) {
            console.error('Registration error', err)
            setError(err.response?.data?.message || 'Failed to create account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#09090B] text-white relative overflow-hidden font-sans">
            {/* Soft Radial Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-all">
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Shop</span>
                </Link>
                <Link href="/" className="text-sm font-black tracking-widest text-white hover:opacity-80 transition-opacity uppercase">
                    RNG GAMEZ
                </Link>
            </header>

            {/* Main Card */}
            <main className="relative z-10 my-auto flex items-center justify-center w-full">
                <div className="w-full max-w-md bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            {isSuccess ? "Check your email" : "Create your account"}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-2">
                            {isSuccess ? "We've sent you a verification link" : "Enter your details to join the shop"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {isSuccess ? (
                        <div className="text-center space-y-6">
                            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-200 p-4 rounded-xl text-sm">
                                A verification email has been sent to <span className="font-semibold text-white">{formData.email}</span>. Please click the link in the email to verify your account.
                            </div>
                            <Link href="/login" className="inline-block w-full">
                                <Button className="w-full bg-white hover:bg-neutral-200 text-black font-semibold h-11 rounded-xl shadow-lg border-none text-sm transition-all flex items-center justify-center">
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="firstName" className="text-xs font-medium text-neutral-400">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Jace"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl h-11 text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="lastName" className="text-xs font-medium text-neutral-400">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Beleren"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl h-11 text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-medium text-neutral-400">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="planeswalker@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl h-11 text-sm transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-medium text-neutral-400">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl h-11 text-sm transition-all"
                            />
                            <p className="text-[10px] text-neutral-500">Must be at least 6 characters.</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-white hover:bg-neutral-200 text-black font-semibold h-11 rounded-xl shadow-lg border-none text-sm transition-all flex items-center justify-center mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-black" />
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    Create Account <ArrowRight size={14} />
                                </span>
                            )}
                        </Button>
                    </form>
                    )}

                    <div className="mt-8 text-center text-xs">
                        <span className="text-neutral-500">Already registered? </span>
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center text-[10px] text-neutral-600 uppercase tracking-widest mt-auto">
                <span>© {new Date().getFullYear()} RNG GAMEZ</span>
            </footer>
        </div>
    )
}
