import type { Metadata } from "next";
import { Space_Grotesk, Cinzel, Geist_Mono } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIMELUX | Haute Horlogerie & Limited Edition Timepieces",
  description:
    "Swiss mechanical timepieces crafted in strictly limited numbered editions. Hand-finished Haute Horlogerie from the Vallée de Joux atelier.",
  keywords: [
    "Haute Horlogerie",
    "Swiss Watchmaking",
    "Limited Edition Watches",
    "Mechanical Chronograph",
    "Tourbillon",
    "Geneva Seal",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${cinzel.variable} ${geistMono.variable} antialiased dark`}
    >
      <body className="min-h-screen min-h-screen bg-[var(--midnight-black)] text-[var(--headline-white)] font-sans selection:bg-[var(--champagne-gold)] selection:text-[var(--midnight-black)]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
