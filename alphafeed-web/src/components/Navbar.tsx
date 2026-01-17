// src/components/Navbar.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Globe, Layout, LineChart, FileText, Brain, LogIn, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  // In a real app, you would check a "isLoggedIn" state here.
  const isLoggedIn = false; 

  return (
    // FIX IS HERE: Changed 'z-50' to 'z-[60]'
    // This forces the Navbar to sit ON TOP of the Sidebar (which is z-50)
    <nav className="glass-panel fixed top-0 w-full z-[60] h-16 flex items-center justify-between px-4 lg:px-6 border-b border-jup-border bg-jup-bg">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-jup-lime flex items-center justify-center shadow-[0_0_10px_rgba(199,242,132,0.4)]">
            <span className="text-black font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">AlphaFeed</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavItem href="/" icon={<Layout size={18} />} label="Analysis" active={pathname === '/'} />
          <NavItem href="/intelligence" icon={<Brain size={18} />} label="Intelligence" active={pathname === '/intelligence'} />
          <NavItem href="/live" icon={<Globe size={18} />} label="Live Feed" active={pathname === '/live'} />
          <NavItem href="/charts" icon={<LineChart size={18} />} label="Pro Charts" active={pathname === '/charts'} />
          <NavItem href="/portfolio" icon={<FileText size={18} />} label="Portfolio" active={pathname === '/portfolio'} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-[#0d1016] border border-jup-border rounded-xl px-4 py-2 w-64 focus-within:w-80 transition-all focus-within:border-jup-lime">
          <Search className="text-gray-500" size={16} />
          <input type="text" placeholder="Search Ticker..." className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-full text-white placeholder-gray-600" />
        </div>

        {/* LOGIN BUTTON */}
        {isLoggedIn ? (
            <button className="flex items-center gap-2 bg-[#1c2128] hover:bg-[#2a303c] border border-jup-border text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                <User size={14} className="text-jup-lime" /> Rohit M.
            </button>
        ) : (
            <Link href="/login">
                <button className="flex items-center gap-2 bg-jup-lime hover:bg-[#b8e866] text-black px-4 py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(199,242,132,0.1)] transition-all active:scale-95">
                    <LogIn size={14} /> CONNECT TERMINAL
                </button>
            </Link>
        )}
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active, href }: { icon: any, label: string, active?: boolean, href: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-[#1c2128] text-jup-lime border border-jup-border' : 'text-gray-400 hover:bg-[#1c2128] hover:text-white'}`}>
      {icon} {label}
    </Link>
  );
}