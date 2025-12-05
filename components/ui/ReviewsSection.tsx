"use client";

import React, { useEffect } from 'react';

const ReviewsSection = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            const script = document.createElement('script');
            script.src = "https://freesellertools.com/load_tool/get_feedback.php?user=RNG-gamez&site=3&design=grid&items=10&feedback_type=FeedbackReceived";
            script.async = true;
            document.body.appendChild(script);
        }, 100);

        return () => {
            clearTimeout(timer);
            // Note: We can't easily remove the script tag created inside the timeout if it hasn't run yet, 
            // but we can try to find and remove it if needed, or just let it be since it's external.
            // For robustness, we could track the script element in a ref, but for this simple fix, 
            // clearing the timeout is the most important part to prevent race conditions on unmount.
            const scripts = document.querySelectorAll('script[src*="freesellertools.com"]');
            scripts.forEach(s => s.remove());
        };
    }, []);

    return (
        <div className="w-full py-32 bg-[#F1F1F1] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-[1600px] mx-auto px-10 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-[72px] font-bold text-black leading-tight mb-6 uppercase" style={{ fontFamily: 'Europa Grotesk SH' }}>
                        WHAT PEOPLE SAY
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trusted by collectors worldwide. Here's what our community has to say about their experience.
                    </p>
                </div>

                {/* Widget Container */}
                <a
                    href="https://www.ebay.com/str/rnggamez?_tab=feedback"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[400px] flex justify-center cursor-pointer transition-opacity hover:opacity-80"
                >
                    <div id="fst_feedback" className="w-full">
                        <img
                            src="https://freesellertools.com/load_tool/images/loader.gif"
                            title="loading items"
                            alt="Loading reviews..."
                            className="mx-auto"
                        />
                    </div>
                </a>
            </div>
        </div>
    );
};

export default ReviewsSection;
