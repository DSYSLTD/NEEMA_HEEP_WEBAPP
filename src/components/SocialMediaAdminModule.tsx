import React, { useState, useEffect } from 'react';
import { 
  Share2, Save, Plus, Trash2, CheckCircle2, ExternalLink, RefreshCw, Eye, Globe, X,
  MessageCircle, Code, Database, Smartphone, Settings, Check
} from 'lucide-react';
import { blogStore, SocialLinkItem, WhatsAppSettings } from '../lib/blogStore';
import { renderPlatformIcon, HeaderSocialIcons, FooterSocialIcons } from './SocialIcons';

export default function SocialMediaAdminModule() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [waSavedSuccess, setWaSavedSuccess] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // WhatsApp Individual Module State
  const [waSettings, setWaSettings] = useState<WhatsAppSettings>(() => blogStore.getWhatsAppSettings());

  useEffect(() => {
    setLinks(blogStore.getSocialLinks());
    setWaSettings(blogStore.getWhatsAppSettings());
  }, []);

  const handleUrlChange = (id: string, url: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url } : item))
    );
    setSavedSuccess(false);
  };

  const handleToggleEnable = (id: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    setSavedSuccess(false);
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    blogStore.saveSocialLinks(links);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleSaveWhatsApp = () => {
    blogStore.saveWhatsAppSettings(waSettings);
    setWaSavedSuccess(true);
    setTimeout(() => setWaSavedSuccess(false), 4000);
  };

  const handleAddCustomPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform.trim() || !newUrl.trim()) return;

    const formattedPlatform = newPlatform.trim().toLowerCase().replace(/\s+/g, '');
    const newLinkItem: SocialLinkItem = {
      id: `s-custom-${Date.now()}`,
      platform: formattedPlatform,
      name: newPlatform.trim(),
      url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
      enabled: true,
    };

    const updated = [...links, newLinkItem];
    setLinks(updated);
    blogStore.saveSocialLinks(updated);
    setNewPlatform('');
    setNewUrl('');
    setShowAddModal(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all social media channels back to default configurations?')) {
      localStorage.removeItem('neema_cms_social_links');
      const defaults = blogStore.getSocialLinks();
      setLinks(defaults);
      blogStore.saveSocialLinks(defaults);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#032302] p-6 md:p-8 rounded-2xl border border-[#C0991B]/30 text-white shadow-lg space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2.5">
            <Share2 className="w-6 h-6 text-[#C0991B] shrink-0" /> SOCIAL MEDIA MODULE
          </h3>
          <span className="px-3.5 py-1.5 bg-[#C0991B]/20 text-[#C0991B] border border-[#C0991B]/40 rounded-xl text-xs font-black flex items-center gap-2 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C0991B] animate-pulse"></span>
            {links.filter(l => l.enabled).length} Channels Active
          </span>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-4xl">
          Activate, manage, and publish official social media profiles. Enabled channels deploy instantly across the top header bar and website footer.
        </p>

        {/* 3. CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
            title="Reset Defaults"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C0991B]" /> Reset Defaults
          </button>
          
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Activate New Channel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#074504] hover:bg-[#053203] text-[#C0991B] border border-[#C0991B]/50 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C0991B]" /> Save &amp; Activate
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 text-xs font-extrabold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Social media activation updated successfully! Changes are live across top header bar and website footer.</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Social Links List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-4">
              <span className="text-xs font-black text-[#074504] uppercase flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C0991B]" /> Configured Channels ({links.filter(l => l.enabled).length} Active)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLinks(prev => prev.map(l => ({ ...l, enabled: true })));
                    setSavedSuccess(false);
                  }}
                  className="text-[10px] font-bold text-[#074504] hover:text-[#599200] bg-[#074504]/10 hover:bg-[#074504]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Activate All
                </button>
                <button
                  onClick={() => {
                    setLinks(prev => prev.map(l => ({ ...l, enabled: false })));
                    setSavedSuccess(false);
                  }}
                  className="text-[10px] font-bold text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Deactivate All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {links.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.enabled 
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs' 
                      : 'bg-gray-50/80 border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[170px]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                      item.enabled ? 'bg-[#074504] text-[#C0991B]' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {renderPlatformIcon(item.platform, "w-5 h-5")}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                        {item.name}
                        {item.enabled && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </h4>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${item.enabled ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {item.enabled ? 'Activated & Live' : 'Deactivated'}
                      </span>
                    </div>
                  </div>

                  {/* Input field */}
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => handleUrlChange(item.id, e.target.value)}
                      placeholder={`Enter ${item.name} handle/URL...`}
                      className="w-full px-3.5 py-2 bg-white text-xs font-mono border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#074504] focus:border-[#074504] transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-gray-600 hover:text-white hover:bg-[#074504] rounded-lg transition-all cursor-pointer border border-gray-200 hover:border-[#074504]"
                        title="Test Channel Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleEnable(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                        item.enabled ? 'bg-[#074504]' : 'bg-gray-300'
                      }`}
                      title={item.enabled ? "Deactivate Channel" : "Activate Channel"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.enabled ? 'translate-x-6 bg-[#C0991B]' : 'translate-x-1'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                      title="Remove Channel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INDIVIDUAL SECTION: WHATSAPP INTEGRATION & LIVE CHAT ENGINE */}
          <div className="bg-white rounded-2xl border-t-4 border-t-emerald-600 border-x border-b border-gray-200 shadow-md p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-black uppercase tracking-widest mb-1">
                  Individual Section
                </div>
                <h3 className="text-lg font-black text-[#074504] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  WhatsApp Business &amp; Live Chat Widget Controls
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Configure floating buttons, live chat popup windows, pre-filled prompts, third-party chat scripts, and Meta Pixel catalog synchronization.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveWhatsApp}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-4 h-4 text-[#C0991B]" /> Save WhatsApp Settings
              </button>
            </div>

            {waSavedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Business &amp; Live Chat configuration saved successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              
              {/* Field 1: Floating WhatsApp Chat Button / Bubble (Click-to-Chat Link) */}
              <div className={`p-4 rounded-2xl border transition-all ${waSettings.floatingButtonEnabled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      1. Floating WhatsApp Chat Button
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Persistent bubble on mobile &amp; desktop.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaSettings(prev => ({ ...prev, floatingButtonEnabled: !prev.floatingButtonEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${waSettings.floatingButtonEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${waSettings.floatingButtonEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {waSettings.floatingButtonEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">WhatsApp Phone Number</label>
                      <input
                        type="text"
                        value={waSettings.phoneNumber}
                        onChange={(e) => setWaSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="+254705759365"
                        className="w-full px-3 py-2 bg-white text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Button Screen Position</label>
                      <select
                        value={waSettings.position}
                        onChange={(e: any) => setWaSettings(prev => ({ ...prev, position: e.target.value }))}
                        className="w-full px-3 py-2 bg-white text-xs font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                      >
                        <option value="bottom-right">Bottom Right Corner</option>
                        <option value="bottom-left">Bottom Left Corner</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 2: WhatsApp Live Chat Window */}
              <div className={`p-4 rounded-2xl border transition-all ${waSettings.liveChatEnabled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      2. WhatsApp Live Chat Popup
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Agent greeting window before redirect.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaSettings(prev => ({ ...prev, liveChatEnabled: !prev.liveChatEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${waSettings.liveChatEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${waSettings.liveChatEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {waSettings.liveChatEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Support Agent Name</label>
                      <input
                        type="text"
                        value={waSettings.agentName}
                        onChange={(e) => setWaSettings(prev => ({ ...prev, agentName: e.target.value }))}
                        placeholder="NEEMA HEEP Loan Officer"
                        className="w-full px-3 py-2 bg-white text-xs font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Greeting Banner Text</label>
                      <input
                        type="text"
                        value={waSettings.greetingText}
                        onChange={(e) => setWaSettings(prev => ({ ...prev, greetingText: e.target.value }))}
                        placeholder="Jambo! How can we assist?"
                        className="w-full px-3 py-2 bg-white text-xs font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Field 3: Pre-filled Text */}
              <div className={`p-4 rounded-2xl border transition-all ${waSettings.prefilledTextEnabled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      3. Pre-filled Text Starter
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Initial conversation prompt text.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaSettings(prev => ({ ...prev, prefilledTextEnabled: !prev.prefilledTextEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${waSettings.prefilledTextEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${waSettings.prefilledTextEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {waSettings.prefilledTextEnabled && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Message Template</label>
                    <textarea
                      rows={2}
                      value={waSettings.prefilledText}
                      onChange={(e) => setWaSettings(prev => ({ ...prev, prefilledText: e.target.value }))}
                      className="w-full px-3 py-2 bg-white text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Field 4: Third-Party Script */}
              <div className={`p-4 rounded-2xl border transition-all xl:col-span-1 ${waSettings.thirdPartyScriptEnabled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-600" />
                      4. Third-Party Script Embed
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      External live chat widget scripts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaSettings(prev => ({ ...prev, thirdPartyScriptEnabled: !prev.thirdPartyScriptEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${waSettings.thirdPartyScriptEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${waSettings.thirdPartyScriptEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {waSettings.thirdPartyScriptEnabled && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Embed Code</label>
                    <textarea
                      rows={2}
                      value={waSettings.thirdPartyScript}
                      onChange={(e) => setWaSettings(prev => ({ ...prev, thirdPartyScript: e.target.value }))}
                      placeholder="<script src='https://...'></script>"
                      className="w-full px-3 py-2 bg-gray-900 text-emerald-400 text-xs font-mono rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Field 5: Meta Pixel & Catalog Sync */}
              <div className={`p-4 rounded-2xl border transition-all xl:col-span-2 ${waSettings.metaPixelEnabled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2 border-b border-gray-200/60 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      5. Meta Pixel &amp; WhatsApp Commerce Catalog Sync
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Embed tracking pixel to sync product pages directly with Meta &amp; WhatsApp Commerce.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaSettings(prev => ({ ...prev, metaPixelEnabled: !prev.metaPixelEnabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${waSettings.metaPixelEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${waSettings.metaPixelEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {waSettings.metaPixelEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Meta Pixel Tracking ID</label>
                      <input
                        type="text"
                        value={waSettings.metaPixelId}
                        onChange={(e) => setWaSettings(prev => ({ ...prev, metaPixelId: e.target.value }))}
                        placeholder="128492049102941"
                        className="w-full px-3 py-2 bg-white text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={waSettings.syncCatalog}
                          onChange={(e) => setWaSettings(prev => ({ ...prev, syncCatalog: e.target.checked }))}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>WhatsApp Commerce Catalog Sync</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Live Preview Side Panel */}
        <div className="space-y-4 lg:sticky lg:top-4 self-start">
          <div className="bg-white rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs p-5 space-y-4">
            <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
              <Eye className="w-4 h-4 text-[#C0991B]" /> Live Top Bar Preview
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Active social channels as rendered on the website top header bar:
            </p>
            <div className="bg-[#074504] p-3 rounded-xl flex items-center justify-between">
              <span className="text-[10px] text-[#C0991B] font-bold uppercase">Header Top Bar</span>
              <HeaderSocialIcons />
            </div>
          </div>

          <div className="bg-white rounded-2xl border-t-4 border-t-[#C0991B] border-x border-b border-gray-200 shadow-xs p-5 space-y-4">
            <h4 className="font-black text-xs text-[#074504] uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
              <Eye className="w-4 h-4 text-[#C0991B]" /> Live Footer Preview
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Active social channels as rendered in the main website footer:
            </p>
            <div className="bg-[#074504] p-4 rounded-xl flex items-center justify-center">
              <FooterSocialIcons />
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Channel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C0991B]" /> Activate Custom Social Channel
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomPlatform} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Platform / Channel Name</label>
                <input
                  type="text"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  placeholder="e.g. WhatsApp, Discord, Bluesky, Custom Channel..."
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Profile / Channel URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#074504]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#074504] hover:bg-[#599200] text-white text-xs font-black uppercase rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Activate Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

