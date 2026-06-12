"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Calendar, MapPin, Clock, Ticket as TicketIcon, X } from "lucide-react";

export default function UserTicketsTab() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    useEffect(() => {
        async function fetchRegistrations() {
            try {
                const token = Cookies.get("tcg-shop-token");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/my-registrations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRegistrations(res.data);
            } catch (error) {
                console.error("Failed to fetch registrations", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRegistrations();
    }, []);

    if (loading) return <div className="text-gray-400 animate-pulse">Loading event registrations...</div>;

    if (registrations.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400">You aren't registered for any events yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-2">My Registered Events</h2>
            <p className="text-gray-400 mb-6">Manage your upcoming event entries and view scannable entry tickets.</p>
            
            <div className="grid grid-cols-1 gap-4">
                {registrations.map((reg) => {
                    const event = reg.event;
                    const ticket = reg.ticket;
                    const isPaid = Number(event.entryFee) > 0;
                    const hasTicket = !!ticket;
                    const eventDate = new Date(event.date);

                    return (
                        <div key={reg.id} className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col md:flex-row justify-between gap-4 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
                            <div className="space-y-3 flex-1">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="font-bold text-lg text-white">{event.name}</span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono tracking-wider">
                                            {event.game}
                                        </span>
                                    </div>
                                    <p className="text-sm text-purple-300 font-medium">{event.format || 'Standard'}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-purple-400" />
                                        <span>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-purple-400" />
                                        <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:col-span-2">
                                        <MapPin size={14} className="text-purple-400 shrink-0" />
                                        <span className="truncate">{event.location || 'In-Store'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end justify-between min-w-[150px] gap-4">
                                <div className="flex flex-col md:items-end">
                                    <span className="text-xs text-gray-400">Entry Fee</span>
                                    <span className="font-bold text-white">
                                        {Number(event.entryFee) === 0 ? "Free" : `$${Number(event.entryFee).toFixed(2)}`}
                                    </span>
                                </div>

                                {hasTicket ? (
                                    <button
                                        onClick={() => setSelectedTicket({ reg, event, ticket })}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <TicketIcon size={16} />
                                        View Ticket
                                    </button>
                                ) : (
                                    <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/10 text-center">
                                        {isPaid ? "Payment Pending" : "Generating Ticket..."}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ticket Viewer Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedTicket(null)}
                    />

                    {/* Card container */}
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl z-10 text-white animate-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button 
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            type="button"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 mb-2">
                                <TicketIcon size={24} />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">{selectedTicket.event.name}</h3>
                                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mt-1">
                                    {selectedTicket.event.game} • {selectedTicket.event.format || 'Standard'}
                                </p>
                            </div>

                            {/* Ticket ID */}
                            <div className="bg-white/5 border border-white/10 rounded-lg py-1 px-3 inline-block">
                                <span className="text-[10px] uppercase text-gray-400 block tracking-widest font-semibold">Ticket ID</span>
                                <span className="font-mono text-sm text-purple-300 font-bold">
                                    TKT-{selectedTicket.reg.id.slice(0, 8).toUpperCase()}
                                </span>
                            </div>

                            {/* QR Code */}
                            <div className="bg-white p-4 rounded-xl inline-block border-2 border-purple-500/30">
                                <img 
                                    src={selectedTicket.ticket.qrCode} 
                                    alt="Ticket QR Code" 
                                    className="w-48 h-48 block"
                                />
                            </div>

                            {/* Ticket Details Roster */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-2.5 text-xs text-gray-300">
                                <div className="flex justify-between border-b border-white/5 pb-1.5">
                                    <span className="text-gray-400">Player</span>
                                    <span className="font-semibold text-white">{selectedTicket.reg.playerName}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1.5">
                                    <span className="text-gray-400">Date</span>
                                    <span className="font-semibold text-white">
                                        {new Date(selectedTicket.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Location</span>
                                    <span className="font-semibold text-white truncate max-w-[180px]" title={selectedTicket.event.location}>
                                        {selectedTicket.event.location || 'In-Store'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[11px] text-gray-400 italic">
                                Present this QR code on your phone at the door to check in.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
