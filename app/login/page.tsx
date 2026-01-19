"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const { login, loading } = useAuth()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await login(formData.email, formData.password)
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Welcome Back
                        </h1>
                        <p className="text-white/50 mt-2">
                            Sign in to access your collection
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/80">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="wizard@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500/50 focus:ring-purple-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-white/80">Password</Label>
                                <Link
                                    href="#"
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500/50 focus:ring-purple-500/20"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none text-white font-semibold py-6 shadow-lg shadow-purple-900/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-white/40">Don't have an account? </span>
                        <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Join the Gathering
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
