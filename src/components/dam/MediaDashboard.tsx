import React from 'react';
import { 
  BarChart3, Image as ImageIcon, Video, Music, FileText, 
  Archive, UploadCloud, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { damStore } from '../../lib/damStore';
import { MediaItem } from '../../types/dam';

interface Props {
  onNavigateSubmodule: (submodule: any) => void;
  onPreviewMedia: (item: MediaItem) => void;
}

export function MediaDashboard({ onNavigateSubmodule, onPreviewMedia }: Props) {
  const analytics = damStore.getAnalytics();

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const kpis = [
    {
      title: 'Images',
      value: analytics.countByType.image || 0,
      subtitle: formatSize(analytics.sizeByType.image || 0),
      icon: ImageIcon,
      color: 'bg-emerald-100 text-[#074504]'
    },
    {
      title: 'Videos',
      value: analytics.countByType.video || 0,
      subtitle: formatSize(analytics.sizeByType.video || 0),
      icon: Video,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Audio',
      value: analytics.countByType.audio || 0,
      subtitle: formatSize(analytics.sizeByType.audio || 0),
      icon: Music,
      color: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Documents',
      value: analytics.countByType.document || 0,
      subtitle: formatSize(analytics.sizeByType.document || 0),
      icon: FileText,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Archives',
      value: analytics.countByType.archive || 0,
      subtitle: formatSize(analytics.sizeByType.archive || 0),
      icon: Archive,
      color: 'bg-rose-100 text-rose-700'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-br from-[#074504] via-[#053203] to-[#032002] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#C0991B]/30">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-[#C0991B]/20 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-[#C0991B] border border-[#C0991B]/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Digital Assets Monitoring
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Digital Asset Analytics
          </h2>
          <p className="text-xs text-white/80 font-medium max-w-xl">
            Real-time monitoring of corporate asset storage, AI accessibility compliance, and media bandwidth usage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => onNavigateSubmodule('uploads')}
            className="px-5 py-2.5 bg-[#C0991B] hover:bg-[#a38012] text-[#074504] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" /> Quick Upload
          </button>
          <button
            onClick={() => onNavigateSubmodule('library')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Browse Library <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3 hover:border-[#074504]/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-gray-500 font-bold">
                  {kpi.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#074504]" /> Media Category Breakdown
          </h3>
          <span className="text-[10px] font-bold text-gray-500">By File Volume & Disk Usage</span>
        </div>

        <div className="space-y-3.5">
          {[
            { type: 'Images', count: analytics.countByType.image || 0, size: analytics.sizeByType.image || 0, color: 'bg-[#074504]' },
            { type: 'Videos', count: analytics.countByType.video || 0, size: analytics.sizeByType.video || 0, color: 'bg-purple-600' },
            { type: 'Audio', count: analytics.countByType.audio || 0, size: analytics.sizeByType.audio || 0, color: 'bg-amber-500' },
            { type: 'Documents', count: analytics.countByType.document || 0, size: analytics.sizeByType.document || 0, color: 'bg-blue-600' },
            { type: 'Archives', count: analytics.countByType.archive || 0, size: analytics.sizeByType.archive || 0, color: 'bg-rose-500' }
          ].map((cat, i) => {
            const pct = analytics.totalSize > 0 ? Math.round((cat.size / analytics.totalSize) * 100) : 0;
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800">{cat.type} ({cat.count} files)</span>
                  <span className="text-gray-600 font-mono">{formatSize(cat.size)} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${cat.color} h-full transition-all duration-500`} style={{ width: `${Math.max(pct, 4)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
