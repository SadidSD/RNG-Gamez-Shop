import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rnggamez.com'),
  title: {
    default: "RNG Gamez | The Ultimate TCG Store",
    template: "%s | RNG Gamez"
  },
  description: "Buy and sell Magic: The Gathering and Pokémon cards, booster boxes, and card accessories. Best trade-in value on our buylist!",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "RNG Gamez | The Ultimate TCG Store",
    description: "Buy and sell Magic: The Gathering and Pokémon cards, booster boxes, and card accessories.",
    url: "https://rnggamez.com",
    siteName: "RNG Gamez",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "RNG Gamez Storefront"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RNG Gamez | The Ultimate TCG Store",
    description: "Buy and sell Magic: The Gathering and Pokémon cards.",
    images: ["/images/og-default.jpg"],
  }
};


import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
