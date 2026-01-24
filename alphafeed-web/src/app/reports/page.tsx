"use client";
import { useState, useEffect } from 'react';
import { FileText, Plus, Download, Trash2, Clock, Loader2, FileBarChart, CheckCircle } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'Market Analysis' | 'Portfolio Snapshot' | 'Risk Assessment';
  date: string;
  size: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  // Load saved reports from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('alphafeed_reports');
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      // Demo data if empty
      setReports([
        { id: '1', name: 'Weekly_Market_Outlook_Jan24.pdf', type: 'Market Analysis', date: '2026-01-15 09:30 AM', size: '1.2 MB' },
        { id: '2', name: 'Portfolio_Risk_Audit_Q1.pdf', type: 'Risk Assessment', date: '2026-01-10 04:15 PM', size: '850 KB' }
      ]);
    }
  }, []);

  // Save to local storage whenever reports change
  useEffect(() => {
    localStorage.setItem('alphafeed_reports', JSON.stringify(reports));
  }, [reports]);

  const generateReport = () => {
    setIsGenerating(true);

    // Simulate AI Processing Steps
    setLoadingStep("Aggregating Market Data...");
    setTimeout(() => setLoadingStep("Analyzing Portfolio Correlation..."), 1500);
    setTimeout(() => setLoadingStep("Synthesizing Neural Insights..."), 3000);
    setTimeout(() => setLoadingStep("Finalizing PDF Document..."), 4500);

    setTimeout(() => {
      const newReport: Report = {
        id: Math.random().toString(36).substr(2, 9),
        name: `AlphaFeed_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        type: 'Portfolio Snapshot',
        date: new Date().toLocaleString(),
        size: '2.4 MB'
      };

      setReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
      setLoadingStep("");
    }, 5500);
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const downloadReport = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reports/download/${name}`);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.href = url;
      element.download = name;
      document.body.appendChild(element);
      element.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(element);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please ensure backend is running.");
    }
  };

  return (
    <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-transparent relative">
      <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#d2fc52]/10 rounded-xl border border-[#d2fc52]/20 shadow-[0_0_15px_rgba(210,252,82,0.1)]">
                <FileText size={32} className="text-[#d2fc52]" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Saved Reports</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Archive of your generated AI analysis and portfolio snapshots.
            </p>
          </div>

          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="bg-[#d2fc52] hover:bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(210,252,82,0.2)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] justify-center"
          >
            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
            {isGenerating ? "Processing..." : "Generate New Report"}
          </button>
        </div>

        {/* GENERATION STATUS CARD (Only visible when generating) */}
        {isGenerating && (
          <div className="bg-[#161b22] border border-[#d2fc52]/30 rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
              <div className="h-full bg-[#d2fc52] animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#d2fc52]/10 p-3 rounded-full">
                <Loader2 size={24} className="text-[#d2fc52] animate-spin" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Analysis in Progress</h3>
                <p className="text-[#d2fc52] font-mono text-sm">{loadingStep}</p>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS LIST */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
          <div className="p-5 border-b border-[#30363d] bg-[#0d1016]/50 flex items-center justify-between backdrop-blur-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">File Archive</h3>
            <span className="text-[10px] bg-[#2a303c] text-white px-2 py-1 rounded font-bold">{reports.length} Documents</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#30363d]">
            {reports.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 opacity-50 min-h-[300px]">
                <FileBarChart size={64} />
                <p className="text-sm uppercase tracking-widest">No reports generated yet</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-5 flex items-center justify-between hover:bg-[#2a303c]/20 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[#2a303c] flex items-center justify-center text-red-400 border border-[#30363d] group-hover:border-red-400/50 transition-colors shadow-sm">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base group-hover:text-[#d2fc52] transition-colors">{report.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {report.date}
                        </span>
                        <span className="text-[10px] font-bold bg-[#2a303c] text-gray-300 px-2 py-0.5 rounded uppercase">{report.type}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{report.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                    <button
                      onClick={() => downloadReport(report.name)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#d2fc52] text-black rounded-lg text-xs font-bold hover:bg-white transition-colors shadow-lg"
                    >
                      <Download size={14} /> Download
                    </button>
                    <button
                      onClick={() => deleteReport(report.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <style jsx>{`
        @keyframes loading {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 50%; margin-left: 25%; }
            100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}