import React, { useState } from 'react';
import { 
  Mail, Search, Star, Trash2, Reply, CheckCircle2, AlertCircle, 
  Send, User, Phone, Calendar, Tag, Shield, Download, FileText, 
  HelpCircle, Filter, Check, RefreshCw, Printer,
  FileSpreadsheet, FileCode, Plus, X, Settings
} from 'lucide-react';
import { 
  exportPdfReport, 
  printHtmlReport, 
  printSingleItemDossier, 
  printAllLeadsBooklet, 
  LeadDossierItem 
} from '../lib/pdfPrintUtils';

export interface ResponseTemplate {
  id: string;
  title: string;
  category: string;
  body: string;
}

const DEFAULT_TEMPLATES: ResponseTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Biashara / Loan Pre-Qualification Invite',
    category: 'Loan Lead',
    body: `Dear {SenderName},

Thank you for your interest in Neema HEEP Microfinance ({Category}). We have received your inquiry regarding "{Subject}".

To process your pre-qualification, kindly visit your nearest Neema HEEP branch or reply with the following:
1. Copy of National ID & KRA PIN
2. 6 Months M-PESA or Bank Statements
3. Business Location / Registration details

Our Credit Desk will contact you directly on {SenderPhone}.

Warm regards,
Neema HEEP Credit Operations`
  },
  {
    id: 'tmpl-2',
    title: 'Chama & Group Table Banking Invite',
    category: 'Group Lead',
    body: `Dear {SenderName},

Greetings from Neema HEEP Microfinance. We received your inquiry regarding group financing and Chama training.

Our community empowerment team offers customized group loans, financial literacy workshops, and flexible microfinance solutions. A loan officer will reach out on {SenderPhone} to schedule a group meeting.

Sincerely,
Neema HEEP Community Development Team`
  },
  {
    id: 'tmpl-3',
    title: 'General Inquiry Acknowledgment',
    category: 'General',
    body: `Dear {SenderName},

Thank you for contacting Neema HEEP Microfinance on {Date}. We have received your message regarding "{Subject}" and assigned it to a client relationship specialist.

If you have urgent questions, please feel free to call our main line at 0705 759 365 or visit our website portal.

Best regards,
Neema HEEP Customer Care`
  }
];

export interface MessageItem {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  category: 'Contact Form' | 'Loan Application Lead' | 'Quiz Lead' | 'Newsletter' | 'General';
  content: string;
  date: string;
  status: 'Unread' | 'Read' | 'Replied' | 'Archived';
  starred?: boolean;
  meta?: Record<string, any>;
}

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'msg-101',
    senderName: 'Mercy Wanjiku',
    senderEmail: 'mercy.wanjiku@gmail.com',
    senderPhone: '+254 712 345 678',
    subject: 'Inquiry regarding Biashara Boost Loan Eligibility in Nyeri',
    category: 'Loan Application Lead',
    content: 'Habari, I have a fast-growing cereals wholesale business in Nyeri town market. I would like to inquire about the minimum documentation required to apply for the KES 250,000 Biashara Boost Loan and whether grace periods are offered during seasonal harvests.',
    date: '2026-03-29 09:42 AM',
    status: 'Unread',
    starred: true,
    meta: { requestedAmount: 'KES 250,000', location: 'Nyeri Main Branch', businessType: 'Agri-Cereals Wholesale' }
  },
  {
    id: 'msg-102',
    senderName: 'David Kamau',
    senderEmail: 'david.kamau@expresslogistics.co.ke',
    senderPhone: '+254 722 987 654',
    subject: 'Financial Health Quiz Submission - Score 88/100',
    category: 'Quiz Lead',
    content: 'Submitted Financial Health Assessment Quiz via website portal. Total Score: 88%. Strong cashflow reserves but requested consultation on equipment financing options for motorbikes.',
    date: '2026-03-28 04:15 PM',
    status: 'Unread',
    meta: { quizScore: '88%', recommendedLoan: 'Imara Business Loan', experienceYears: '4 Years' }
  },
  {
    id: 'msg-103',
    senderName: 'Agnes Muthoni',
    senderEmail: 'muthoni.agnes@yahoo.com',
    senderPhone: '+254 733 112 233',
    subject: 'Partnership Inquiry for Women Enterprise Workshop',
    category: 'Contact Form',
    content: 'We represent the Mount Kenya Women Entrepreneurs Association. We are organizing a 2-day financial literacy summit in Karatina and would love to invite Neema HEEP as a key sponsor and facilitator.',
    date: '2026-03-27 11:20 AM',
    status: 'Read',
    starred: true
  },
  {
    id: 'msg-104',
    senderName: 'Peter Otieno',
    senderEmail: 'potieno.agri@outlook.com',
    senderPhone: '+254 701 554 433',
    subject: 'Kilimo Biashara Asset Financing Request',
    category: 'Loan Application Lead',
    content: 'I need financing for a solar-powered irrigation pump system for my 3-acre dairy and horticulture farm in Othaya. Kindly share the repayment schedule options.',
    date: '2026-03-26 02:10 PM',
    status: 'Replied',
    meta: { requestedAmount: 'KES 180,000', location: 'Othaya Branch' }
  },
  {
    id: 'msg-105',
    senderName: 'Grace Nyambura',
    senderEmail: 'grace.nyambura@retailkenya.com',
    subject: 'Newsletter Subscription Confirmation',
    category: 'Newsletter',
    content: 'Subscribed to weekly Neema HEEP Microfinance Insights and Economic Outlook Digest.',
    date: '2026-03-25 08:30 AM',
    status: 'Read'
  }
];

