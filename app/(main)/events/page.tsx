'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Trophy, Clock, Filter, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/UiCard';

const FILTERS = ["All", "MTG", "Pokemon", "Yu-Gi-Oh!"];

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

export default function EventsPage() {
    const [selectedGame, setSelectedGame] = useState("All");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
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
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = React.useMemo(() => {
        if (selectedGame === "All") return events;
        return events.filter(e => e.game && e.game.toLowerCase() === selectedGame.toLowerCase());
    }, [events, selectedGame]);

    if (loading) {
        // Trigger Deployment
        return (
            <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F1F1] pb-20">
            {/* Hero Section */}
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
                        className="text-5xl md:text-7xl font-bold text-white tracking-tighter"
                        style={{ fontFamily: 'Europa Grotesk SH' }}
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
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white border-0 h-full flex flex-col group">
                                {/* Image Badge */}
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {event.game || 'TCG'}
                                    </div>
                                    <img
                                        src={event.image || "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&q=80"}
                                        alt={event.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Date Overlay */}
                                    <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur px-4 py-2 rounded-tr-xl">
                                        <div className="flex items-center gap-2 font-bold text-lg">
                                            <Calendar size={18} className="text-[#A855F7]" />
                                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1 group-hover:text-[#A855F7] transition-colors line-clamp-1">
                                            {event.name}
                                        </h3>
                                        <p className="text-gray-500 font-medium">{event.format || 'Standard'}</p>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Clock size={16} />
                                            <span className="text-sm">
                                                {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
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
                                        <Button className="!py-2 !px-6" onClick={() => alert("Registration coming next!")}>
                                            Join Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No upcoming events for {selectedGame}. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
