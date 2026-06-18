'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, Clock, CheckCircle2, AlertCircle, Loader2, LogIn, Grid, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/UiCard';
import { useAuth } from '@/context/AuthContext';

const FILTERS = ["All", "MTG", "Pokemon", "Yu-Gi-Oh!", "Lorcana", "One Piece"];

const getEventImageUrl = (image: string | null | undefined) => {
    if (!image) return "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80";
    // Supabase CDN URLs are always full https:// URLs — use directly
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }
    // Backward compat: legacy relative path from local filesystem
    let cleanPath = image;
    if (cleanPath.startsWith('/api/uploads/')) {
        cleanPath = cleanPath.substring(4);
    }
    if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const apiBaseWithoutApi = apiBase.replace(/\/api$/, '');
    return `${apiBaseWithoutApi}${cleanPath}`;
};


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
    const [selectedType, setSelectedType] = useState("All");
    const [selectedDay, setSelectedDay] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
    const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

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
        return events.filter(e => {
            // Game filter
            if (selectedGame !== "All") {
                if (!e.game) return false;
                const normalizedGame = e.game.toLowerCase().replace(/\s+/g, '');
                const normalizedSelected = selectedGame.toLowerCase().replace(/\s+/g, '');
                if (normalizedGame !== normalizedSelected) return false;
            }

            // Type filter
            if (selectedType !== "All") {
                const isPaid = Number(e.entryFee) > 0;
                if (selectedType === "Tournament" && !isPaid) return false;
                if (selectedType === "Casual" && isPaid) return false;
            }

            // Day of Week filter
            if (selectedDay !== "All") {
                const eventDay = new Date(e.date).toLocaleDateString('en-US', { weekday: 'long' });
                if (eventDay !== selectedDay) return false;
            }

            return true;
        });
    }, [events, selectedGame, selectedType, selectedDay]);

    const getEventsForDate = (date: Date) => {
        return filteredEvents.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getFullYear() === date.getFullYear() &&
                   eDate.getMonth() === date.getMonth() &&
                   eDate.getDate() === date.getDate();
        });
    };

    const handlePrevMonth = () => {
        setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        setSelectedCalendarDate(null);
    };

    const handleNextMonth = () => {
        setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        setSelectedCalendarDate(null);
    };

    const calendarMonthEvents = React.useMemo(() => {
        return filteredEvents.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getFullYear() === currentCalendarDate.getFullYear() &&
                   eDate.getMonth() === currentCalendarDate.getMonth();
        });
    }, [filteredEvents, currentCalendarDate]);

    const activeCalendarEvents = React.useMemo(() => {
        if (!selectedCalendarDate) return calendarMonthEvents;
        return calendarMonthEvents.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getFullYear() === selectedCalendarDate.getFullYear() &&
                   eDate.getMonth() === selectedCalendarDate.getMonth() &&
                   eDate.getDate() === selectedCalendarDate.getDate();
        });
    }, [calendarMonthEvents, selectedCalendarDate]);

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

            {/* View and Advanced Filters Control Panel */}
            <div className="container mx-auto px-4 mt-8 max-w-5xl">
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl border w-full md:w-auto">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "grid" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            <Grid size={16} />
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "calendar" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            <CalendarDays size={16} />
                            Calendar View
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-start md:justify-end">
                        {/* Event Type Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Type:</span>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 text-gray-700"
                            >
                                <option value="All">All Types</option>
                                <option value="Tournament">Tournament (Paid)</option>
                                <option value="Casual">Casual (Free)</option>
                            </select>
                        </div>

                        {/* Day of Week Filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Day:</span>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 text-gray-700"
                            >
                                <option value="All">All Days</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 mt-12 max-w-5xl">
                {viewMode === "grid" ? (
                    /* GRID VIEW */
                    <>
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
                                                    src={getEventImageUrl(event.image)}
                                                    alt={event.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80";
                                                    }}
                                                />
                                                {/* Date Overlay */}
                                                <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur px-4 py-2 rounded-tr-xl" suppressHydrationWarning>
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
                                                    <div className="flex items-center gap-3 text-gray-600" suppressHydrationWarning>
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
                                <p className="text-gray-400 text-xl">No upcoming events matching filters. Check back soon!</p>
                            </div>
                        )}
                    </>
                ) : (
                    /* CALENDAR VIEW */
                    <div className="space-y-8">
                        {/* Month Navigator */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition-colors"
                                    type="button"
                                >
                                    <ChevronLeft size={20} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition-colors"
                                    type="button"
                                >
                                    <ChevronRight size={20} className="text-gray-600" />
                                </button>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize ml-2" suppressHydrationWarning>
                                    {currentCalendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                </h2>
                            </div>
                            {selectedCalendarDate && (
                                <button
                                    onClick={() => setSelectedCalendarDate(null)}
                                    className="text-sm font-semibold text-[#A855F7] hover:underline"
                                    type="button"
                                >
                                    Show All Month Events
                                </button>
                            )}
                        </div>

                        {/* Calendar Grid */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Weekdays Header */}
                            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100 py-3 text-center">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                    <span key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</span>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 bg-gray-100">
                                {(() => {
                                    const year = currentCalendarDate.getFullYear();
                                    const month = currentCalendarDate.getMonth();
                                    const firstDayIndex = new Date(year, month, 1).getDay();
                                    const lastDay = new Date(year, month + 1, 0).getDate();
                                    const prevLastDay = new Date(year, month, 0).getDate();

                                    const cells = [];
                                    // Prev month days
                                    for (let i = firstDayIndex; i > 0; i--) {
                                        const dayNum = prevLastDay - i + 1;
                                        const cellDate = new Date(year, month - 1, dayNum);
                                        cells.push({ dayNum, isCurrentMonth: false, date: cellDate });
                                    }
                                    // Current month days
                                    for (let i = 1; i <= lastDay; i++) {
                                        const cellDate = new Date(year, month, i);
                                        cells.push({ dayNum: i, isCurrentMonth: true, date: cellDate });
                                    }
                                    // Next month days
                                    const remaining = 42 - cells.length;
                                    for (let i = 1; i <= remaining; i++) {
                                        const cellDate = new Date(year, month + 1, i);
                                        cells.push({ dayNum: i, isCurrentMonth: false, date: cellDate });
                                    }

                                    return cells.map((cell, idx) => {
                                        const cellEvents = getEventsForDate(cell.date);
                                        const isSelected = selectedCalendarDate &&
                                            selectedCalendarDate.getFullYear() === cell.date.getFullYear() &&
                                            selectedCalendarDate.getMonth() === cell.date.getMonth() &&
                                            selectedCalendarDate.getDate() === cell.date.getDate();
                                        const isToday = new Date().toDateString() === cell.date.toDateString();

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => cell.isCurrentMonth && setSelectedCalendarDate(cell.date)}
                                                className={`min-h-[90px] md:min-h-[110px] p-2 bg-white flex flex-col justify-between transition-all group ${cell.isCurrentMonth ? 'cursor-pointer hover:bg-violet-50/20' : 'bg-gray-50/50 text-gray-300 pointer-events-none'} ${isSelected ? 'ring-2 ring-[#A855F7] ring-inset bg-violet-50/30' : ''}`}
                                            >
                                                <div className="flex justify-between items-center" suppressHydrationWarning>
                                                    <span className={`text-sm font-bold ${isToday ? 'bg-[#A855F7] text-white rounded-full w-6 h-6 flex items-center justify-center' : cell.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}`} suppressHydrationWarning>
                                                        {cell.dayNum}
                                                    </span>
                                                    {cellEvents.length > 0 && cell.isCurrentMonth && (
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                                            {cellEvents.length}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Events list in day */}
                                                <div className="mt-2 space-y-1 overflow-hidden flex-grow flex flex-col justify-end">
                                                    {cellEvents.slice(0, 2).map((ev) => {
                                                        let badgeColor = "bg-gray-100 text-gray-700";
                                                        const game = ev.game ? ev.game.toUpperCase() : "";
                                                        if (game.includes("MTG")) badgeColor = "bg-red-50 text-red-600 border border-red-100";
                                                        else if (game.includes("POKE")) badgeColor = "bg-yellow-50 text-yellow-700 border border-yellow-100";
                                                        else if (game.includes("YU")) badgeColor = "bg-blue-50 text-blue-600 border border-blue-100";
                                                        else if (game.includes("LOR")) badgeColor = "bg-purple-50 text-purple-600 border border-purple-100";
                                                        else if (game.includes("PIECE")) badgeColor = "bg-orange-50 text-orange-600 border border-orange-100";

                                                        return (
                                                            <div
                                                                key={ev.id}
                                                                className={`text-[9px] font-bold py-0.5 px-1 rounded truncate max-w-full hidden sm:block ${badgeColor}`}
                                                                title={ev.name}
                                                            >
                                                                {ev.name}
                                                            </div>
                                                        );
                                                    })}
                                                    {cellEvents.length > 0 && (
                                                        <div className="sm:hidden flex justify-center gap-1">
                                                            {cellEvents.map((_, dotIdx) => (
                                                                <span key={dotIdx} className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
                                                            ))}
                                                        </div>
                                                    )}
                                                    {cellEvents.length > 2 && (
                                                        <div className="text-[8px] font-extrabold text-[#A855F7] pl-1 uppercase hidden sm:block">
                                                            + {cellEvents.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Events list below Calendar */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-800" suppressHydrationWarning>
                                {selectedCalendarDate ? (
                                    `Events on ${selectedCalendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
                                ) : (
                                    `All Events in ${currentCalendarDate.toLocaleString('en-US', { month: 'long' })}`
                                )}
                            </h3>

                            {activeCalendarEvents.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 border text-center text-gray-400">
                                    No events scheduled for this period matching filters.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {activeCalendarEvents.map((event) => {
                                        const isFull = event.maxPlayers ? (event._count?.players || 0) >= event.maxPlayers : false;
                                        const isPaid = Number(event.entryFee) > 0;
                                        return (
                                            <Card key={event.id} className="bg-white border hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-4 p-4 overflow-hidden rounded-2xl group">
                                                <div className="relative w-full sm:w-36 h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                                    <img
                                                        src={getEventImageUrl(event.image)}
                                                        alt={event.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80";
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between space-y-3">
                                                    <div>
                                                        <h4 className="font-bold text-lg line-clamp-1 group-hover:text-[#A855F7] transition-colors">{event.name}</h4>
                                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{event.game} • {event.format || 'Standard'}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-y-1 gap-x-3 text-xs text-gray-500" suppressHydrationWarning>
                                                        <div className="flex items-center gap-1.5" suppressHydrationWarning> <Clock size={12} /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        <div className="flex items-center gap-1.5"><MapPin size={12} className="shrink-0" /> <span className="truncate">{event.location || 'In-Store'}</span></div>
                                                        <div className="flex items-center gap-1.5"><Users size={12} /> {event._count?.players || 0}/{event.maxPlayers || '∞'}</div>
                                                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                                                            {Number(event.entryFee) === 0 ? "Free" : `$${Number(event.entryFee).toFixed(2)}`}
                                                        </div>
                                                    </div>
                                                    <div className="pt-2 border-t flex justify-end">
                                                        <Button
                                                            className="!py-1.5 !px-4 !text-xs flex items-center gap-1.5"
                                                            onClick={() => handleOpenModal(event)}
                                                        >
                                                            {!user && <LogIn size={12} />}
                                                            {isFull ? "Join Waitlist" : (isPaid ? "Buy Ticket" : "Join Now")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
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
                                        <p className="text-gray-500 text-sm mt-1" suppressHydrationWarning>
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
