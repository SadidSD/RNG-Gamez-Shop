
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isActive?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                        <Home size={16} />
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight size={16} className="text-gray-400 mx-1" />
                        {item.href && !item.isActive ? (
                            <Link
                                href={item.href}
                                className="text-gray-500 hover:text-gray-900 transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-semibold" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
