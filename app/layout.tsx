import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Waste Food Management",
  description: "Connect donors, NGOs, volunteers, and admins to reduce food waste together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const stored = localStorage.getItem('theme-mode');
              const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = stored === 'dark' || stored === 'light' ? stored : (preferredDark ? 'dark' : 'light');
              document.documentElement.dataset.theme = theme;
            } catch (e) {}
          `}
        </Script>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
