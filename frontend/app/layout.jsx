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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-300`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative w-full flex flex-col flex-grow">
                <Navbar />
                <ToastProvider>
                  <main className="flex-grow">{children}</main>
                </ToastProvider>
                <Footer className="mt-auto" />
              </div>
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
