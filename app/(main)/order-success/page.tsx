'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const sid = searchParams.get('session_id');
        if (sid) setSessionId(sid);
    }, [searchParams]);

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center relative z-10 shadow-2xl"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle className="text-green-400 w-12 h-12" />
                </motion.div>

                <h1 className="text-4xl font-black mb-4 tracking-tight">Payment Successful!</h1>
                <p className="text-gray-300 text-lg mb-8">
                    Thank you for your purchase. Your order has been received and is now being processed. 
                    You will receive an email confirmation shortly.
                </p>

                {sessionId && (
                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Session Reference</p>
                        <p className="text-sm text-gray-300 font-mono break-all">{sessionId}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/shop">
                        <button className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <ShoppingBag size={18} />
                            Continue Shopping
                        </button>
                    </Link>
                    <Link href="/account">
                        <button className="w-full sm:w-auto px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10 flex items-center justify-center gap-2">
                            View Order
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </motion.div>
        </>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none" />
            <Suspense fallback={<div className="z-10 text-xl font-bold">Loading...</div>}>
                <OrderSuccessContent />
            </Suspense>
        </div>
    );
}
