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
      <body className="antialiased bg-[#0d1016] h-screen w-screen overflow-hidden text-white flex flex-col">
        
        {/* GLOBAL NAVBAR */}
        <Navbar />

        {/* MAIN CONTAINER */}
        <div className="flex flex-1 pt-16 h-full overflow-hidden">
          
          {/* GLOBAL SIDEBAR */}
          <Sidebar />

          {/* PAGE CONTENT - Must be flex to support Dashboard's internal sidebar */}
          <main className="flex-1 flex overflow-hidden bg-[#0d1016] relative">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}