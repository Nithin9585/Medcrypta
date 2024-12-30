import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/ui/footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Medcrypta | Blockchain-Based Health Platform",
  description: "Medcrypta is a blockchain-based platform offering secure and transparent healthcare solutions.",
  keywords: "blockchain, healthcare, health tech, secure healthcare, Medcrypta, medical blockchain platform",
  author: "Medcrypta Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />

        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/path-to-your-og-image.jpg" />
        <meta property="og:url" content="https://www.medcrypta.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/path-to-your-twitter-image.jpg" />

        <link rel="canonical" href="https://www.medcrypta.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Medcrypta",
              url: "https://www.medcrypta.com",
              logo: "https://www.medcrypta.com/logo.png",
              description: "Medcrypta is a blockchain-based platform offering secure and transparent healthcare solutions.",
              sameAs: [
                "https://www.facebook.com/Medcrypta",
                "https://twitter.com/Medcrypta",
                "https://www.linkedin.com/company/medcrypta",
              ],
            }),
          }}
        ></script>
        
        {/* Fonts and Styles */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
