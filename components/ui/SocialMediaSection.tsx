import React from 'react';
import { Box } from 'lucide-react';

const SocialMediaSection = () => {
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
                <div className="w-1/2 flex flex-col gap-8">
                    {/* Video Placeholder */}
                    <div className="w-full aspect-video bg-gray-300 rounded-[30px]"></div>

                    {/* Social Icons Placeholder */}
                    <div className="flex gap-6 justify-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-[30px]"></div>
                        <div className="w-32 h-32 bg-gray-300 rounded-[30px]"></div>
                        <div className="w-32 h-32 bg-gray-300 rounded-[30px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaSection;
