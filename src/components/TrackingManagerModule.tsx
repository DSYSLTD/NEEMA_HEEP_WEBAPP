import React, { useState, useEffect } from 'react';
import { 
  Target, Save, Plus, Trash2, CheckCircle2, Activity, Play, Code, Power, RefreshCw, AlertCircle 
} from 'lucide-react';
import { blogStore, TrackingPixelItem } from '../lib/blogStore';
import { addPixelLog, getPixelLogs, PixelLogEntry, initializeTrackingScripts } from '../services/trackingService';

export default function TrackingManagerModule() {
  const [pixels, setPixels] = useState<TrackingPixelItem[]>([]);
  const [logs, setLogs] = useState<PixelLogEntry[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<TrackingPixelItem | null>(null);
  
  // New Pixel modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState('meta');
  const [newPixelId, setNewPixelId] = useState('');
  const [newScript, setNewScript] = useState('');

  useEffect(() => {
    setPixels(blogStore.getTrackingPixels());
    setLogs(getPixelLogs());

    const handleLogAdded = () => {
      setLogs([...getPixelLogs()]);
    };

    window.addEventListener('neema_pixel_log_added', handleLogAdded);
    return () => window.removeEventListener('neema_pixel_log_added', handleLogAdded);
  }, []);

  const handlePixelChange = (id: string, field: keyof TrackingPixelItem, value: any) => {
    setPixels((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          if (field === 'enabled') {
            updated.status = value ? 'Active' : 'Inactive';
          }
          return updated;
        }
        return p;
      })
    );
    setSavedSuccess(false);
  };

  const handleSave = () => {
    blogStore.saveTrackingPixels(pixels);
    initializeTrackingScripts();
    setSavedSuccess(true);
    addPixelLog('Admin Manager', 'Tracking Configuration Saved & Reloaded', 'Success');
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleTestFirePixel = (pixel: TrackingPixelItem) => {
    addPixelLog(pixel.name, `Test Fire Event (${pixel.pixelId || 'Custom Code'})`, 'Triggered 200 OK');
    alert(`Test event fired for ${pixel.name}!`);
  };

  const handleDeletePixel = (id: string) => {
    if (confirm('Are you sure you want to delete this pixel configuration?')) {
      const updated = pixels.filter((p) => p.id !== id);
      setPixels(updated);
      blogStore.saveTrackingPixels(updated);
      initializeTrackingScripts();
      addPixelLog('Admin Manager', 'Pixel Removed', 'Deleted');
    }
  };

  const handleAddCustomPixel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPixel: TrackingPixelItem = {
      id: `px-custom-${Date.now()}`,
      name: newName.trim(),
      platform: newPlatform,
      pixelId: newPixelId.trim(),
      customScript: newScript.trim(),
      enabled: true,
      status: 'Active'
    };

    const updated = [...pixels, newPixel];
    setPixels(updated);
    blogStore.saveTrackingPixels(updated);
    initializeTrackingScripts();
    setShowAddModal(false);
    setNewName('');
    setNewPixelId('');
    setNewScript('');
    setSavedSuccess(true);
    addPixelLog(newPixel.name, 'New Custom Pixel Added', 'Active');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activeCount = pixels.filter((p) => p.enabled).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] p-6 md:p-8 rounded-2xl border border-[#C0991B]/30 text-white shadow-lg space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-black text-xl md:text-2xl text-white uppercase flex items-center gap-2.5">
            <Target className="w-6 h-6 text-[#C0991B] shrink-0" /> PIXEL ACTIVATION MODULE
          </h3>
          <span className="px-3.5 py-1.5 bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 rounded-full text-xs font-black flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C0991B] animate-pulse"></span>
            {activeCount} Pixels Active
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Manual input or code/link paste for platform pixels (Meta, Google, TikTok, LinkedIn, Twitter/X, Custom). When saved, pixel code and noscript fallbacks are automatically injected into the website.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] text-xs font-black uppercase rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Pixel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black uppercase rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C0991B]" /> Save & Inject
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-extrabold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Tracking pixels configuration updated and re-loaded across the website!</span>
        </div>
      )}

      {/* Grid of Configured Pixels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            className={`bg-white rounded-2xl border-t-4 border-x border-b shadow-xs p-5 transition-all flex flex-col justify-between space-y-4 ${
              pixel.enabled
                ? 'border-t-[#C0991B] border-gray-200'
                : 'border-t-gray-400 border-gray-200 opacity-75'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#074504] uppercase flex items-center gap-1.5">
                  <Activity className={`w-3.5 h-3.5 ${pixel.enabled ? 'text-[#C0991B]' : 'text-gray-400'}`} />
                  {pixel.name}
                </span>

                <button
                  type="button"
                  onClick={() => handlePixelChange(pixel.id, 'enabled', !pixel.enabled)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                    pixel.enabled ? 'bg-[#074504]' : 'bg-gray-300'
                  }`}
                  title={pixel.enabled ? 'Disable Pixel' : 'Enable Pixel'}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      pixel.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Placement Indicator & ID Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Pixel / Measurement ID
                  </label>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {pixel.platform === 'custom_body' ? 'Target: <body>' : 'Target: <head>'}
                  </span>
                </div>
                <input
                  type="text"
                  value={pixel.pixelId || ''}
                  onChange={(e) => handlePixelChange(pixel.id, 'pixelId', e.target.value)}
                  placeholder="e.g. G-XXXXXXX or 123456789"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              {/* Custom Script Area Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedPixel(selectedPixel?.id === pixel.id ? null : pixel)}
                  className="text-[11px] font-bold text-emerald-800 hover:text-[#074504] flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  {pixel.customScript ? 'Edit Manual Script / Link' : 'Paste Manual Code or Link'}
                </button>

                {selectedPixel?.id === pixel.id && (
                  <div className="mt-2 space-y-2 animate-in fade-in duration-200">
                    <textarea
                      rows={4}
                      value={pixel.customScript || ''}
                      onChange={(e) => handlePixelChange(pixel.id, 'customScript', e.target.value)}
                      placeholder="Paste script URL, <script>...</script>, <link...>, or <noscript> tag provided by platform. Automatically injected on save!"
                      className="w-full p-2 bg-gray-900 text-[#C0991B] font-mono text-[10px] rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C0991B]"
                    />
                    <p className="text-[9px] text-gray-500 font-medium italic">
                      Automated Placement: Script tags &amp; link tags are injected into &lt;head&gt; while noscript/iframe fallbacks are placed in &lt;body&gt;.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Status & Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span
                className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                  pixel.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {pixel.enabled ? 'ACTIVE' : 'INACTIVE'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestFirePixel(pixel)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-[#826507] rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-colors cursor-pointer"
                  title="Test Fire Pixel Event"
                >
                  <Play className="w-3 h-3 fill-current" /> Test Fire
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePixel(pixel.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Pixel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Add Custom Pixel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C0991B]" /> Add Custom Pixel / Tracking Snippet
            </h3>

            <form onSubmit={handleAddCustomPixel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pixel / Tracker Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Meta Ads Conversion, Snapchat Pixel, Hotjar..."
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Platform Type</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#074504]"
                >
                  <option value="meta">Meta / Facebook</option>
                  <option value="google">Google Analytics / GTM</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="custom_head">Custom Header Script</option>
                  <option value="custom_body">Custom Body / Footer Script</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pixel ID (Optional)</label>
                <input
                  type="text"
                  value={newPixelId}
                  onChange={(e) => setNewPixelId(e.target.value)}
                  placeholder="Platform Pixel ID string"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={4}
                  value={newScript}
                  onChange={(e) => setNewScript(e.target.value)}
                  placeholder="Paste <script>...</script> code provided by platform"
                  className="w-full p-2.5 bg-gray-900 text-[#C0991B] font-mono text-[10px] rounded-xl border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C0991B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#074504] hover:bg-[#053203] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  Add Pixel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
