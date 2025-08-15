import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Ecobazar - Modern E-Commerce Store",
    description: "Discover premium products at Ecobazar. Shop the latest trends with secure payments and fast shipping.",
    keywords: ["e-commerce", "online shopping", "premium products", "modern store", "Ecobazar"],
    authors: [{ name: "Ecobazar" }],
    creator: "Ecobazar",
    publisher: "Ecobazar",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("http://localhost:3000"),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "http://localhost:3000",
        title: "Ecobazar - Modern E-Commerce Store",
        description: "Discover premium products at Ecobazar. Shop the latest trends with secure payments and fast shipping.",
        siteName: "Ecobazar",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ecobazar - Modern E-Commerce Store",
        description: "Discover premium products at Ecobazar. Shop the latest trends with secure payments and fast shipping.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#1B5FFE" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AppProvider>
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                    <Toaster richColors position="bottom-center" />
                </AppProvider>
            </body>
        </html>
    );
}
