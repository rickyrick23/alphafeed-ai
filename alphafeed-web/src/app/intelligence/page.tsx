// src/app/intelligence/page.tsx
import IntelligenceEngine from "@/components/IntelligenceEngine";
import ResearchSidebar from "@/components/ResearchSidebar";

export default function IntelligencePage() {
  return (
    <div className="h-full flex flex-col">
      
      {/* HEADER (Optional title bar) */}
      <div className="h-12 border-b border-jup-border flex items-center px-6 bg-[#13171f]">
         <span className="text-sm font-bold text-gray-400 mr-2">Session:</span>
         <span className="text-sm font-bold text-white">Market Analysis - NVDA & Macro</span>
         <div className="ml-auto flex items-center gap-4">
             <span className="text-xs text-jup-lime flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-jup-lime animate-pulse" />
                Online
             </span>
         </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* LEFT: CHAT AREA (8 cols) */}
        <div className="col-span-12 lg:col-span-9 h-full min-h-0 relative bg-jup-bg">
            <IntelligenceEngine />
        </div>

        {/* RIGHT: CONTEXT SIDEBAR (4 cols) */}
        <div className="hidden lg:block col-span-3 h-full min-h-0 border-l border-jup-border bg-[#0d1016] p-4">
            <ResearchSidebar />
        </div>

      </div>
    </div>
  );
}