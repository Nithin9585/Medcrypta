'use client';

import { SessionProvider } from 'next-auth/react';  // Import for managing session state
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/ui/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@radix-ui/react-toast';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-300`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative w-full h-full overflow-hidden">
              <Navbar />
              <ToastProvider>
                <main>{children}</main>
              </ToastProvider>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
