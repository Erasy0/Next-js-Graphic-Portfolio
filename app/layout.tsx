// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Erastus Shindinge — Portfolio",
  description: "Graphic designer and software developer based in Windhoek, Namibia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-black h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          Providers is a "use client" boundary.
          It renders:
            1. LenisProvider  — attaches smooth scrolling to .snap-container
            2. ScrollProgressBar — fixed top bar, z-index 9999
            3. {children}    — the rest of the app
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}