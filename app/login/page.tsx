"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"

export default function LoginPage() {
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await login(formData.email, formData.password)
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || 'Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-[#09090B] text-white relative overflow-hidden font-sans">
            {/* Soft Radial Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Header (Minimal navigation back to home) */}
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
                            Welcome back
                        </h1>
                        <p className="text-xs text-neutral-400 mt-2">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded-xl">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-medium text-neutral-400">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="wizard@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl h-11 text-sm transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-medium text-neutral-400">Password</Label>
                                <Link
                                    href="#"
                                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-neutral-950/60 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl h-11 text-sm transition-all"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-white hover:bg-neutral-200 text-black font-semibold h-11 rounded-xl shadow-lg border-none text-sm transition-all flex items-center justify-center mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-black" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-xs">
                        <span className="text-neutral-500">New here? </span>
                        <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Create an account
                        </Link>
                    </div>
                </div>
            </main>
            {/* Footer space */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto flex justify-between items-center text-[10px] text-neutral-600 uppercase tracking-widest mt-auto">
                <span>© {new Date().getFullYear()} RNG GAMEZ</span>
                <span>Minimal Checkout Enforced</span>
            </footer>
        </div>
    )
}
