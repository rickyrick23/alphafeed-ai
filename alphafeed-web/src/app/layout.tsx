// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "AlphaFeed Terminal",
  description: "AI Financial Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-jup-bg h-screen w-screen overflow-hidden text-jup-text flex flex-col">
        
        {/* 1. NAVBAR (Fixed at Top) */}
        <Navbar />

        {/* 2. FLEX CONTAINER (Sidebar + Main Content) */}
        {/* This 'flex' class is what puts them SIDE-BY-SIDE instead of overlapping */}
        <div className="flex flex-1 pt-16 h-full overflow-hidden">
          
          <Sidebar />

          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-jup-bg relative">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}