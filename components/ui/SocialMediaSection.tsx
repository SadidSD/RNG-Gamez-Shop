import React from 'react';
import { Box, Play } from 'lucide-react';
import Image from 'next/image';

const SocialMediaSection = () => {
    const videoUrl = 'https://www.youtube.com/watch?v=djZhGbDuqpk';
    const videoId = 'djZhGbDuqpk';
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
        <div className="w-full min-h-screen bg-[#F1F1F1] flex items-center justify-center p-10">
            <div className="w-full max-w-[1600px] flex gap-20 items-center">
                {/* Left Column */}
                <div className="w-1/2 flex flex-col gap-8">
                    <div className="flex gap-4">
                        <Box className="w-8 h-8 text-[#B266FF]" />
                        <Box className="w-8 h-8 text-[#B266FF]" />
                        <Box className="w-8 h-8 text-[#B266FF]" />
                    </div>
                    <h2 className="text-[80px] font-bold text-black leading-tight" style={{ fontFamily: 'Europa Grotesk SH' }}>
                        Follow our Social Media
                    </h2>
                    <p className="text-xl text-black max-w-xl leading-relaxed">
                        Subscribe to our youtube & follow our socials for daily updates. Join our growing TCG family and never miss a pull!
                    </p>
                </div>

                {/* Right Column */}
                <div className="w-2/5 flex flex-col gap-8">
                    {/* YouTube Video */}
                    <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-full max-w-2xl aspect-video rounded-[30px] overflow-hidden group cursor-pointer shadow-lg"
                    >
                        <Image
                            src={thumbnailUrl}
                            alt="YouTube Video"
                            fill
                            className="object-cover transition-transform duration-300 scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="bg-red-600 rounded-full p-6 group-hover:scale-110 transition-transform">
                                <Play className="w-12 h-12 text-white fill-white" />
                            </div>
                        </div>
                    </a>

                    {/* Social Icons Placeholder */}
                    <div className="flex gap-6 justify-center">
                        <div className="relative w-32 h-32 bg-gray-300 rounded-[30px] overflow-hidden cursor-pointer group">
                            <Image
                                src="/instagram.png"
                                alt="Instagram"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* White Logo (Default) */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-500 opacity-100 group-hover:opacity-0">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2" fill="none" />
                                    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                                </svg>
                                {/* Color Logo (Hover) */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                                    <defs>
                                        <radialGradient id="instagramGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7 22) rotate(-90) scale(25)">
                                            <stop stopColor="#fdf497" />
                                            <stop offset="0.05" stopColor="#fdf497" />
                                            <stop offset="0.45" stopColor="#fd5949" />
                                            <stop offset="0.6" stopColor="#d6249f" />
                                            <stop offset="0.9" stopColor="#285AEB" />
                                        </radialGradient>
                                    </defs>
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagramGradient)" strokeWidth="2" fill="none" />
                                    <circle cx="12" cy="12" r="4" stroke="url(#instagramGradient)" strokeWidth="2" fill="none" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#instagramGradient)" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative w-32 h-32 bg-gray-300 rounded-[30px] overflow-hidden cursor-pointer group">
                            <Image
                                src="/facebook.png"
                                alt="Facebook"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* White Logo (Default) */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-500 opacity-100 group-hover:opacity-0">
                                    <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.99 5.66 21.12 10.44 21.88V14.89H7.9V12H10.44V9.8C10.44 7.28 11.93 5.89 14.16 5.89C15.23 5.89 16.34 6.08 16.34 6.08V8.56H15.11C13.86 8.56 13.47 9.33 13.47 10.12V12H16.25L15.8 14.89H13.47V21.88C18.25 21.12 21.91 16.99 21.91 12H22Z" fill="white" />
                                    <path d="M15.8 14.89L16.25 12H13.47V10.12C13.47 9.33 13.86 8.56 15.11 8.56H16.34V6.08C16.34 6.08 15.23 5.89 14.16 5.89C11.93 5.89 10.44 7.28 10.44 9.8V12H7.9V14.89H10.44V21.88C11.23 22.01 12.04 22.01 12.83 21.88V14.89H15.8Z" fill="black" />
                                </svg>
                                {/* Color Logo (Hover) */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                                    <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.99 5.66 21.12 10.44 21.88V14.89H7.9V12H10.44V9.8C10.44 7.28 11.93 5.89 14.16 5.89C15.23 5.89 16.34 6.08 16.34 6.08V8.56H15.11C13.86 8.56 13.47 9.33 13.47 10.12V12H16.25L15.8 14.89H13.47V21.88C18.25 21.12 21.91 16.99 21.91 12H22Z" fill="#1877F2" />
                                    <path d="M15.8 14.89L16.25 12H13.47V10.12C13.47 9.33 13.86 8.56 15.11 8.56H16.34V6.08C16.34 6.08 15.23 5.89 14.16 5.89C11.93 5.89 10.44 7.28 10.44 9.8V12H7.9V14.89H10.44V21.88C11.23 22.01 12.04 22.01 12.83 21.88V14.89H15.8Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative w-32 h-32 bg-gray-300 rounded-[30px] overflow-hidden cursor-pointer group">
                            <Image
                                src="/patrion.png"
                                alt="Patreon"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* White Logo (Default) */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-500 opacity-100 group-hover:opacity-0">
                                    <path d="M15.3 5.5C12.8 5.5 10.7 7.6 10.7 10.1C10.7 12.6 12.8 14.7 15.3 14.7C17.8 14.7 19.9 12.6 19.9 10.1C19.9 7.6 17.8 5.5 15.3 5.5ZM4.2 19.5H8.3V5.5H4.2V19.5Z" fill="white" />
                                </svg>
                                {/* Color Logo (Hover) */}
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                                    <path d="M15.3 5.5C12.8 5.5 10.7 7.6 10.7 10.1C10.7 12.6 12.8 14.7 15.3 14.7C17.8 14.7 19.9 12.6 19.9 10.1C19.9 7.6 17.8 5.5 15.3 5.5ZM4.2 19.5H8.3V5.5H4.2V19.5Z" fill="#FF424D" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaSection;
