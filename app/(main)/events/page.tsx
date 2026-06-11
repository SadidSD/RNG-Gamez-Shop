'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, Clock, CheckCircle2, AlertCircle, Loader2, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/UiCard';
import { useAuth } from '@/context/AuthContext';

const FILTERS = ["All", "MTG", "Pokemon", "Yu-Gi-Oh!", "Lorcana", "One Piece"];

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    maxPlayers: number;
    game: string;
    format: string;
    entryFee: number;
    image: string;
    prizes: string;
    location: string;
    _count: {
        players: number;
    };
}

type ModalState = 'idle' | 'submitting' | 'success' | 'waitlisted' | 'redirecting' | 'error';

export default function EventsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedGame, setSelectedGame] = useState("All");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [playerName, setPlayerName] = useState('');
    const [playerEmail, setPlayerEmail] = useState('');
    const [modalState, setModalState] = useState<ModalState>('idle');
    const [modalMessage, setModalMessage] = useState('');

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === 'success') {
            // Optionally show a toast here
        }

        const fetchEvents = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                } else {
                    setError("Failed to fetch events from server.");
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
                setError("Network error. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = React.useMemo(() => {
        if (selectedGame === "All") return events;
        return events.filter(e => {
            if (!e.game) return false;
            const normalizedGame = e.game.toLowerCase().replace(/\s+/g, '');
            const normalizedSelected = selectedGame.toLowerCase().replace(/\s+/g, '');
            return normalizedGame === normalizedSelected;
        });
    }, [events, selectedGame]);

    const handleOpenModal = (event: Event) => {
        // Require login to register or buy a ticket
        if (!user) {
            router.push(`/login?redirect=/events`);
            return;
        }

        setSelectedEvent(event);
        setIsOpen(true);
        // Pre-fill from logged-in user profile
        setPlayerName(user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
        setPlayerEmail(user.email || '');
        setModalState('idle');
        setModalMessage('');
    };

    const handleCloseModal = () => {
        if (modalState === 'submitting' || modalState === 'redirecting') return;
        setIsOpen(false);
        setSelectedEvent(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;

        setModalState('submitting');
        const isPaid = Number(selectedEvent.entryFee) > 0;

        try {
            const endpoint = isPaid ? 'checkout' : 'register';
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/${selectedEvent.id}/${endpoint}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
                    },
                    body: JSON.stringify({
                        playerName,
                        playerEmail: playerEmail || undefined,
                        successUrl: `${window.location.origin}/events?payment=success`,
                        cancelUrl: `${window.location.origin}/events?payment=cancelled`,
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                const msg = data.message || 'Registration failed. Please try again.';
                setModalState('error');
                setModalMessage(
                    res.status === 409 && msg.toLowerCase().includes('already')
                        ? 'You are already registered for this event.'
                        : msg
                );
                return;
            }

            // Waitlisted
            if (data.waitlisted) {
                setModalState('waitlisted');
                setModalMessage(`You've been added to the waitlist at position #${data.position}. We'll notify you if a spot opens up!`);
                return;
            }

            // Paid event → redirect to Stripe
            if (data.checkoutUrl) {
                setModalState('redirecting');
                setModalMessage('Redirecting you to secure checkout...');
                setTimeout(() => {
                    window.location.href = data.checkoutUrl;
                }, 800);
                return;
            }

            // Free event — registered successfully
            setModalState('success');
            setModalMessage("You're registered! A QR ticket will be emailed if you provided your email. See you there! 🎴");

            // Optimistically update player count
            setEvents(prev => prev.map(ev =>
                ev.id === selectedEvent.id
                    ? { ...ev, _count: { players: (ev._count?.players || 0) + 1 } }
                    : ev
            ));

            setTimeout(() => setIsOpen(false), 3000);

        } catch (err) {
            setModalState('error');
            setModalMessage('Network error. Please check your connection and try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="text-red-500 text-5xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800">Failed to Load Events</h2>
                    <p className="text-gray-600">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F1F1] pb-20">
            {/* Hero */}
            <div className="relative h-[40vh] bg-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-60">
                    <img
                        src="/images/events-hero-final.jpg"
                        alt="Events Hero"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 text-center space-y-4 px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-white"
                        style={{ fontFamily: 'Europa Grotesk SH', letterSpacing: '0.2em' }}
                    >
                        UPCOMING EVENTS
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 text-xl max-w-2xl mx-auto"
                    >
                        Join the community, test your skills, and win glory.
                    </motion.p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white rounded-full shadow-lg p-2 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                    {FILTERS.map((game) => (
                        <button
                            key={game}
                            onClick={() => setSelectedGame(game)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedGame === game
                                ? 'bg-black text-white shadow-md transform scale-105'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {game}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event, index) => {
                        const isFull = event.maxPlayers ? (event._count?.players || 0) >= event.maxPlayers : false;
                        const isPaid = Number(event.entryFee) > 0;
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white border-0 h-full flex flex-col group">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                        <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {event.game || 'TCG'}
                                        </div>
                                        <img
                                            src={event.image || "/images/event-placeholder.jpg"}
                                            alt={event.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80";
                                            }}
                                        />
                                        {/* Date Overlay */}
                                        <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur px-4 py-2 rounded-tr-xl">
                                            <div className="flex items-center gap-2 font-bold text-lg">
                                                <Calendar size={18} className="text-[#A855F7]" />
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                        {isFull && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg bg-black/60 px-4 py-2 rounded-full">WAITLIST AVAILABLE</span>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-1 group-hover:text-[#A855F7] transition-colors line-clamp-1">
                                                {event.name}
                                            </h3>
                                            <p className="text-gray-500 font-medium">{event.format || 'Standard'}</p>
                                        </div>

                                        {event.description && (
                                            <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                                        )}

                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Clock size={16} />
                                                <span className="text-sm">
                                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <MapPin size={16} />
                                                <span className="text-sm line-clamp-1">{event.location || 'In-Store'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Trophy size={16} />
                                                <span className="text-sm line-clamp-1">{event.prizes || 'No prizes listed'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <Users size={16} />
                                                <span className="text-sm">
                                                    {event._count?.players || 0} / {event.maxPlayers || '∞'} Registered
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t flex items-center justify-between">
                                            <div className="text-xl font-bold">
                                                {Number(event.entryFee) === 0 ? "Free" : `$${Number(event.entryFee).toFixed(2)}`}
                                            </div>
                                            <Button
                                                className="!py-2 !px-6 flex items-center gap-2"
                                                onClick={() => handleOpenModal(event)}
                                            >
                                                {!user && <LogIn size={15} />}
                                                {isFull ? "Join Waitlist" : (isPaid ? "Buy Ticket" : "Join Now")}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No upcoming events for {selectedGame}. Check back soon!</p>
                    </div>
                )}
            </div>

            {/* Registration / Checkout Modal */}
            <AnimatePresence>
                {isOpen && selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl z-10 border border-gray-100"
                        >
                            {/* Close button */}
                            {modalState !== 'submitting' && modalState !== 'redirecting' && (
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-xl font-light"
                                >
                                    ✕
                                </button>
                            )}

                            {/* Success / Waitlisted / Redirecting states */}
                            {(modalState === 'success' || modalState === 'waitlisted' || modalState === 'redirecting') ? (
                                <div className="text-center space-y-4 py-4">
                                    {modalState === 'success' && (
                                        <CheckCircle2 size={56} className="text-green-500 mx-auto" />
                                    )}
                                    {modalState === 'waitlisted' && (
                                        <div className="text-5xl">⏳</div>
                                    )}
                                    {modalState === 'redirecting' && (
                                        <Loader2 size={48} className="text-[#A855F7] mx-auto animate-spin" />
                                    )}
                                    <h3 className="text-xl font-bold text-black">
                                        {modalState === 'success' && "You're In! 🎴"}
                                        {modalState === 'waitlisted' && "Added to Waitlist!"}
                                        {modalState === 'redirecting' && "Redirecting to Checkout..."}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{modalMessage}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-black">
                                            {Number(selectedEvent.entryFee) > 0 ? "Buy Your Ticket" : "Register for Event"}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            <span className="font-semibold text-black">{selectedEvent.name}</span>
                                            {" — "}
                                            {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                                weekday: 'short', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                        {Number(selectedEvent.entryFee) > 0 && (
                                            <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-700">
                                                🔒 You'll be redirected to secure Stripe checkout to pay <strong>${Number(selectedEvent.entryFee).toFixed(2)}</strong>. Your ticket QR code will be emailed after payment.
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Logged in badge */}
                                        {user && (
                                            <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
                                                <CheckCircle2 size={14} className="shrink-0" />
                                                <span>Registering as <strong>{user.email}</strong></span>
                                            </div>
                                        )}

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Player Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={playerName}
                                                onChange={(e) => setPlayerName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] text-black"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">
                                                Email Address{' '}
                                                {Number(selectedEvent.entryFee) > 0
                                                    ? <span className="text-red-500">*</span>
                                                    : <span className="text-gray-400 font-normal">(for ticket delivery)</span>
                                                }
                                            </label>
                                            <input
                                                type="email"
                                                required={Number(selectedEvent.entryFee) > 0}
                                                value={playerEmail}
                                                onChange={(e) => setPlayerEmail(e.target.value)}
                                                placeholder="john@example.com"
                                                readOnly={!!user?.email}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7] text-black ${user?.email ? 'bg-gray-50 text-gray-500 cursor-default' : ''}`}
                                            />
                                        </div>

                                        {modalState === 'error' && (
                                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-start gap-2">
                                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                                {modalMessage}
                                            </div>
                                        )}

                                        <div className="pt-4 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={handleCloseModal}
                                                className="px-5 py-2 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
                                                disabled={modalState === 'submitting'}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={modalState === 'submitting'}
                                                className="px-6 py-2 bg-black hover:bg-[#A855F7] text-white rounded-full transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {modalState === 'submitting' ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : Number(selectedEvent.entryFee) > 0 ? (
                                                    `Pay $${Number(selectedEvent.entryFee).toFixed(2)}`
                                                ) : (
                                                    'Confirm Spot'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
