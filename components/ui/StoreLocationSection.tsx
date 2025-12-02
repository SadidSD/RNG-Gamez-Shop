import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

const StoreLocationSection = () => {
    // Using a standard embed URL format for the specific address
    const mapSrc = "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=2325%20Plainfield%20Ave,%20South%20Plainfield,%20NJ%2007080+(RNG%20Gamez)&t=&z=15&ie=UTF8&iwloc=B&output=embed";

    return (
        <div className="relative w-full h-[600px] bg-[#F1F1F1]">
            {/* Full Width Map */}
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
            ></iframe>

            {/* Overlay Card Container */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-[160px] left-3 w-[320px] rounded-[20px] py-8 px-6 shadow-2xl pointer-events-auto"
                    style={{
                        background: 'linear-gradient(to bottom left, rgba(160, 77, 255, 0.5) 0%, rgba(255, 255, 255, 0.0) 100%)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
                    }}
                >
                    <h2 className="text-[28px] font-bold text-[#0D1420] leading-tight mb-4" style={{ fontFamily: 'Europa Grotesk SH' }}>
                        South Plainfield Location
                    </h2>

                    <div className="flex flex-col gap-3">
                        {/* Phone */}
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-black fill-black" />
                            <p className="text-base font-bold text-[#0D1420]">(908) 483-2730</p>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-black fill-black" />
                            <p className="text-base font-bold text-[#0D1420] break-all">rnggameztcg@gmail.com</p>
                        </div>

                        {/* Hours */}
                        <div className="flex items-start gap-3 mt-1">
                            <Clock className="w-5 h-5 text-black" />
                            <div className="flex flex-col">
                                <p className="text-sm font-bold text-[#0D1420]">Tues - Fri: 2:00 pm - 10:00 PM</p>
                                <p className="text-sm font-bold text-[#0D1420]">Sat - Sun: 1:00 pm - 10:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreLocationSection;
