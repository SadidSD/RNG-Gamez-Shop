'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button'; // Custom Button Casing
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/UiCard';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [storeName, setStoreName] = useState('My Store'); // Legacy requirement? Or can be omitted for Customers?
    // DTO requires storeName, but for Customer Register it might imply "Customer Name"?
    // Backend Logic for 'register':
    // "name: dto.storeName || 'TCG Store'" -> Only used if creating a BRAND NEW STORE.
    // Since Store exists, storeName in DTO is ignored for Store Creation.
    // However, DTO validation requires it?
    // Let's check DTO: @IsString() @IsNotEmpty() storeName: string;
    // So YES, we must send a dummy storeName or Customer Name.
    // I'll repurpose it as "First Name" conceptually or just send "Customer".

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                email,
                password,
                storeName: "Customer" // Dummy value to satisfy DTO
            });

            if (res.data && res.data.access_token) {
                login(res.data.access_token, {});
                router.push('/');
            }
        } catch (err: any) {
            console.error('Signup error', err);
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-bold">Create your account</CardTitle>
                    <CardDescription className="text-center">
                        Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Must be at least 6 characters long.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Account
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
