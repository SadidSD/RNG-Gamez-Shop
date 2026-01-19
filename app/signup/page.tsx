"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import Link from "next/link"
import { Loader2, ArrowRight } from "lucide-react"
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        storeName: "Customer Store" // Hidden field for backend requirement
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Register
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, formData)

            // Auto Login if token returned
            if (res.data && res.data.access_token) {
                await login(formData.email, formData.password) // Or use token directly if context supported it, but re-login is safer to trigger fetchProfile
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
        <div className="min-h-screen flex bg-black relative overflow-hidden">
            {/* Left Side - Visuals (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-950 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635326577533-02ae16182c11?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                <div className="relative z-10 p-12 text-white max-w-xl">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Build Your Ultimate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Collection</span>
                    </h1>
                    <p className="text-lg text-white/70 mb-8">
                        Join thousands of players buying, selling, and trading the rarest cards in the multiverse.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <h3 className="font-bold text-purple-300">Exclusive Deals</h3>
                            <p className="text-sm text-white/50">Early access to new drops.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <h3 className="font-bold text-indigo-300">Track Prices</h3>
                            <p className="text-sm text-white/50">Real-time market data.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative">
                {/* Mobile Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black lg:hidden"></div>

                <div className="w-full max-w-md relative z-10 lg:pl-12">
                    <div className="backdrop-blur-xl bg-black/40 lg:bg-transparent lg:backdrop-blur-none border border-white/10 lg:border-none rounded-2xl p-6 lg:p-0">

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-white/50">Start your journey today.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-white/80">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Jace"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Beleren"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/80">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="planeswalker@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white/80">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                                />
                                <p className="text-xs text-white/30">Must be at least 6 characters.</p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-white/40">Already have an account? </span>
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
