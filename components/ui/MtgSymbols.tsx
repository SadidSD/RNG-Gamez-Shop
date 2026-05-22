import React from 'react';

const symbolMap: { [key: string]: { bg: string, text: string, label?: string } } = {
    '{W}': { bg: '#F9FAF1', text: '#000', label: 'W' },
    '{U}': { bg: '#0E68AB', text: '#FFF', label: 'U' },
    '{B}': { bg: '#150B00', text: '#FFF', label: 'B' },
    '{R}': { bg: '#D3202A', text: '#FFF', label: 'R' },
    '{G}': { bg: '#00733E', text: '#FFF', label: 'G' },
    '{C}': { bg: '#CCCCCC', text: '#333', label: 'C' },
    '{T}': { bg: '#444', text: '#FFF', label: 'T' },
    '{Q}': { bg: '#444', text: '#FFF', label: 'Q' },
    '{S}': { bg: '#FFF', text: '#333', label: 'S' },
    '{E}': { bg: '#F0AD4E', text: '#000', label: 'E' },
};

interface MtgSymbolsProps {
    text: string;
    className?: string;
}

export const MtgSymbols: React.FC<MtgSymbolsProps> = ({ text, className = "" }) => {
    if (!text) return null;

    // Pattern to match {T}, {1}, {C}, {W/U}, etc.
    const parts = text.split(/(\{[^}]+\})/g);

    return (
        <span className={`inline-flex flex-wrap items-center gap-0.5 leading-normal ${className}`}>
            {parts.map((part, i) => {
                const match = part.match(/^\{([^}]+)\}$/);
                if (!match) return <span key={i} className="whitespace-pre-wrap">{part}</span>;

                const symbol = part.toUpperCase();
                const config = symbolMap[symbol];

                // Generic number handling: {1}, {2}, {10}
                const isNumber = /^\d+$/.test(match[1]);

                if (config || isNumber) {
                    return (
                        <span
                            key={i}
                            className="inline-flex items-center justify-center w-[1.1em] h-[1.1em] rounded-full text-[0.8em] font-black mx-0.5 mt-[-0.2em] align-middle shadow-sm ring-1 ring-black/10"
                            style={{
                                backgroundColor: config?.bg || '#EEE',
                                color: config?.text || '#333',
                                verticalAlign: 'middle'
                            }}
                        >
                            {config?.label || match[1]}
                        </span>
                    );
                }

                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};