export default function MessagesFolderView() {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [selectedId, setSelectedId] = useState<string>('msg-101');
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Leads' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Template Engine State
  const [templates, setTemplates] = useState<ResponseTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('neema_response_templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTmplTitle, setNewTmplTitle] = useState('');
  const [newTmplCategory, setNewTmplCategory] = useState('Loan Lead');
  const [newTmplBody, setNewTmplBody] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const selectedMsg = messages.find((m) => m.id === selectedId) || messages[0];

  const filteredMessages = messages.filter((m) => {
    const matchesSearch = 
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'Unread') return m.status === 'Unread';
    if (activeTab === 'Leads') return m.category === 'Loan Application Lead' || m.category === 'Quiz Lead';
    if (activeTab === 'Archived') return m.status === 'Archived';
    return m.status !== 'Archived';
  });

  const handleSelectMessage = (id: string) => {
    setSelectedId(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id && m.status === 'Unread' ? { ...m, status: 'Read' } : m))
    );
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const handleArchive = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Archived' } : m))
    );
    triggerToast('Message moved to Archive folder.');
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    triggerToast('Message permanently removed.');
  };

  const handleStatusChange = (id: string, newStatus: MessageItem['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    triggerToast(`Lead status updated to ${newStatus}`);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedId ? { ...m, status: 'Replied' } : m))
    );
    setReplyText('');
    triggerToast(`Reply sent to ${selectedMsg.senderEmail}!`);
  };

  const unreadCount = messages.filter((m) => m.status === 'Unread').length;
  const leadsCount = messages.filter((m) => m.category === 'Loan Application Lead' || m.category === 'Quiz Lead').length;

  // Export & Printing
  const handleExportPdfReport = () => {
    const columns = ['Sender Name', 'Email', 'Phone', 'Category', 'Subject', 'Date'];
    const rows = filteredMessages.map(m => [
      m.senderName,
      m.senderEmail,
      m.senderPhone || 'N/A',
      m.category,
      m.subject,
      m.date
    ]);

    exportPdfReport({
      title: 'Leads & Inquiries Management Report',
      subtitle: `Active Filter: ${activeTab} Folder | Total Records: ${filteredMessages.length}`,
      columns,
      rows,
      filename: `Neema_HEEP_Leads_Report_${activeTab}.pdf`
    });
    triggerToast('PDF Report downloaded with official Neema HEEP Logo.');
  };

  const handlePrintBulkReport = () => {
    const columns = ['Sender Name', 'Email', 'Phone', 'Category', 'Subject', 'Date'];
    const rows = filteredMessages.map(m => [
      m.senderName,
      m.senderEmail,
      m.senderPhone || 'N/A',
      m.category,
      m.subject,
      m.date
    ]);

    printHtmlReport({
      title: 'Leads & Inquiries Summary Table',
      subtitle: `Active Filter: ${activeTab} | ${filteredMessages.length} total entries`,
      columns,
      rows
    });
  };

  const handlePrintAllDossiersBooklet = () => {
    if (filteredMessages.length === 0) {
      triggerToast('No leads available to print.');
      return;
    }
    const dossierItems: LeadDossierItem[] = filteredMessages.map(m => ({
      id: m.id,
      title: m.subject,
      category: m.category,
      date: m.date,
      senderName: m.senderName,
      senderEmail: m.senderEmail,
      senderPhone: m.senderPhone,
      status: m.status,
      metadata: m.meta,
      content: m.content
    }));

    printAllLeadsBooklet({
      title: `Neema HEEP Complete Leads Booklet (${activeTab} View)`,
      items: dossierItems
    });
  };

  const handlePrintSingleLead = () => {
    if (!selectedMsg) return;
    printSingleItemDossier({
      title: selectedMsg.subject,
      category: selectedMsg.category,
      date: selectedMsg.date,
      senderName: selectedMsg.senderName,
      senderEmail: selectedMsg.senderEmail,
      senderPhone: selectedMsg.senderPhone,
      metadata: selectedMsg.meta,
      content: selectedMsg.content
    });
  };

  const handlePrintLeadById = (msg: MessageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    printSingleItemDossier({
      title: msg.subject,
      category: msg.category,
      date: msg.date,
      senderName: msg.senderName,
      senderEmail: msg.senderEmail,
      senderPhone: msg.senderPhone,
      metadata: msg.meta,
      content: msg.content
    });
  };

  const handleExportExcel = () => {
    const headers = [
      'Lead ID',
      'Date & Time',
      'Category',
      'Sender Name',
      'Sender Email',
      'Sender Phone',
      'Subject',
      'Status',
      'Metadata / Loan Specs',
      'Full Inquiry Content'
    ];

    const rows = filteredMessages.map(m => {
      const metaStr = m.meta ? Object.entries(m.meta).map(([k, v]) => `${k}: ${v}`).join(' | ') : 'N/A';
      const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        escapeCsv(m.id),
        escapeCsv(m.date),
        escapeCsv(m.category),
        escapeCsv(m.senderName),
        escapeCsv(m.senderEmail),
        escapeCsv(m.senderPhone || ''),
        escapeCsv(m.subject),
        escapeCsv(m.status),
        escapeCsv(metaStr),
        escapeCsv(m.content)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Neema_HEEP_Leads_Export_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('All leads exported to Excel (.csv) format.');
  };

  // Template Actions
  const handleInsertTemplate = (tmplId: string) => {
    if (!tmplId || !selectedMsg) return;
    const tmpl = templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    const parsedBody = tmpl.body
      .replace(/\{SenderName\}/g, selectedMsg.senderName)
      .replace(/\{Category\}/g, selectedMsg.category)
      .replace(/\{Subject\}/g, selectedMsg.subject)
      .replace(/\{SenderPhone\}/g, selectedMsg.senderPhone || 'your provided phone number')
      .replace(/\{Date\}/g, selectedMsg.date);

    setReplyText(parsedBody);
    setSelectedTemplateId(tmplId);
    triggerToast(`Inserted template: ${tmpl.title}`);
  };

  const handleSaveNewTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmplTitle.trim() || !newTmplBody.trim()) {
      triggerToast('Please provide both title and template body.');
      return;
    }

    const created: ResponseTemplate = {
      id: `tmpl-${Date.now()}`,
      title: newTmplTitle.trim(),
      category: newTmplCategory,
      body: newTmplBody.trim()
    };

    const updated = [created, ...templates];
    setTemplates(updated);
    try {
      localStorage.setItem('neema_response_templates', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    setNewTmplTitle('');
    setNewTmplBody('');
    setShowTemplateModal(false);
    triggerToast(`New template "${created.title}" created successfully!`);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    try {
      localStorage.setItem('neema_response_templates', JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage delete failed:', err);
    }
    triggerToast('Template removed.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#074504] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C0991B] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> {toast}
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-[#074504] text-white p-6 sm:p-7 rounded-3xl border border-[#C0991B]/40 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C0991B]/20 rounded-full text-[11px] font-black uppercase text-[#C0991B] border border-[#C0991B]/40">
              <Mail className="w-3.5 h-3.5" /> Enterprise CRM & Client Leads Portal
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Leads & Inquiries Management
            </h2>
            <p className="text-xs sm:text-sm text-white/85 font-medium leading-relaxed">
              Manage public contact forms, loan application leads, financial quiz submissions, client inquiries, and lead conversion workflows.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[90px]">
              <p className="text-[10px] text-[#C0991B] font-extrabold uppercase tracking-wider">Unread</p>
              <p className="text-xl font-black text-white">{unreadCount}</p>
            </div>
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[90px]">
              <p className="text-[10px] text-[#C0991B] font-extrabold uppercase tracking-wider">Active Leads</p>
              <p className="text-xl font-black text-white">{leadsCount}</p>
            </div>
          </div>
        </div>

        {/* CTA Actions Bar */}
        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintAllDossiersBooklet}
              className="px-4 py-2.5 bg-[#053203] hover:bg-[#032202] text-[#C0991B] border border-[#C0991B]/60 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
              title="Print Full Dossier Booklet of All Filtered Leads"
            >
              <Printer className="w-4 h-4 text-[#C0991B]" /> Print All Leads
            </button>
            <button
              type="button"
              onClick={handlePrintBulkReport}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              title="Print Leads Summary Table"
            >
              <Printer className="w-4 h-4 text-white/80" /> Summary Table
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md border border-emerald-500/50 hover:scale-[1.01]"
              title="Download Leads in Excel (.csv) format"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" /> Export Excel
            </button>
            <button
              type="button"
              onClick={handleExportPdfReport}
              className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a38114] text-[#074504] rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
              title="Export Leads PDF Report with Logo"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-[#C0991B]/40 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
            title="Manage Response Templates"
          >
            <FileCode className="w-4 h-4 text-[#C0991B]" /> Response Templates
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto gap-1">
          {(['All', 'Unread', 'Leads', 'Archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#074504] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sender, topic, or keyword..."
            className="w-full pl-10 pr-4 py-1.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
          />
        </div>
      </div>

      {/* Two Pane Split Screen Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Message List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 sm:p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-black uppercase text-gray-700">
            <span>Inbox Folder ({filteredMessages.length})</span>
            <span className="text-emerald-700 font-mono text-[11px]">Real-Time Sync</span>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto max-h-[520px] flex-1">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-gray-400">
                <Mail className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs font-bold">No messages found in this view</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMsg?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`p-3.5 transition-all cursor-pointer relative group flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-l-4 border-l-[#074504]'
                        : msg.status === 'Unread'
                        ? 'bg-amber-50/40 hover:bg-gray-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {msg.status === 'Unread' && (
                          <span className="w-2 h-2 rounded-full bg-[#074504] animate-pulse" />
                        )}
                        <span className="text-xs font-black text-gray-900 truncate max-w-[180px]">
                          {msg.senderName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handlePrintLeadById(msg, e)}
                          className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-[#074504] transition-all"
                          title="Print Individual Lead Dossier"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono text-gray-400">{msg.date.split(' ')[0]}</span>
                      </div>
                    </div>

                    <h4 className="text-xs font-extrabold text-gray-800 truncate">
                      {msg.subject}
                    </h4>

                    <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed">
                      {msg.content}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        msg.category === 'Loan Application Lead' ? 'bg-amber-100 text-amber-900 border border-[#C0991B]/40' :
                        msg.category === 'Quiz Lead' ? 'bg-blue-100 text-blue-900' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {msg.category}
                      </span>

                      <span className={`text-[10px] font-bold ${
                        msg.status === 'Replied' ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Message Details & Quick Reply (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
          {selectedMsg ? (
            <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-[#074504] text-[#C0991B] font-black text-[10px] uppercase rounded-full tracking-wider">
                      {selectedMsg.category}
                    </span>
                    <h3 className="text-base font-black text-gray-900 leading-tight">
                      {selectedMsg.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrintSingleLead}
                      className="px-3 py-2 bg-[#074504] hover:bg-[#053203] text-[#C0991B] border border-[#C0991B]/40 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      title="Print Lead / Inquiry Dossier"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#C0991B]" /> Print Lead
                    </button>
                    <button
                      onClick={() => handleArchive(selectedMsg.id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      title="Archive Message"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sender Info Card */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#074504] text-[#C0991B] font-black flex items-center justify-center text-sm shadow-xs">
                      {selectedMsg.senderName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{selectedMsg.senderName}</h4>
                      <p className="text-gray-500 font-mono text-[11px]">{selectedMsg.senderEmail}</p>
                    </div>
                  </div>

                  {selectedMsg.senderPhone && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-mono text-[11px] font-bold text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedMsg.senderPhone}
                    </div>
                  )}
                </div>

                {/* Metadata Badges if Lead */}
                {selectedMsg.meta && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex flex-wrap items-center gap-4 text-xs font-extrabold text-amber-900">
                    {Object.entries(selectedMsg.meta).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <span className="text-amber-700 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-[#074504] bg-white px-2 py-0.5 rounded-lg border border-amber-200 font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Content Body */}
                <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-200 text-xs text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.content}
                </div>
              </div>

              {/* Quick Reply Form with Template Insertion */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1.5 text-[#074504]">
                    <Reply className="w-4 h-4 text-[#C0991B]" /> Respond to {selectedMsg.senderName}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => handleInsertTemplate(e.target.value)}
                      className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-extrabold text-[#074504] outline-none cursor-pointer"
                    >
                      <option value="">-- Select Response Template --</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowTemplateModal(true)}
                      className="px-2.5 py-1 bg-[#074504] text-[#C0991B] hover:bg-[#053203] rounded-lg font-black flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" /> Templates
                    </button>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type response email or choose a response template above..."
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504] leading-relaxed font-sans"
                />

                <div className="flex justify-between items-center">
                  <div className="text-[10px] text-gray-400 font-mono">
                    Placeholders auto-filled: &#123;SenderName&#125;, &#123;Category&#125;, &#123;Subject&#125;
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-[#C0991B]/40"
                  >
                    <Send className="w-4 h-4 text-[#C0991B]" /> Send Response
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <Mail className="w-12 h-12 mx-auto stroke-1 text-gray-300" />
              <p className="text-xs font-bold">Select a message from the list to read details</p>
            </div>
          )}
        </div>
      </div>

      {/* Template Management & Creation Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#C0991B]/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[#074504]">
                <FileCode className="w-5 h-5 text-[#C0991B]" />
                <h3 className="text-lg font-black uppercase">Lead Response Templates Manager</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create New Template Form */}
            <form onSubmit={handleSaveNewTemplate} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#074504] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#C0991B]" /> Create New Customized Template
                </span>
                <span className="text-[10px] text-emerald-800 font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Reusable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-700 mb-1">
                    Template Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTmplTitle}
                    onChange={(e) => setNewTmplTitle(e.target.value)}
                    placeholder="e.g. Agri-Asset Finance Checklist"
                    className="w-full px-3 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-gray-700 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newTmplCategory}
                    onChange={(e) => setNewTmplCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504] font-bold"
                  >
                    <option value="Loan Lead">Loan Application Lead</option>
                    <option value="Quiz Lead">Quiz Follow-up Lead</option>
                    <option value="Group Lead">Chama & Group Banking</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-700 mb-1">
                  Template Body Text (Supports Placeholders)
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTmplBody}
                  onChange={(e) => setNewTmplBody(e.target.value)}
                  placeholder="Dear {SenderName}, Thank you for inquiring about {Category}. Kindly present your National ID and statements..."
                  className="w-full p-3 bg-white text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504] leading-relaxed"
                />
                <p className="text-[10px] text-gray-500 font-medium mt-1">
                  <strong>Available Tags:</strong> <code className="bg-white px-1 border rounded">&#123;SenderName&#125;</code>, <code className="bg-white px-1 border rounded">&#123;Category&#125;</code>, <code className="bg-white px-1 border rounded">&#123;Subject&#125;</code>, <code className="bg-white px-1 border rounded">&#123;SenderPhone&#125;</code>, <code className="bg-white px-1 border rounded">&#123;Date&#125;</code>
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs uppercase rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C0991B]" /> Save Template
                </button>
              </div>
            </form>

            {/* Saved Templates List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-gray-800">
                Existing Template Library ({templates.length})
              </h4>
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {templates.map((t) => (
                  <div key={t.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#074504]">{t.title}</span>
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[9px] font-bold uppercase">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                        {t.body}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(t.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
