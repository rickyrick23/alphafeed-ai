"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Globe, Layout, LineChart, FileText, Brain, LogIn, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  // In a real app, you would check a "isLoggedIn" state here.
  const isLoggedIn = false; 

  return (
    // NAVBAR CONTAINER
    // z-[60] ensures it stays ABOVE the sidebar and other content
    <nav className="glass-panel fixed top-0 w-full z-[60] h-16 flex items-center justify-between px-4 lg:px-6 border-b border-[#30363d] bg-[#0d1016]">
      
      {/* LEFT: LOGO & TABS */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-[#d2fc52] flex items-center justify-center shadow-[0_0_15px_rgba(210,252,82,0.3)]">
            <span className="text-black font-black text-lg">AF</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">AlphaFeed</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1">
          {/* These Links match the folders in your 'src/app' directory:
             /             -> src/app/page.tsx (Dashboard)
             /intelligence -> src/app/intelligence/page.tsx (AI Chat)
             /live         -> src/app/live/page.tsx (News)
             /charts       -> src/app/charts/page.tsx (TradingView)
             /portfolio    -> src/app/portfolio/page.tsx (Assets)
          */}
          <NavItem href="/" icon={<Layout size={16} />} label="Analysis" active={pathname === '/'} />
          <NavItem href="/intelligence" icon={<Brain size={16} />} label="Intelligence" active={pathname.startsWith('/intelligence')} />
          <NavItem href="/live" icon={<Globe size={16} />} label="Live Feed" active={pathname.startsWith('/live')} />
          <NavItem href="/charts" icon={<LineChart size={16} />} label="Pro Charts" active={pathname.startsWith('/charts')} />
          <NavItem href="/portfolio" icon={<FileText size={16} />} label="Portfolio" active={pathname.startsWith('/portfolio')} />
        </div>
      </div>

      {/* RIGHT: SEARCH & LOGIN */}
      <div className="flex items-center gap-4">
        {/* Search Bar (Visual Only for now - typically Global Search) */}
        <div className="hidden lg:flex items-center bg-[#1c2128] border border-[#30363d] rounded-xl px-4 py-1.5 w-64 focus-within:w-72 transition-all focus-within:border-[#d2fc52]">
          <Search className="text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Search Ticker (e.g. NVDA)..." 
            className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-full text-white placeholder-gray-600" 
          />
        </div>

        {/* LOGIN STATE */}
        {isLoggedIn ? (
            <button className="flex items-center gap-2 bg-[#1c2128] hover:bg-[#2a303c] border border-[#30363d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                <User size={14} className="text-[#d2fc52]" /> Rohit M.
            </button>
        ) : (
            <Link href="/login">
                <button className="flex items-center gap-2 bg-[#d2fc52] hover:bg-white text-black px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all active:scale-95">
                    <LogIn size={14} /> CONNECT TERMINAL
                </button>
            </Link>
        )}
      </div>
    </nav>
  );
}

// Helper Component for Nav Links
function NavItem({ icon, label, active, href }: { icon: any, label: string, active?: boolean, href: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${active ? 'bg-[#2a303c] text-[#d2fc52]' : 'text-gray-400 hover:bg-[#1c2128] hover:text-white'}`}>
      {icon} {label}
    </Link>
  );
}