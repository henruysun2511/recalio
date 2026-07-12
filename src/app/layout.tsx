import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SITE, SITE_OG } from "@/constants/site";

const geistSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#D97D56",
};

export const metadata: Metadata = {
    title: {
        default: SITE.title,
        template: `%s — ${SITE.name}`,
    },
    description: SITE.description,
    keywords: [...SITE.keywords],
    authors: [{ name: SITE.author }],
    metadataBase: new URL(SITE.url),
    openGraph: SITE_OG,
    twitter: {
        card: "summary_large_image",
        title: SITE.title,
        description: SITE.description,
    },
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
    manifest: "/manifest.json",
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
        >
            <body className="min-h-screen">
                <QueryProvider>
                    <AuthProvider>
                        <TooltipProvider delayDuration={100}>
                            {children}
                            <Toaster position="top-right" richColors />
                        </TooltipProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
