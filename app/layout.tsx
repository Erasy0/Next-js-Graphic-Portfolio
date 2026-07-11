import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/navbar";
import NavbarShell from "../components/NavbarShell"; // ← add this

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
        <Providers>
          {/* Navbar floats above the snap container */}
          <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto">
              <Navbar />
            </div>
          </div>
          <NavbarShell />
          {children}
        </Providers>
      </body>
    </html>
  );
}