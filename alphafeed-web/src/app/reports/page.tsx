"use client";
import { useState, useEffect } from 'react';
import { fetchReports, generateReport, getDownloadUrl } from '@/lib/api';
import { FileText, Download, Plus, Clock } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const data = await fetchReports();
    setReports(data);
  }

  async function handleGenerate() {
    setLoading(true);
    await generateReport();
    await loadReports();
    setLoading(false);
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FileText className="text-jup-lime w-8 h-8" /> 
                Saved Reports
            </h1>
            <p className="text-gray-400 text-sm mt-2">
                Archive of your generated AI analysis and portfolio snapshots.
            </p>
        </div>
        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-jup-lime hover:bg-[#b8e866] text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
        >
            {loading ? "Generating..." : "Generate New Report"}
            {!loading && <Plus size={18}/>}
        </button>
      </div>

      {/* REPORT LIST */}
      <div className="bg-[#1c2128] border border-jup-border rounded-xl flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 border-b border-jup-border bg-[#0d1016]">
                <span className="text-xs font-bold text-gray-500 uppercase">File Archive</span>
            </div>

            <div className="divide-y divide-gray-800">
                {reports.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">No reports generated yet.</div>
                ) : (
                    reports.map((file) => (
                        <div key={file.name} className="flex items-center justify-between p-4 hover:bg-[#2a303c] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm group-hover:text-jup-lime transition-colors">
                                        {file.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Clock size={10}/> {file.created}</span>
                                        <span>•</span>
                                        <span>{file.size}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <a 
                                href={getDownloadUrl(file.name)} 
                                target="_blank"
                                className="text-gray-400 hover:text-white p-2 border border-gray-700 hover:border-white rounded-lg transition-all"
                            >
                                <Download size={18} />
                            </a>
                        </div>
                    ))
                )}
            </div>
      </div>
    </div>
  );
}