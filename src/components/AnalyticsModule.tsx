import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, FileText, MessageSquare, ArrowUpRight, ArrowDownRight,
  Search, Filter, Calendar, Download, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle,
  Globe, Smartphone, Laptop, Clock, Share2, Layers, Award, Target, Sliders, Mail,
  ChevronDown, ChevronRight, FileSpreadsheet, FileText as PdfIcon, Send, Database, Activity,
  Server, Lock, PieChart as PieChartIcon, Bell, ArrowUp, ArrowDown, HelpCircle, MapPin, Check,
  Radio, BarChart2, CornerRightDown, ExternalLink, RefreshCcw, Cpu, Bookmark, ThumbsUp, BookOpen,
  FilterX, UserCheck, Code, Power, Compass, LogOut, TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, RadialBarChart, RadialBar, FunnelChart, Funnel, LabelList
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import writeXlsxFile from 'write-excel-file/browser';
import { BlogPostItem, blogStore, TrackingPixelItem } from '../lib/blogStore';
import { getPixelLogs, PixelLogEntry } from '../services/trackingService';

// --- TYPES ---
export type AnalyticsSubmodule = 
  | 'dashboard'
  | 'traffic'
  | 'conversions'
  | 'content'
  | 'seo'
  | 'audience'
  | 'engagement'
  | 'reports'
  | 'exports';

export type UserRoleView = 
  | 'Management'
  | 'Editors'
  | 'Authors'
  | 'Marketing Team'
  | 'SEO Team'
  | 'System Administrator';

export type DateFilterPreset = 
  | 'Today'
  | '7 Days'
  | '30 Days'
  | 'Quarterly'
  | 'Half year'
  | 'Year'
  | 'Custom';

interface KeywordRank {
  keyword: string;
  position: number;
  delta: number;
  searches: number;
  ctr: string;
  impressions: number;
}

interface CampaignUTM {
  id: string;
  name: string;
  source: string;
  medium: string;
  clicks: number;
  conversions: number;
  convRate: string;
  cost: string;
  revenue: string;
  roi: string;
  status: 'Active' | 'Completed' | 'Paused';
}

interface ArticlePerformance {
  id: string;
  title: string;
  author: string;
  category: string;
  views: number;
  uniqueViews: number;
  avgReadTime: string;
  completionRate: number;
  shares: number;
  downloads: number;
  comments: number;
  likes: number;
  bookmarks: number;
  score: number;
  grade: string;
  decayIndex: number;
  freshness: string;
  aiRecommendation: string;
}

interface AnalyticsModuleProps {
  showToast?: (msg: string) => void;
}

export function AnalyticsModule({ showToast = (msg) => console.log(msg) }: AnalyticsModuleProps) {
  // --- STATES ---
  const [activeSubmodule, setActiveSubmodule] = useState<AnalyticsSubmodule>('dashboard');
  const [roleView, setRoleView] = useState<UserRoleView>('Management');
  const [dateFilter, setDateFilter] = useState<DateFilterPreset>('30 Days');
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D' | 'Quarterly' | 'Half Year' | 'Annually'>('30D');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-03');

  const handleTimeframeChange = (tf: '7D' | '30D' | 'Quarterly' | 'Half Year' | 'Annually') => {
    setChartTimeframe(tf);
    switch (tf) {
      case '7D': setDateFilter('7 Days'); break;
      case '30D': setDateFilter('30 Days'); break;
      case 'Quarterly': setDateFilter('Quarterly'); break;
      case 'Half Year': setDateFilter('Half year'); break;
      case 'Annually': setDateFilter('Year'); break;
    }
  };
  
  // Filter dropdowns
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All');
  const [selectedDevice, setSelectedDevice] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time Live Engine States
  const [liveVisitors, setLiveVisitors] = useState<number>(64);
  const [activeArticlesCount, setActiveArticlesCount] = useState<number>(14);
  const [liveConversionsCount, setLiveConversionsCount] = useState<number>(128);
  const [serverLatency, setServerLatency] = useState<number>(18);
  const [serverUptime, setServerUptime] = useState<string>('99.98%');
  const [lastLivePing, setLastLivePing] = useState<string>('');

  // Notifications drawer & Modal states
  const [showAlertsDrawer, setShowAlertsDrawer] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportType, setReportType] = useState<'Executive' | 'Editorial' | 'SEO' | 'Marketing'>('Executive');
  const [reportFrequency, setReportFrequency] = useState<'Once' | 'Daily' | 'Weekly' | 'Monthly'>('Once');
  const [reportRecipientEmail, setReportRecipientEmail] = useState<string>('management@neemaheep.co.ke');

  // Load articles from store for dynamic sync
  const [storedPosts, setStoredPosts] = useState<BlogPostItem[]>([]);

  // Set Tracking Pixels & Event Logs State
  const [trackingPixels, setTrackingPixels] = useState<TrackingPixelItem[]>([]);
  const [pixelLogs, setPixelLogs] = useState<PixelLogEntry[]>([]);

  useEffect(() => {
    const posts = blogStore.getPosts();
    setStoredPosts(posts);

    const refreshPixelData = () => {
      setTrackingPixels(blogStore.getTrackingPixels());
      setPixelLogs(getPixelLogs());
    };

    refreshPixelData();

    window.addEventListener('neema_cms_tracking_pixels_updated', refreshPixelData);
    window.addEventListener('neema_pixel_log_added', refreshPixelData);

    return () => {
      window.removeEventListener('neema_cms_tracking_pixels_updated', refreshPixelData);
      window.removeEventListener('neema_pixel_log_added', refreshPixelData);
    };
  }, []);

  const activePixels = useMemo(() => trackingPixels.filter(p => p.enabled), [trackingPixels]);
  const activePixelCount = activePixels.length;
  const totalPixelsCount = trackingPixels.length;

  // Date Range scaling multiplier
  const dateRangeMultiplier = useMemo(() => {
    switch (dateFilter) {
      case 'Today': return 0.08;
      case '7 Days': return 0.28;
      case '30 Days': return 1.0;
      case 'Quarterly': return 2.85;
      case 'Half year': return 5.5;
      case 'Year': return 10.8;
      default: return 1.0;
    }
  }, [dateFilter]);

  // Pixel signal scaling multiplier
  const pixelMultiplier = useMemo(() => {
    if (activePixelCount === 0) return 0.25; // Unverified baseline signal if no set pixels active
    const base = 0.65 + (activePixelCount * 0.08); // Each active set pixel unlocks attribution depth
    const logBonus = Math.min(0.2, pixelLogs.length * 0.008);
    return Math.min(1.5, base + logBonus);
  }, [activePixelCount, pixelLogs.length]);

  const effectiveMultiplier = useMemo(() => {
    return pixelMultiplier * dateRangeMultiplier;
  }, [pixelMultiplier, dateRangeMultiplier]);

  const dynamicVisitors = Math.round(48290 * effectiveMultiplier);
  const dynamicUniqueVisitors = Math.round(38120 * effectiveMultiplier);
  const dynamicSessions = Math.round(62800 * effectiveMultiplier);
  const dynamicPageViews = Math.round(142800 * effectiveMultiplier);
  const dynamicConversions = Math.round(1240 * effectiveMultiplier);

  // Live Real-Time Activity Streams State
  const [liveLeadFeed, setLiveLeadFeed] = useState([
    { id: 'ld-101', name: 'Patrick M. (Nairobi)', form: 'Biashara & Logbook Loan Form', startingPage: 'Blog Post (Mastering Logbook Loans)', time: 'Just now', pixel: 'Meta Pixel (Lead)', leadType: 'Qualified Credit Lead' },
    { id: 'ld-102', name: 'Eunice W. (Embu)', form: 'Contact Us Inquiry Form', startingPage: 'About Us Page', time: '14s ago', pixel: 'GA4 (form_submit)', leadType: 'Advisory Consultation' },
    { id: 'ld-103', name: 'John K. (Kiambu)', form: 'Financial Digest Newsletter', startingPage: 'Home Page', time: '42s ago', pixel: 'GA4 (sign_up)', leadType: 'Subscriber Lead' },
    { id: 'ld-104', name: 'Agnes C. (Meru)', form: 'Beneficiary Registration Form', startingPage: 'Products & Services Page', time: '2m ago', pixel: 'Meta Pixel', leadType: 'Community Grant Intake' }
  ]);

  const [liveAudienceFeed, setLiveAudienceFeed] = useState([
    { id: 'aud-1', location: 'Nairobi (Westlands)', page: '/blog/mastering-logbook-loans', device: 'Mobile Android (Safaricom 4G)', duration: '2m 14s', pixel: 'GA4 Active' },
    { id: 'aud-2', location: 'Embu Town', page: '/apply-loan', device: 'Desktop Chrome (Faiba Fiber)', duration: '4m 02s', pixel: 'Meta Pixel Active' },
    { id: 'aud-3', location: 'Kiambu (Thika)', page: '/contact-us', device: 'Mobile iOS (Safaricom 5G)', duration: '1m 20s', pixel: 'TikTok Pixel Active' },
    { id: 'aud-4', location: 'Meru Town', page: '/products/biashara-credit', device: 'Mobile Android (Airtel)', duration: '3m 45s', pixel: 'GA4 Active' }
  ]);

  // Real-time ticker effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVisitors(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(42, prev + delta);
      });
      
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setServerLatency(prev => 15 + Math.floor(Math.random() * 8));
      setLastLivePing(timeStr);

      // Simulate incoming real-time lead event
      if (Math.random() > 0.6) {
        setLiveConversionsCount(prev => prev + 1);
        const randomNames = ['David K. (Nairobi)', 'Grace M. (Embu)', 'Samuel O. (Nakuru)', 'Mercy A. (Mombasa)', 'Brian N. (Eldoret)'];
        const randomForms = ['Biashara & Logbook Loan Form', 'Contact Us Inquiry Form', 'Financial Digest Newsletter', 'Beneficiary Registration Form'];
        const randomPages = ['Blog Post (Business Loan Approval)', 'Home Page', 'Products Page', 'About Us Page'];
        const randomPixels = ['Meta Pixel (Lead)', 'GA4 (generate_lead)', 'TikTok Pixel (SubmitForm)', 'LinkedIn Insight Tag'];
        
        const newLead = {
          id: `ld-${Date.now()}`,
          name: randomNames[Math.floor(Math.random() * randomNames.length)],
          form: randomForms[Math.floor(Math.random() * randomForms.length)],
          startingPage: randomPages[Math.floor(Math.random() * randomPages.length)],
          time: 'Just now',
          pixel: randomPixels[Math.floor(Math.random() * randomPixels.length)],
          leadType: 'Qualified Site Conversion'
        };
        setLiveLeadFeed(prev => [newLead, ...prev.slice(0, 5)]);
      }

      // Simulate incoming real-time audience visitor tick
      if (Math.random() > 0.5) {
        const locations = ['Nairobi (Kilimani)', 'Embu (Town)', 'Kisumu (CBD)', 'Nakuru (Section 58)', 'Mombasa (Nyali)', 'Kiambu (Ruiru)'];
        const pages = ['/blog/requirements-quick-loan', '/home', '/about-us', '/products/biashara-loan', '/vacancies'];
        const devices = ['Mobile Android (Safaricom Data)', 'Mobile iOS (Safaricom Fiber)', 'Desktop Chrome (Airtel Data)', 'Desktop Edge (Zuku Fiber)'];
        const pixels = ['GA4 Verified', 'Meta Pixel Verified', 'TikTok Pixel Verified'];

        const newAudience = {
          id: `aud-${Date.now()}`,
          location: locations[Math.floor(Math.random() * locations.length)],
          page: pages[Math.floor(Math.random() * pages.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          duration: `${Math.floor(Math.random() * 4) + 1}m ${Math.floor(Math.random() * 50) + 10}s`,
          pixel: pixels[Math.floor(Math.random() * pixels.length)]
        };
        setLiveAudienceFeed(prev => [newAudience, ...prev.slice(0, 5)]);
      }
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // --- DATASETS & CALCULATIONS INFLUENCED BY SET PIXELS ---

  // Form Submissions Dataset
  const formSubmissionsData = useMemo(() => [
    {
      formId: 'loan_app_form',
      formName: 'Biashara & Logbook Loan Application Form',
      category: 'Business Revenue & Qualified Credit Leads',
      completions: Math.round(1240 * effectiveMultiplier),
      visitorsEncountered: Math.round(25800 * effectiveMultiplier),
      conversionRate: 4.8, // 4.8% of total site visitors complete this form
      startToFinishCompletionRate: 68.4, // % of form starters who complete
      primaryPixel: 'Meta Pixel (Lead) + GA4 (generate_lead)',
      leadType: 'Qualified Credit / Loan Borrower Lead',
      status: 'High Intent Lead'
    },
    {
      formId: 'contact_us_form',
      formName: 'Contact Us Inquiry Form',
      category: 'Direct Business Advisory Consultation',
      completions: Math.round(815 * effectiveMultiplier),
      visitorsEncountered: Math.round(9940 * effectiveMultiplier),
      conversionRate: 8.2, // 8.2% conversion on Contact page
      startToFinishCompletionRate: 74.2,
      primaryPixel: 'GA4 (form_submit) + TikTok Pixel (SubmitForm)',
      leadType: 'Advisory Consultation Inquiry',
      status: 'Active Inquiry'
    },
    {
      formId: 'newsletter_signup_form',
      formName: 'Newsletter & Financial Digest Signup Form',
      category: 'Audience Nurturing & Email Subscriber Leads',
      completions: Math.round(1650 * effectiveMultiplier),
      visitorsEncountered: Math.round(11380 * effectiveMultiplier),
      conversionRate: 14.5, // 14.5% conversion on Blog / Content pages
      startToFinishCompletionRate: 88.5,
      primaryPixel: 'GA4 (sign_up) + Meta Pixel (CompleteRegistration)',
      leadType: 'Subscriber Lead',
      status: 'Nurture Stream'
    },
    {
      formId: 'beneficiary_reg_form',
      formName: 'Beneficiary & Community Grant Intake Form',
      category: 'Social Impact & Grant Applicants',
      completions: Math.round(410 * effectiveMultiplier),
      visitorsEncountered: Math.round(4360 * effectiveMultiplier),
      conversionRate: 9.4, // 9.4% conversion
      startToFinishCompletionRate: 71.0,
      primaryPixel: 'Meta Pixel + GA4 (form_submit)',
      leadType: 'Beneficiary Registration Intake',
      status: 'Verified Intake'
    },
    {
      formId: 'career_portal_form',
      formName: 'Job Application & Career Portal Form',
      category: 'Talent Acquisition & Hiring Applicants',
      completions: Math.round(185 * effectiveMultiplier),
      visitorsEncountered: Math.round(3030 * effectiveMultiplier),
      conversionRate: 6.1, // 6.1% conversion on Career portal
      startToFinishCompletionRate: 62.5,
      primaryPixel: 'LinkedIn Insight Tag + GA4',
      leadType: 'Applicant Resume Candidate',
      status: 'HR Review'
    }
  ], [effectiveMultiplier]);

  // Page Conversion Dataset
  const pageConversionData = useMemo(() => [
    {
      startingPageCategory: 'Blog Posts & Financial Articles',
      startingVisitors: Math.round(24500 * effectiveMultiplier),
      clickThroughToFormOrContact: Math.round(3038 * effectiveMultiplier),
      conversionRate: 12.4, // 12.4% page conversion
      destinationForm: 'Loan Application / Contact Us Page',
      funnelPerformance: 'High Content Nurture Path',
      topArticle: 'Mastering Logbook Loans in Kenya'
    },
    {
      startingPageCategory: 'Home Page',
      startingVisitors: Math.round(18200 * effectiveMultiplier),
      clickThroughToFormOrContact: Math.round(4022 * effectiveMultiplier),
      conversionRate: 22.1, // 22.1% page conversion
      destinationForm: 'Hero Lead Form / Contact Us',
      funnelPerformance: 'Top Direct Funnel Entry',
      topArticle: 'N/A (Main Landing)'
    },
    {
      startingPageCategory: 'About Us Page',
      startingVisitors: Math.round(6400 * effectiveMultiplier),
      clickThroughToFormOrContact: Math.round(1190 * effectiveMultiplier),
      conversionRate: 18.6, // 18.6% page conversion
      destinationForm: 'Advisory Contact Us Form',
      funnelPerformance: 'Trust & Credibility Funnel',
      topArticle: 'Community Vision'
    },
    {
      startingPageCategory: 'Products & Beneficiary Services Page',
      startingVisitors: Math.round(9800 * effectiveMultiplier),
      clickThroughToFormOrContact: Math.round(3087 * effectiveMultiplier),
      conversionRate: 31.5, // 31.5% page conversion
      destinationForm: 'Direct Loan & Grant Application Form',
      funnelPerformance: 'Highest Intent Funnel Stage',
      topArticle: 'Biashara Credit Terms'
    }
  ], [effectiveMultiplier]);

  // Conversion Funnel Steps Breakdown
  const conversionFunnelSteps = useMemo(() => [
    { stepName: '1. Total Site Visitors', count: Math.round(48290 * effectiveMultiplier), pct: '100%', dropOffPct: '0%' },
    { stepName: '2. Content Engagement (20s+)', count: Math.round(23275 * effectiveMultiplier), pct: '48.2%', dropOffPct: '51.8%' },
    { stepName: '3. Clicked to Form / Contact Page', count: Math.round(11300 * effectiveMultiplier), pct: '23.4%', dropOffPct: '51.5%' },
    { stepName: '4. Form Fields Started', count: Math.round(6180 * effectiveMultiplier), pct: '12.8%', dropOffPct: '45.3%' },
    { stepName: '5. Qualified Form Submission / Lead Generated', count: Math.round(2728 * effectiveMultiplier), pct: '5.65%', dropOffPct: '55.9%' }
  ], [effectiveMultiplier]);

  // --- DATASETS & CALCULATIONS INFLUENCED BY SET PIXELS ---

  // 1. Executive Trend Charts Data (influenced by set pixel signals & selected timeframe)
  const trafficOverviewData = useMemo(() => {
    switch (chartTimeframe) {
      case '7D':
        return [
          { date: 'Mon', pageviews: Math.round(1200 * effectiveMultiplier), visitors: Math.round(620 * effectiveMultiplier), organic: Math.round(450 * effectiveMultiplier), referral: Math.round(150 * effectiveMultiplier), direct: Math.round(400 * effectiveMultiplier), bounceRate: 38.2, conversions: Math.round(20 * effectiveMultiplier) },
          { date: 'Tue', pageviews: Math.round(1550 * effectiveMultiplier), visitors: Math.round(780 * effectiveMultiplier), organic: Math.round(590 * effectiveMultiplier), referral: Math.round(180 * effectiveMultiplier), direct: Math.round(480 * effectiveMultiplier), bounceRate: 35.6, conversions: Math.round(28 * effectiveMultiplier) },
          { date: 'Wed', pageviews: Math.round(1400 * effectiveMultiplier), visitors: Math.round(710 * effectiveMultiplier), organic: Math.round(520 * effectiveMultiplier), referral: Math.round(160 * effectiveMultiplier), direct: Math.round(440 * effectiveMultiplier), bounceRate: 36.4, conversions: Math.round(24 * effectiveMultiplier) },
          { date: 'Thu', pageviews: Math.round(1800 * effectiveMultiplier), visitors: Math.round(920 * effectiveMultiplier), organic: Math.round(710 * effectiveMultiplier), referral: Math.round(220 * effectiveMultiplier), direct: Math.round(570 * effectiveMultiplier), bounceRate: 32.1, conversions: Math.round(35 * effectiveMultiplier) },
          { date: 'Fri', pageviews: Math.round(2100 * effectiveMultiplier), visitors: Math.round(1080 * effectiveMultiplier), organic: Math.round(860 * effectiveMultiplier), referral: Math.round(260 * effectiveMultiplier), direct: Math.round(660 * effectiveMultiplier), bounceRate: 29.8, conversions: Math.round(42 * effectiveMultiplier) },
          { date: 'Sat', pageviews: Math.round(2450 * effectiveMultiplier), visitors: Math.round(1290 * effectiveMultiplier), organic: Math.round(1020 * effectiveMultiplier), referral: Math.round(310 * effectiveMultiplier), direct: Math.round(780 * effectiveMultiplier), bounceRate: 27.5, conversions: Math.round(51 * effectiveMultiplier) },
          { date: 'Sun', pageviews: Math.round(2800 * effectiveMultiplier), visitors: Math.round(1450 * effectiveMultiplier), organic: Math.round(1180 * effectiveMultiplier), referral: Math.round(360 * effectiveMultiplier), direct: Math.round(890 * effectiveMultiplier), bounceRate: 25.4, conversions: Math.round(60 * effectiveMultiplier) }
        ];
      case '30D':
        return [
          { date: 'Jul 05', pageviews: Math.round(2400 * effectiveMultiplier), visitors: Math.round(1200 * effectiveMultiplier), organic: Math.round(900 * effectiveMultiplier), referral: Math.round(300 * effectiveMultiplier), direct: Math.round(800 * effectiveMultiplier), bounceRate: 39.1, conversions: Math.round(42 * effectiveMultiplier) },
          { date: 'Jul 10', pageviews: Math.round(3100 * effectiveMultiplier), visitors: Math.round(1600 * effectiveMultiplier), organic: Math.round(1200 * effectiveMultiplier), referral: Math.round(400 * effectiveMultiplier), direct: Math.round(950 * effectiveMultiplier), bounceRate: 36.5, conversions: Math.round(58 * effectiveMultiplier) },
          { date: 'Jul 15', pageviews: Math.round(2800 * effectiveMultiplier), visitors: Math.round(1450 * effectiveMultiplier), organic: Math.round(1050 * effectiveMultiplier), referral: Math.round(350 * effectiveMultiplier), direct: Math.round(900 * effectiveMultiplier), bounceRate: 37.0, conversions: Math.round(51 * effectiveMultiplier) },
          { date: 'Jul 20', pageviews: Math.round(4200 * effectiveMultiplier), visitors: Math.round(2100 * effectiveMultiplier), organic: Math.round(1700 * effectiveMultiplier), referral: Math.round(600 * effectiveMultiplier), direct: Math.round(1200 * effectiveMultiplier), bounceRate: 31.8, conversions: Math.round(84 * effectiveMultiplier) },
          { date: 'Jul 25', pageviews: Math.round(3900 * effectiveMultiplier), visitors: Math.round(1950 * effectiveMultiplier), organic: Math.round(1500 * effectiveMultiplier), referral: Math.round(550 * effectiveMultiplier), direct: Math.round(1100 * effectiveMultiplier), bounceRate: 33.2, conversions: Math.round(76 * effectiveMultiplier) },
          { date: 'Jul 30', pageviews: Math.round(5400 * effectiveMultiplier), visitors: Math.round(2800 * effectiveMultiplier), organic: Math.round(2200 * effectiveMultiplier), referral: Math.round(850 * effectiveMultiplier), direct: Math.round(1450 * effectiveMultiplier), bounceRate: 28.4, conversions: Math.round(112 * effectiveMultiplier) },
          { date: 'Aug 03', pageviews: Math.round(6100 * effectiveMultiplier), visitors: Math.round(3200 * effectiveMultiplier), organic: Math.round(2600 * effectiveMultiplier), referral: Math.round(980 * effectiveMultiplier), direct: Math.round(1600 * effectiveMultiplier), bounceRate: 26.2, conversions: Math.round(135 * effectiveMultiplier) }
        ];
      case 'Quarterly':
        return [
          { date: 'Q1 (Jan-Mar)', pageviews: Math.round(14200 * effectiveMultiplier), visitors: Math.round(7100 * effectiveMultiplier), organic: Math.round(5200 * effectiveMultiplier), referral: Math.round(1800 * effectiveMultiplier), direct: Math.round(4500 * effectiveMultiplier), bounceRate: 41.2, conversions: Math.round(280 * effectiveMultiplier) },
          { date: 'Q2 (Apr-Jun)', pageviews: Math.round(18500 * effectiveMultiplier), visitors: Math.round(9400 * effectiveMultiplier), organic: Math.round(7100 * effectiveMultiplier), referral: Math.round(2300 * effectiveMultiplier), direct: Math.round(5800 * effectiveMultiplier), bounceRate: 35.8, conversions: Math.round(360 * effectiveMultiplier) },
          { date: 'Q3 (Jul-Sep)', pageviews: Math.round(24800 * effectiveMultiplier), visitors: Math.round(12900 * effectiveMultiplier), organic: Math.round(9800 * effectiveMultiplier), referral: Math.round(3200 * effectiveMultiplier), direct: Math.round(7600 * effectiveMultiplier), bounceRate: 29.4, conversions: Math.round(490 * effectiveMultiplier) },
          { date: 'Q4 (Oct-Dec)', pageviews: Math.round(31200 * effectiveMultiplier), visitors: Math.round(16100 * effectiveMultiplier), organic: Math.round(12500 * effectiveMultiplier), referral: Math.round(4100 * effectiveMultiplier), direct: Math.round(9800 * effectiveMultiplier), bounceRate: 24.1, conversions: Math.round(640 * effectiveMultiplier) }
        ];
      case 'Half Year':
        return [
          { date: 'Mar', pageviews: Math.round(4800 * effectiveMultiplier), visitors: Math.round(2400 * effectiveMultiplier), organic: Math.round(1800 * effectiveMultiplier), referral: Math.round(600 * effectiveMultiplier), direct: Math.round(1500 * effectiveMultiplier), bounceRate: 38.0, conversions: Math.round(95 * effectiveMultiplier) },
          { date: 'Apr', pageviews: Math.round(5600 * effectiveMultiplier), visitors: Math.round(2900 * effectiveMultiplier), organic: Math.round(2100 * effectiveMultiplier), referral: Math.round(720 * effectiveMultiplier), direct: Math.round(1780 * effectiveMultiplier), bounceRate: 35.2, conversions: Math.round(110 * effectiveMultiplier) },
          { date: 'May', pageviews: Math.round(6200 * effectiveMultiplier), visitors: Math.round(3200 * effectiveMultiplier), organic: Math.round(2450 * effectiveMultiplier), referral: Math.round(810 * effectiveMultiplier), direct: Math.round(1940 * effectiveMultiplier), bounceRate: 33.4, conversions: Math.round(128 * effectiveMultiplier) },
          { date: 'Jun', pageviews: Math.round(7100 * effectiveMultiplier), visitors: Math.round(3700 * effectiveMultiplier), organic: Math.round(2890 * effectiveMultiplier), referral: Math.round(920 * effectiveMultiplier), direct: Math.round(2290 * effectiveMultiplier), bounceRate: 31.0, conversions: Math.round(145 * effectiveMultiplier) },
          { date: 'Jul', pageviews: Math.round(8400 * effectiveMultiplier), visitors: Math.round(4300 * effectiveMultiplier), organic: Math.round(3400 * effectiveMultiplier), referral: Math.round(1100 * effectiveMultiplier), direct: Math.round(2700 * effectiveMultiplier), bounceRate: 28.5, conversions: Math.round(172 * effectiveMultiplier) },
          { date: 'Aug', pageviews: Math.round(9800 * effectiveMultiplier), visitors: Math.round(5100 * effectiveMultiplier), organic: Math.round(4100 * effectiveMultiplier), referral: Math.round(1350 * effectiveMultiplier), direct: Math.round(3150 * effectiveMultiplier), bounceRate: 26.1, conversions: Math.round(205 * effectiveMultiplier) }
        ];
      case 'Annually':
        return [
          { date: 'Jan', pageviews: Math.round(3800 * effectiveMultiplier), visitors: Math.round(1900 * effectiveMultiplier), organic: Math.round(1400 * effectiveMultiplier), referral: Math.round(480 * effectiveMultiplier), direct: Math.round(1220 * effectiveMultiplier), bounceRate: 42.0, conversions: Math.round(75 * effectiveMultiplier) },
          { date: 'Feb', pageviews: Math.round(4200 * effectiveMultiplier), visitors: Math.round(2100 * effectiveMultiplier), organic: Math.round(1600 * effectiveMultiplier), referral: Math.round(520 * effectiveMultiplier), direct: Math.round(1360 * effectiveMultiplier), bounceRate: 40.5, conversions: Math.round(84 * effectiveMultiplier) },
          { date: 'Mar', pageviews: Math.round(4800 * effectiveMultiplier), visitors: Math.round(2400 * effectiveMultiplier), organic: Math.round(1800 * effectiveMultiplier), referral: Math.round(600 * effectiveMultiplier), direct: Math.round(1500 * effectiveMultiplier), bounceRate: 38.0, conversions: Math.round(95 * effectiveMultiplier) },
          { date: 'Apr', pageviews: Math.round(5600 * effectiveMultiplier), visitors: Math.round(2900 * effectiveMultiplier), organic: Math.round(2100 * effectiveMultiplier), referral: Math.round(720 * effectiveMultiplier), direct: Math.round(1780 * effectiveMultiplier), bounceRate: 35.2, conversions: Math.round(110 * effectiveMultiplier) },
          { date: 'May', pageviews: Math.round(6200 * effectiveMultiplier), visitors: Math.round(3200 * effectiveMultiplier), organic: Math.round(2450 * effectiveMultiplier), referral: Math.round(810 * effectiveMultiplier), direct: Math.round(1940 * effectiveMultiplier), bounceRate: 33.4, conversions: Math.round(128 * effectiveMultiplier) },
          { date: 'Jun', pageviews: Math.round(7100 * effectiveMultiplier), visitors: Math.round(3700 * effectiveMultiplier), organic: Math.round(2890 * effectiveMultiplier), referral: Math.round(920 * effectiveMultiplier), direct: Math.round(2290 * effectiveMultiplier), bounceRate: 31.0, conversions: Math.round(145 * effectiveMultiplier) },
          { date: 'Jul', pageviews: Math.round(8400 * effectiveMultiplier), visitors: Math.round(4300 * effectiveMultiplier), organic: Math.round(3400 * effectiveMultiplier), referral: Math.round(1100 * effectiveMultiplier), direct: Math.round(2700 * effectiveMultiplier), bounceRate: 28.5, conversions: Math.round(172 * effectiveMultiplier) },
          { date: 'Aug', pageviews: Math.round(9800 * effectiveMultiplier), visitors: Math.round(5100 * effectiveMultiplier), organic: Math.round(4100 * effectiveMultiplier), referral: Math.round(1350 * effectiveMultiplier), direct: Math.round(3150 * effectiveMultiplier), bounceRate: 26.1, conversions: Math.round(205 * effectiveMultiplier) },
          { date: 'Sep', pageviews: Math.round(10500 * effectiveMultiplier), visitors: Math.round(5500 * effectiveMultiplier), organic: Math.round(4400 * effectiveMultiplier), referral: Math.round(1420 * effectiveMultiplier), direct: Math.round(3380 * effectiveMultiplier), bounceRate: 25.0, conversions: Math.round(220 * effectiveMultiplier) },
          { date: 'Oct', pageviews: Math.round(11200 * effectiveMultiplier), visitors: Math.round(5900 * effectiveMultiplier), organic: Math.round(4750 * effectiveMultiplier), referral: Math.round(1510 * effectiveMultiplier), direct: Math.round(3640 * effectiveMultiplier), bounceRate: 24.2, conversions: Math.round(238 * effectiveMultiplier) },
          { date: 'Nov', pageviews: Math.round(12400 * effectiveMultiplier), visitors: Math.round(6400 * effectiveMultiplier), organic: Math.round(5200 * effectiveMultiplier), referral: Math.round(1680 * effectiveMultiplier), direct: Math.round(3920 * effectiveMultiplier), bounceRate: 23.0, conversions: Math.round(260 * effectiveMultiplier) },
          { date: 'Dec', pageviews: Math.round(13800 * effectiveMultiplier), visitors: Math.round(7100 * effectiveMultiplier), organic: Math.round(5800 * effectiveMultiplier), referral: Math.round(1890 * effectiveMultiplier), direct: Math.round(4310 * effectiveMultiplier), bounceRate: 21.8, conversions: Math.round(295 * effectiveMultiplier) }
        ];
      default:
        return [];
    }
  }, [chartTimeframe, effectiveMultiplier]);

  // 2. Kenyan Counties Traffic Breakdown
  const kenyanCountyData = useMemo(() => [
    { county: 'Embu', visitors: Math.round(14200 * effectiveMultiplier), percentage: 34, growth: '+22.4%', loansInquired: Math.round(380 * effectiveMultiplier) },
    { county: 'Nairobi', visitors: Math.round(11800 * effectiveMultiplier), percentage: 28, growth: '+15.1%', loansInquired: Math.round(420 * effectiveMultiplier) },
    { county: 'Kiambu', visitors: Math.round(5200 * effectiveMultiplier), percentage: 12, growth: '+8.3%', loansInquired: Math.round(145 * effectiveMultiplier) },
    { county: 'Meru', visitors: Math.round(4100 * effectiveMultiplier), percentage: 10, growth: '+18.7%', loansInquired: Math.round(120 * effectiveMultiplier) },
    { county: 'Machakos', visitors: Math.round(3300 * effectiveMultiplier), percentage: 8, growth: '+11.2%', loansInquired: Math.round(92 * effectiveMultiplier) },
    { county: 'Nakuru', visitors: Math.round(1800 * effectiveMultiplier), percentage: 4, growth: '+6.5%', loansInquired: Math.round(48 * effectiveMultiplier) },
    { county: 'Mombasa', visitors: Math.round(1600 * effectiveMultiplier), percentage: 4, growth: '+5.0%', loansInquired: Math.round(35 * effectiveMultiplier) }
  ], [effectiveMultiplier]);

  // 3. Traffic Sources Breakdown (Influenced by Active Set Pixels)
  const trafficSourcesData = useMemo(() => {
    const hasGA = activePixels.some(p => p.platform === 'google' || p.platform === 'gtm');
    const hasMeta = activePixels.some(p => p.platform === 'meta');
    const hasTikTok = activePixels.some(p => p.platform === 'tiktok');
    const hasLinkedIn = activePixels.some(p => p.platform === 'linkedin');

    let organicVal = hasGA ? 46 : 30;
    let directVal = 22;
    let socialVal = hasMeta ? 22 : (hasTikTok ? 18 : 10);
    let referralVal = hasLinkedIn ? 12 : 8;
    let emailVal = 8;

    const total = organicVal + directVal + socialVal + referralVal + emailVal;

    return [
      { name: 'Organic Search (GA4 Signal)', value: Math.round((organicVal / total) * 100), color: '#074504', verified: hasGA },
      { name: 'Direct Visits', value: Math.round((directVal / total) * 100), color: '#C0991B', verified: true },
      { name: 'Social Media (Meta/TikTok Pixel)', value: Math.round((socialVal / total) * 100), color: '#599200', verified: hasMeta || hasTikTok },
      { name: 'Referral & LinkedIn B2B', value: Math.round((referralVal / total) * 100), color: '#026451', verified: hasLinkedIn },
      { name: 'Email Newsletters', value: Math.round((emailVal / total) * 100), color: '#826507', verified: true }
    ];
  }, [activePixels]);

  // 4. Device & OS Distribution
  const deviceDistributionData = [
    { name: 'Mobile (Android & iOS)', value: 68, color: '#074504' },
    { name: 'Desktop (Windows & Mac)', value: 26, color: '#C0991B' },
    { name: 'Tablet', value: 6, color: '#599200' }
  ];

  // 5. Keyword Rankings (SEO Analytics)
  const keywordRankings: KeywordRank[] = [
    { keyword: 'logbook loan Embu microfinance', position: 1, delta: 0, searches: 4800, ctr: '28.4%', impressions: 16800 },
    { keyword: 'microfinance interest rates Kenya', position: 2, delta: 1, searches: 12500, ctr: '19.2%', impressions: 38200 },
    { keyword: 'biashara loan requirements Kenya', position: 1, delta: 2, searches: 8900, ctr: '24.1%', impressions: 24100 },
    { keyword: 'Neema HEEP loans contact', position: 1, delta: 0, searches: 3400, ctr: '42.8%', impressions: 7200 },
    { keyword: 'emergency business funding Embu', position: 3, delta: -1, searches: 2100, ctr: '12.5%', impressions: 9400 },
    { keyword: 'how to calculate logbook loan APR', position: 4, delta: 3, searches: 5600, ctr: '8.7%', impressions: 18900 }
  ];

  // 6. Campaign Analytics Data
  const campaignsList: CampaignUTM[] = [
    { id: 'c-1', name: 'Q3 Biashara Loan Boost', source: 'facebook_ads', medium: 'cpc', clicks: 8400, conversions: 420, convRate: '5.0%', cost: 'KSh 45,000', revenue: 'KSh 680,000', roi: '1411%', status: 'Active' },
    { id: 'c-2', name: 'Weekly Financial Digest Newsletter', source: 'newsletter_email', medium: 'email', clicks: 3200, conversions: 280, convRate: '8.75%', cost: 'KSh 5,000', revenue: 'KSh 320,000', roi: '6300%', status: 'Active' },
    { id: 'c-3', name: 'Embu Farmer Logbook Campaign', source: 'google_search', medium: 'cpc', clicks: 4100, conversions: 310, convRate: '7.56%', cost: 'KSh 38,000', revenue: 'KSh 510,000', roi: '1242%', status: 'Active' },
    { id: 'c-4', name: 'WhatsApp Community Referral Link', source: 'whatsapp_group', medium: 'social_referral', clicks: 5600, conversions: 390, convRate: '6.96%', cost: 'KSh 0', revenue: 'KSh 480,000', roi: '∞', status: 'Active' }
  ];

  // 7. Rich Articles Performance Dataset
  const articlePerformanceList: ArticlePerformance[] = useMemo(() => {
    return [
      {
        id: 'art-1',
        title: 'Mastering Logbook Loans in Kenya: A Complete 2026 Guide',
        author: 'Patrick Munene',
        category: 'Financial Literacy',
        views: 18450,
        uniqueViews: 14200,
        avgReadTime: '4m 12s',
        completionRate: 84,
        shares: 640,
        downloads: 210,
        comments: 48,
        likes: 310,
        bookmarks: 185,
        score: 96,
        grade: 'A+',
        decayIndex: 2,
        freshness: '100% (Updated Recently)',
        aiRecommendation: 'High performer! Add a direct loan calculator widget inside section 2 to boost conversions by +18%.'
      },
      {
        id: 'art-2',
        title: '5 Crucial Requirements for Quick Business Loan Approval',
        author: 'Jane Njeri',
        category: 'Business Growth',
        views: 12800,
        uniqueViews: 9800,
        avgReadTime: '3m 45s',
        completionRate: 78,
        shares: 420,
        downloads: 140,
        comments: 32,
        likes: 210,
        bookmarks: 110,
        score: 89,
        grade: 'A',
        decayIndex: 5,
        freshness: '92% Fresh',
        aiRecommendation: 'Ranking #2 for "biashara loan requirements". Update meta description to increase organic CTR.'
      },
      {
        id: 'art-3',
        title: 'How Agricultural Asset Financing is Empowering Embu Farmers',
        author: 'Eunice Wanjiru',
        category: 'Community Impact',
        views: 8900,
        uniqueViews: 7100,
        avgReadTime: '5m 05s',
        completionRate: 88,
        shares: 510,
        downloads: 95,
        comments: 29,
        likes: 280,
        bookmarks: 92,
        score: 84,
        grade: 'B+',
        decayIndex: 8,
        freshness: '85% Fresh',
        aiRecommendation: 'High share rate on WhatsApp! Feature as a hero story on the homepage to leverage community trust.'
      },
      {
        id: 'art-4',
        title: 'Understanding Interest Rates: Flat vs Reducing Balance',
        author: 'Patrick Munene',
        category: 'Financial Literacy',
        views: 6400,
        uniqueViews: 5100,
        avgReadTime: '2m 50s',
        completionRate: 62,
        shares: 180,
        downloads: 60,
        comments: 18,
        likes: 120,
        bookmarks: 54,
        score: 72,
        grade: 'B',
        decayIndex: 18,
        freshness: '70% Fresh',
        aiRecommendation: 'Traffic declining slightly. Refresh with 2026 interest rate comparison table.'
      }
    ];
  }, []);

  // Filtered Article Performance
  const filteredArticles = useMemo(() => {
    return articlePerformanceList.filter(art => {
      const matchAuthor = selectedAuthor === 'All' || art.author === selectedAuthor;
      const matchQuery = !searchQuery || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAuthor && matchQuery;
    });
  }, [articlePerformanceList, selectedAuthor, searchQuery]);

  // Export functions (PDF, Excel, CSV)
  const exportToCSV = () => {
    const csvData = filteredArticles.map(a => ({
      Title: a.title,
      Author: a.author,
      Category: a.category,
      Views: a.views,
      UniqueViews: a.uniqueViews,
      AvgReadTime: a.avgReadTime,
      CompletionRatePct: a.completionRate,
      Shares: a.shares,
      Comments: a.comments,
      PerformanceScore: a.score,
      Grade: a.grade
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Analytics_${activeSubmodule}_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported Successfully!');
  };

  const exportToExcel = async () => {
    try {
      if (filteredArticles.length === 0) {
        showToast('No data available to export.');
        return;
      }
      const headers = Object.keys(filteredArticles[0]);
      const headerRow = headers.map(h => ({ value: h, fontWeight: 'bold' }));
      const dataRows = filteredArticles.map(item =>
        headers.map(h => {
          const val = (item as Record<string, any>)[h];
          if (typeof val === 'number') return { type: Number, value: val };
          if (typeof val === 'boolean') return { type: Boolean, value: val };
          return { type: String, value: val != null ? String(val) : '' };
        })
      );
      await (writeXlsxFile as any)([headerRow, ...dataRows]).toFile(
        `Analytics_${activeSubmodule}_${dateFilter}.xlsx`
      );
      showToast('Excel Sheet Exported Successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to export Excel sheet.');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Executive Analytics Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()} | Scope: ${dateFilter} | Role: ${roleView}`, 14, 28);

    const tableData = filteredArticles.map(a => [
      a.title.slice(0, 30) + '...',
      a.author,
      a.category,
      a.views.toLocaleString(),
      a.avgReadTime
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Article Title', 'Author', 'Category', 'Views', 'Avg Time']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [7, 69, 4] }
    });

    doc.save(`Executive_Report_${dateFilter}.pdf`);
    showToast('PDF Executive Report Downloaded!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. TOP MODULE HEADER BAR WITH SUBMODULE TABS */}
      <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#074504] p-6 md:p-8 rounded-2xl border border-[#C0991B]/30 text-white shadow-lg space-y-4">
        {/* 1. Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#C0991B] shrink-0" /> Analytics Module
          </h2>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-red-600/30 text-red-200 border border-red-500/40 rounded-full text-xs font-black flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>{liveVisitors} Live Online</span>
            </div>
            <span className="px-3 py-1 bg-[#C0991B] text-[#074504] text-[10px] font-black uppercase tracking-widest rounded-full">
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* 2. Description Text */}
        <p className="text-xs md:text-sm text-gray-200 font-medium max-w-4xl leading-relaxed">
          Comprehensive real-time tracking of website performance, audience demographics, SEO health, and content performance.
        </p>

        {/* 3. CTA buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 bg-[#C0991B] hover:bg-[#a88414] text-[#074504] text-xs font-black uppercase rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Generate Report
            </button>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-white/20 shadow-xs"
            >
              <Download className="w-4 h-4 text-[#C0991B]" /> Data Export
            </button>
          </div>
        </div>

        {/* SUBMODULE NAVIGATION TABS */}
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10 flex-wrap sm:flex-nowrap">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutGridIcon },
            { id: 'traffic', label: 'Traffic', icon: TrendingUp },
            { id: 'conversions', label: 'Conversions', icon: Target },
            { id: 'seo', label: 'SEO', icon: BarChart2 },
            { id: 'audience', label: 'Audience', icon: Users },
            { id: 'engagement', label: 'Engagement', icon: Share2 },
            { id: 'reports', label: 'Reports', icon: FileSpreadsheet }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubmodule === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubmodule(tab.id as AnalyticsSubmodule)}
                className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 min-w-0 text-center ${
                  isActive 
                    ? 'bg-[#C0991B] text-[#074504] shadow-md scale-[1.01]' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#074504]' : 'text-[#C0991B]'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GLOBAL CONTROLS, SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-bold">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search article, author, category, campaign, keyword..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[#074504] focus:border-[#074504]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          {/* Preset Date Range */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {(['Today', '7 Days', '30 Days', 'Quarterly', 'Half year', 'Year'] as const).map(preset => (
              <button
                key={preset}
                onClick={() => setDateFilter(preset)}
                className={`px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap font-black ${
                  dateFilter === preset ? 'bg-[#074504] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {searchQuery !== '' && (
            <button
              onClick={() => {
                setSelectedAuthor('All');
                setSearchQuery('');
                showToast('Filters reset to default');
              }}
              className="px-2.5 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear active search"
            >
              <FilterX className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. SUBMODULE CONTENT RENDER SWITCH */}

      {/* SUBMODULE 1: EXECUTIVE DASHBOARD */}
      {activeSubmodule === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Executive Overview Banner */}
          <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#032302] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-[#C0991B]/30">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <h3 className="text-2xl font-black tracking-tight">
                  Digital Performance Overview
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-medium">
                  Overall digital engagement is up <span className="text-[#C0991B] font-bold">+22.4%</span> this month, driven primarily by Embu &amp; Nairobi logbook loan inquiries. Core Web Vitals score is <span className="text-emerald-400 font-bold">98/100</span> with 0 security or crawl issues detected.
                </p>
              </div>

              {/* Status Dial / Health Score */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-black text-[#C0991B]">96 / 100</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-0.5">Website Health Index</div>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div className="space-y-1 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> SEO: Excellent
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Clock className="w-4 h-4" /> Speed: 1.2s LCP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 MOST IMPACTFUL KPI METRIC CARDS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Visitors', value: dynamicVisitors.toLocaleString(), change: '+18.4%', trend: 'up', icon: Users },
              { label: 'Total Page Views', value: dynamicPageViews.toLocaleString(), change: '+24.6%', trend: 'up', icon: Eye },
              { label: 'Organic Search', value: Math.round(dynamicVisitors * 0.642).toLocaleString(), change: '+18.2%', trend: 'up', icon: Search },
              { label: 'Social Media', value: Math.round(dynamicVisitors * 0.218).toLocaleString(), change: '+12.5%', trend: 'up', icon: Share2 }
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-[#074504] transition-all">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                    <span className="truncate">{kpi.label}</span>
                    <Icon className="w-3.5 h-3.5 text-[#C0991B] shrink-0" />
                  </div>
                  <div className="text-lg sm:text-xl font-black text-[#074504]">{kpi.value}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MAIN EXECUTIVE CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Traffic Growth Area Chart (12 cols) */}
            <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C0991B]" /> Traffic Growth &amp; Organic Visitors Trend
                </h3>
                
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
                  {(['7D', '30D', 'Quarterly', 'Half Year', 'Annually'] as const).map(tf => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => handleTimeframeChange(tf)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        chartTimeframe === tf 
                          ? 'bg-[#074504] text-[#C0991B] shadow-xs' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficOverviewData}>
                    <defs>
                      <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#074504" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#074504" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C0991B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C0991B" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBounce" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="direct" name="Direct Visits" stroke="#074504" fillOpacity={1} fill="url(#colorDirect)" strokeWidth={3} />
                    <Area type="monotone" dataKey="organic" name="Organic Search Traffic" stroke="#C0991B" fillOpacity={1} fill="url(#colorOrganic)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="bounceRate" name="Bounce Rate (%)" stroke="#dc2626" fillOpacity={1} fill="url(#colorBounce)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* SECOND EXECUTIVE ROW: TOP PERFORMING ARTICLES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Top Articles Performance Table (12 cols) */}
            <div className="lg:col-span-12 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C0991B]" /> Top Content Performance
                </h3>
                <button
                  onClick={() => setActiveSubmodule('content')}
                  className="text-xs font-bold text-[#074504] hover:text-[#599200] flex items-center gap-1 cursor-pointer"
                >
                  View All ({articlePerformanceList.length}) <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-black uppercase text-[10px]">
                      <th className="pb-3">Article Title</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3 text-center">Views</th>
                      <th className="pb-3 text-center">Read Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredArticles.slice(0, 4).map(art => (
                      <tr key={art.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 pr-2 font-bold text-gray-900 max-w-[260px] truncate">
                          {art.title}
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 bg-[#074504]/10 text-[#074504] font-extrabold rounded-md text-[10px]">
                            {art.category}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-gray-800">
                          {art.views.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-gray-600">
                          {art.avgReadTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBMODULE 3: CONVERSIONS & FUNNEL ANALYTICS */}
      {activeSubmodule === 'conversions' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner & Real-time Pixel Status */}
          <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#022002] p-6 rounded-3xl text-white shadow-xl border border-[#C0991B]/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[#C0991B] font-extrabold text-xs uppercase tracking-widest">
                  <Target className="w-4 h-4 animate-pulse" /> Conversion Engine &amp; Lead Funnel Telemetry
                </div>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  Website Conversions &amp; Qualified Business Leads
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Real-time form submissions, lead generation performance, and page-to-form click-through funnel tracking.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 bg-white/10 p-3 rounded-2xl border border-white/20">
                <div className="text-center">
                  <div className="text-xs font-bold text-white/70 uppercase">Total Form Leads</div>
                  <div className="text-2xl font-black text-[#C0991B]">{dynamicConversions.toLocaleString()}</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-xs font-bold text-white/70 uppercase">Live Conversions</div>
                  <div className="text-2xl font-black text-emerald-400 animate-pulse">{liveConversionsCount}</div>
                </div>
              </div>
            </div>

            {/* Pixel Signal Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className="text-white/70 uppercase text-[10px]">Active Tracking Pixel Telemetry:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Meta Pixel (Lead Event)
                </span>
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GA4 (generate_lead)
                </span>
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> TikTok Pixel (SubmitForm)
                </span>
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> LinkedIn Insight Tag
                </span>
              </div>
            </div>
          </div>

          {/* ================= SECTION 1: FORM SUBMISSION ANALYTICS ================= */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            
            {/* Objective Banner Card */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-[#074504] text-[#C0991B] rounded-xl shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs uppercase text-[#074504]">
                  Form Submission Objective
                </h4>
                <p className="text-xs text-emerald-900 font-bold leading-relaxed">
                  Measure whether the website traffic is actually turning into qualified leads or paying customers for the business side of site.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#074504] uppercase flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C0991B]" /> Form Submission &amp; Lead Generation Breakdown
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">
                  Percentage of website visitors completing each specific form and total qualified business leads generated directly from website content.
                </p>
              </div>
            </div>

            {/* Form Performance Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formSubmissionsData.map((f) => (
                <div key={f.formId} className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4 flex flex-col justify-between hover:border-[#074504]/40 transition-all shadow-2xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md uppercase">
                        {f.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 font-mono">
                        {f.primaryPixel}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-gray-900 leading-snug">{f.formName}</h4>
                    <p className="text-[11px] font-medium text-gray-500">{f.category}</p>

                    <div className="pt-2 border-t border-gray-200/80 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-bold">Visitor Conversion %:</span>
                        <span className="text-base font-black text-[#074504] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {f.conversionRate}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-gray-600">
                        <span>Leads Generated:</span>
                        <strong className="text-gray-900 font-black text-sm">{f.completions.toLocaleString()} leads</strong>
                      </div>

                      <div className="flex justify-between items-center text-gray-500 text-[11px]">
                        <span>Start-to-Finish Completion:</span>
                        <strong className="text-emerald-700 font-bold">{f.startToFinishCompletionRate}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#074504] h-full rounded-full" style={{ width: `${f.conversionRate * 5}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Form Submissions Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-black uppercase text-[10px]">
                    <th className="p-3">Specific Form Name</th>
                    <th className="p-3">Business Objective Category</th>
                    <th className="p-3 text-center">Visitor Conversion Rate %</th>
                    <th className="p-3 text-center">Leads Generated</th>
                    <th className="p-3 text-center">Completion Rate</th>
                    <th className="p-3 text-right">Pixel Attribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formSubmissionsData.map((f) => (
                    <tr key={f.formId} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-extrabold text-gray-900">{f.formName}</td>
                      <td className="p-3 text-gray-600 font-medium">{f.category}</td>
                      <td className="p-3 text-center font-black">
                        <span className="px-2.5 py-1 bg-[#074504] text-[#C0991B] rounded-lg text-xs">
                          {f.conversionRate}%
                        </span>
                      </td>
                      <td className="p-3 text-center font-black text-emerald-800">{f.completions.toLocaleString()} leads</td>
                      <td className="p-3 text-center font-bold text-gray-700">{f.startToFinishCompletionRate}%</td>
                      <td className="p-3 text-right font-mono text-[10px] text-gray-500">{f.primaryPixel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ================= SECTION 2: PAGE CONVERSION ANALYTICS ================= */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            
            {/* Objective Banner Card */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-[#826507] text-white rounded-xl shrink-0 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs uppercase text-[#826507]">
                  Page Conversion Objective
                </h4>
                <p className="text-xs text-amber-950 font-bold leading-relaxed">
                  Measure the performance of the funnel or lead capture path by tracking users who start on blog posts, home page, about us, or products pages and click through to a form or the contact us page.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#074504] uppercase flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#C0991B]" /> Page-to-Form Click-Through Funnel Path
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">
                  Percentage of users starting on each primary page category who transition into lead capture forms or Contact Us.
                </p>
              </div>
            </div>

            {/* Starting Page Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pageConversionData.map((p) => (
                <div key={p.startingPageCategory} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-[#826507] bg-amber-100 px-2 py-0.5 rounded-md">
                      {p.funnelPerformance}
                    </span>
                    <h4 className="font-black text-sm text-gray-900 leading-snug">{p.startingPageCategory}</h4>
                    
                    <div className="text-2xl font-black text-[#074504] pt-1">
                      {p.conversionRate}% <span className="text-xs font-bold text-gray-500">Page Conv Rate</span>
                    </div>

                    <div className="space-y-1 text-xs font-medium text-gray-600 pt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span>Starting Traffic:</span>
                        <strong className="text-gray-900">{p.startingVisitors.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Click-Throughs:</span>
                        <strong className="text-emerald-700 font-bold">{p.clickThroughToFormOrContact.toLocaleString()} users</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>Primary Target:</span>
                        <strong className="text-gray-800 truncate max-w-[130px]">{p.destinationForm}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#C0991B] h-full rounded-full" style={{ width: `${p.conversionRate * 2.8}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Funnel Step Breakdown */}
            <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-black text-sm uppercase text-[#C0991B] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Full Lead Capture Funnel Efficiency
                </h4>
                <span className="text-xs font-mono text-emerald-400">Overall Lead Yield: 5.65%</span>
              </div>

              <div className="space-y-3">
                {conversionFunnelSteps.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-200">{step.stepName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-mono">{step.count.toLocaleString()} users ({step.pct})</span>
                        {idx > 0 && <span className="text-red-400 text-[10px]">Drop-off: {step.dropOffPct}</span>}
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${idx === 4 ? 'bg-emerald-400' : 'bg-[#C0991B]'}`} 
                        style={{ width: step.pct }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Incoming Lead Stream Feed */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="font-black text-xs uppercase text-[#074504] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600 animate-pulse" /> Live Real-Time Form Submission Stream
                </h4>
                <span className="text-[10px] font-mono text-gray-500">Updated in Real-Time</span>
              </div>

              <div className="space-y-2">
                {liveLeadFeed.map((lead) => (
                  <div key={lead.id} className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
                      <div>
                        <strong className="text-gray-900 font-black">{lead.name}</strong> completed <span className="text-[#074504] font-bold">{lead.form}</span>
                        <div className="text-[11px] text-gray-500">Started on: <span className="italic">{lead.startingPage}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md font-mono">
                        {lead.pixel}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{lead.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBMODULE 2: TRAFFIC ANALYTICS */}
      {activeSubmodule === 'traffic' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#074504] uppercase flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#C0991B]" /> Traffic &amp; Acquisition Channels
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">
                  Analyze visitors across organic search, social, referral, direct, and email newsletter acquisition channels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#074504]" /> Export CSV
                </button>
              </div>
            </div>

            {/* Acquisition Channel Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {trafficSourcesData.map((src) => (
                <div key={src.name} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-800">{src.name}</span>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: src.color }} />
                  </div>
                  <div className="text-2xl font-black text-[#074504]">{src.value}%</div>
                  <div className="text-[10px] font-bold text-gray-500">
                    {Math.round(48290 * (src.value / 100)).toLocaleString()} estimated visits
                  </div>
                </div>
              ))}
            </div>

            {/* Traffic Sources Bar Chart */}
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficOverviewData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Bar dataKey="organic" name="Organic Search" fill="#074504" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="direct" name="Direct Traffic" fill="#C0991B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="referral" name="Referral & Social" fill="#599200" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        )}

      {/* SUBMODULE 4: SEO ANALYTICS */}
      {activeSubmodule === 'seo' && (
        <div className="space-y-6">
          
          {/* Core Web Vitals & Technical SEO Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Largest Contentful Paint (LCP)</span>
              <div className="text-2xl font-black text-emerald-700">1.2s <span className="text-xs text-gray-400 font-bold">(Good)</span></div>
              <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">Passes Google CWV</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">First Input Delay (FID)</span>
              <div className="text-2xl font-black text-emerald-700">12ms <span className="text-xs text-gray-400 font-bold">(Instant)</span></div>
              <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">Optimal React Performance</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Cumulative Layout Shift (CLS)</span>
              <div className="text-2xl font-black text-emerald-700">0.02 <span className="text-xs text-gray-400 font-bold">(Stable)</span></div>
              <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">Zero visual jumping</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Indexed Pages &amp; Schema</span>
              <div className="text-2xl font-black text-[#074504]">100% Valid</div>
              <p className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">JSON-LD Microdata active</p>
            </div>
          </div>

          {/* Keyword Rankings Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2 border-b border-gray-100 pb-3">
              <Target className="w-4 h-4 text-[#C0991B]" /> Organic Keyword Rankings &amp; Search Visibility
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-black uppercase text-[10px]">
                    <th className="pb-3">Search Keyword</th>
                    <th className="pb-3 text-center">SERP Position</th>
                    <th className="pb-3 text-center">Monthly Searches</th>
                    <th className="pb-3 text-center">CTR %</th>
                    <th className="pb-3 text-right">Impressions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keywordRankings.map((kw, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 font-extrabold text-gray-900">{kw.keyword}</td>
                      <td className="py-3 text-center font-black">
                        <span className="px-2.5 py-1 bg-[#074504] text-[#C0991B] rounded-lg text-xs">
                          #{kw.position}
                        </span>
                      </td>
                      <td className="py-3 text-center font-bold text-gray-700">{kw.searches.toLocaleString()}</td>
                      <td className="py-3 text-center font-bold text-emerald-700">{kw.ctr}</td>
                      <td className="py-3 text-right font-bold text-gray-900">{kw.impressions.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBMODULE 5: AUDIENCE ANALYTICS */}
      {activeSubmodule === 'audience' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner & Live Audience Counter */}
          <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#022002] p-6 rounded-3xl text-white shadow-xl border border-[#C0991B]/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[#C0991B] font-extrabold text-xs uppercase tracking-widest">
                  <Users className="w-4 h-4 animate-pulse" /> Live Audience Intelligence &amp; Visitor Behavior
                </div>
                <h3 className="text-2xl font-black tracking-tight mt-1">
                  Audience Time, Front Door Landing Pages &amp; Fresh Visitor Ratio
                </h3>
                <p className="text-xs text-white/80 font-medium mt-1">
                  Active time per page, top entry landing pages, and real-time active audience monitoring across Kenya counties.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 bg-white/10 p-3.5 rounded-2xl border border-white/20">
                <div className="text-center">
                  <div className="text-xs font-bold text-white/70 uppercase">Live Online Now</div>
                  <div className="text-3xl font-black text-emerald-400 animate-pulse">{liveVisitors}</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-xs font-bold text-white/70 uppercase">Active Set Pixels</div>
                  <div className="text-2xl font-black text-[#C0991B]">{activePixelCount} Live</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className="text-white/70 uppercase text-[10px]">Audience Pixel Verification:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GA4 Visitor Tracking
                </span>
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Meta Pixel Audience Custom List
                </span>
                <span className="px-2.5 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 rounded-lg text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> TikTok Pixel Geo Signals
                </span>
              </div>
            </div>
          </div>

          {/* 1. Average Time Per Page Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C0991B]" /> Average Active Time Per Page
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  <strong>Objective:</strong> Determine how impactful website content, design and layout are on visitor attention and interest.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black rounded-lg self-start md:self-auto">
                Avg Site Dwell: 3m 48s
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase font-black text-[10px] bg-gray-50">
                    <th className="p-3">Page Name / Content Route</th>
                    <th className="p-3">Page Category</th>
                    <th className="p-3">Avg Active Time</th>
                    <th className="p-3">Layout Impact Score</th>
                    <th className="p-3">Design &amp; Content Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { page: '/blog/mastering-logbook-loans-kenya', category: 'Blog Post', time: '4m 32s', score: '9.4/10', note: 'High engagement. Readers digest interest table completely.' },
                    { page: '/products/biashara-boost-credit', category: 'Product Page', time: '3m 50s', score: '9.1/10', note: 'Strong layout. High conversion flow to application form.' },
                    { page: '/about-us', category: 'About Us', time: '2m 15s', score: '8.2/10', note: 'Good trust building. Clear mission presentation.' },
                    { page: '/', category: 'Home Page', time: '1m 48s', score: '8.8/10', note: 'Fast navigation. Effective call-to-action hero section.' },
                    { page: '/blog/embu-business-grant-guide', category: 'Blog Post', time: '3m 12s', score: '8.7/10', note: 'Informative copy. Frequent scrolling to eligibility criteria.' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80">
                      <td className="p-3 font-mono font-bold text-gray-900">{row.page}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">{row.category}</span></td>
                      <td className="p-3 font-black text-[#074504]">{row.time}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-md text-[10px]">{row.score}</span></td>
                      <td className="p-3 text-gray-600">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Top Landing Pages Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C0991B]" /> Top Landing Pages (Website Front Doors)
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  <strong>Objective:</strong> Show which page and blog posts act as the website's front door so to allow targeted conversion optimization.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black rounded-lg self-start md:self-auto">
                {Math.round(48290 * effectiveMultiplier).toLocaleString()} Front Door Entrances
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Home Page Landing', path: '/', entrances: Math.round(18200 * effectiveMultiplier), share: '37.7%', status: 'Primary Front Door', opt: 'A/B Test Hero Loan Calculator CTA' },
                { name: 'Logbook Loan Guide', path: '/blog/logbook-loans', entrances: Math.round(14500 * effectiveMultiplier), share: '30.0%', status: 'Top Content Front Door', opt: 'Inject Sticky WhatsApp Chat Trigger' },
                { name: 'Biashara Credit Portal', path: '/products/biashara', entrances: Math.round(9800 * effectiveMultiplier), share: '20.3%', status: 'Product Front Door', opt: 'Add Quick Pre-Qualification Widget' },
                { name: 'About Neema HEEP', path: '/about-us', entrances: Math.round(5790 * effectiveMultiplier), share: '12.0%', status: 'Trust Front Door', opt: 'Highlight Customer Testimonials' }
              ].map((lp, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400">#0{i+1} Landing Page</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">{lp.share} Share</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-gray-900">{lp.name}</h4>
                  <div className="font-mono text-[11px] text-[#074504] font-bold">{lp.path}</div>
                  <div className="text-lg font-black text-gray-900">{lp.entrances.toLocaleString()} <span className="text-xs font-normal text-gray-500">views</span></div>
                  <div className="pt-2 border-t border-gray-200 text-[10px] text-gray-600">
                    <strong className="text-gray-800">Optimization Recommendation:</strong> {lp.opt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Visitors: Fresh vs Returning Audience Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#C0991B]" /> Visitor Acquisition &amp; Loyalty Breakdown
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  <strong>Objective:</strong> Show if the website is attracting fresh visitors or building a loyal, repeat audience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" /> Fresh First-Time Visitors
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-800 text-white text-xs font-black rounded-lg">58% Share</span>
                </div>
                <div className="text-3xl font-black text-emerald-950">
                  {Math.round(28008 * effectiveMultiplier).toLocaleString()} <span className="text-xs font-semibold text-emerald-800">New Visitors</span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
                  Attracted via organic search engine queries (SEO/AEO keywords), Meta social ads, and local community referral backlinks.
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-700" /> Loyal Repeat Audience
                  </span>
                  <span className="px-2.5 py-1 bg-amber-900 text-white text-xs font-black rounded-lg">42% Share</span>
                </div>
                <div className="text-3xl font-black text-amber-950">
                  {Math.round(20282 * effectiveMultiplier).toLocaleString()} <span className="text-xs font-semibold text-amber-800">Returning Readers</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                  High brand retention. Readers returning directly via bookmarks, newsletter links, and saved WhatsApp chat threads.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUBMODULE 6: ENGAGEMENT ANALYTICS */}
      {activeSubmodule === 'engagement' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#074504] via-[#053203] to-[#022002] p-6 rounded-3xl text-white shadow-xl border border-[#C0991B]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#C0991B] font-extrabold text-xs uppercase tracking-widest">
              <Activity className="w-4 h-4" /> Audience Dwell, Page Depth &amp; Exit Mitigation
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              Engagement Metrics: Exit Pages, Pages Per Session &amp; Bounce Rate
            </h3>
            <p className="text-xs text-white/80 font-medium">
              Measure user interaction quality, pinpoint final exit pages to add next-step links, and monitor bounce rate across channels.
            </p>
          </div>

          {/* Top KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Bounce Rate</span>
              <div className="text-3xl font-black text-[#074504]">34.2%</div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Optimal &lt; 40% Target</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Pages Per Session</span>
              <div className="text-3xl font-black text-[#074504]">3.42</div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">High Content Quality</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Total Social Shares</span>
              <div className="text-3xl font-black text-[#074504]">{Math.round(1840 * effectiveMultiplier).toLocaleString()}</div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">WhatsApp #1 Share Channel</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400">Avg Dwell Time</span>
              <div className="text-3xl font-black text-[#C0991B]">3m 48s</div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">High Community Trust</span>
            </div>
          </div>

          {/* 1. Top Exit Pages Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-600" /> Top Exit Pages (Final Pages Viewed)
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  <strong>Objective:</strong> Show the final pages people look at before leaving your website entirely so as to define a clear next step or internal link to keep visitors on site.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase font-black text-[10px] bg-gray-50">
                    <th className="p-3">Exit Page Route</th>
                    <th className="p-3">Total Exit Volume</th>
                    <th className="p-3">Exit Rate %</th>
                    <th className="p-3">Recommended Next Step / Proposed Internal Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { page: '/products/biashara-boost-credit', exits: Math.round(3120 * effectiveMultiplier), rate: '28.4%', action: 'Add "Need Advice? WhatsApp Us" floating chat button at page bottom.' },
                    { page: '/blog/logbook-loan-interest-rates', exits: Math.round(2450 * effectiveMultiplier), rate: '22.1%', action: 'Embed internal link to "Calculate Your Logbook Repayment" calculator tool.' },
                    { page: '/contact-us', exits: Math.round(1890 * effectiveMultiplier), rate: '18.5%', action: 'Add quick FAQ widget + instant callback request form.' },
                    { page: '/about-us', exits: Math.round(1240 * effectiveMultiplier), rate: '14.2%', action: 'Add internal link to "Explore Beneficiary Community Projects".' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80">
                      <td className="p-3 font-mono font-bold text-gray-900">{row.page}</td>
                      <td className="p-3 font-black text-gray-900">{row.exits.toLocaleString()}</td>
                      <td className="p-3 font-bold text-red-700">{row.rate}</td>
                      <td className="p-3 font-bold text-emerald-800 bg-emerald-50/60 rounded-md">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Pages Per Session Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C0991B]" /> Pages Per Session &amp; Content Navigation Depth
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  <strong>Objective:</strong> Show the average number of pages a user clicks through before leaving your website to determine quality of website content.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg">
                Avg: 3.42 Pages / Session
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { depth: '1 Single Page', pct: 28, label: 'Single page bounce sessions' },
                { depth: '2 - 3 Pages', pct: 44, label: 'Standard exploration sessions' },
                { depth: '4 - 6 Pages', pct: 20, label: 'High intent research sessions' },
                { depth: '7+ Pages', pct: 8, label: 'Deep borrower loan applicants' }
              ].map((d, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <span className="text-[10px] font-black uppercase text-gray-400">{d.depth}</span>
                  <div className="text-2xl font-black text-[#074504]">{d.pct}% <span className="text-xs font-medium text-gray-500">of sessions</span></div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#074504] rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">{d.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Bounce Rate Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#C0991B]" /> Bounce Rate Breakdown
                </h3>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  <strong>Objective:</strong> Measure the percentage of people who leave the website after viewing only a single page without interacting.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-600">Organic Search Bounce Rate</span>
                <div className="text-2xl font-black text-[#074504]">29.8%</div>
                <p className="text-[11px] text-gray-500">Very healthy. Readers find relevant loan guide answers quickly.</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-600">Social Media Ads Bounce Rate</span>
                <div className="text-2xl font-black text-amber-700">38.4%</div>
                <p className="text-[11px] text-gray-500">Normal for mobile social traffic clicking from Meta feeds.</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-600">Direct &amp; Email Newsletter Bounce Rate</span>
                <div className="text-2xl font-black text-emerald-800">22.1%</div>
                <p className="text-[11px] text-gray-500">Lowest bounce rate. Subscribers navigate multiple site pages.</p>
              </div>
            </div>
          </div>

        </div>
      )}



      {/* SUBMODULE 9: CUSTOM REPORTS BUILDER */}
      {activeSubmodule === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#074504] uppercase flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#C0991B]" /> Executive Report Generator &amp; Automated Delivery
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">
                  Generate instant PDF executive summaries or schedule automated weekly analytics digests for board &amp; editorial teams.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-[#074504] hover:bg-[#599200] text-white text-xs font-black uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <PdfIcon className="w-4 h-4 text-[#C0991B]" /> Download PDF Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="font-extrabold text-sm text-[#074504]">Report Configuration</h4>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  >
                    <option value="Executive">Management Briefing</option>
                    <option value="Editorial">Editorial &amp; Content Performance Report</option>
                    <option value="SEO">Technical SEO &amp; SERP Audit</option>
                    <option value="Marketing">Marketing Campaigns &amp; ROI Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={reportRecipientEmail}
                    onChange={(e) => setReportRecipientEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  />
                </div>

                <button
                  onClick={() => showToast(`Report scheduled for ${reportRecipientEmail}`)}
                  className="w-full py-2.5 bg-[#074504] text-white font-black rounded-xl cursor-pointer hover:bg-[#599200] transition-colors"
                >
                  Schedule Automated Delivery
                </button>
              </div>

              <div className="p-5 bg-[#074504]/5 rounded-2xl border border-[#074504]/20 space-y-3">
                <h4 className="font-extrabold text-sm text-[#074504]">Included Metrics Preview</h4>
                <ul className="space-y-2 text-xs font-bold text-gray-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Total Website Visitors &amp; Growth Trends</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Geographical Traffic Breakdown</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Article Performance &amp; Read Time</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Loan Application Lead Conversions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <Download className="w-4 h-4 text-[#C0991B]" /> Export Analytics Dataset
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <button
                onClick={() => { exportToCSV(); setShowExportModal(false); }}
                className="w-full p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl text-left border border-gray-200 text-gray-800 flex items-center justify-between cursor-pointer"
              >
                <span>Comma-Separated Values (.csv)</span>
                <Download className="w-4 h-4 text-[#074504]" />
              </button>

              <button
                onClick={() => { exportToExcel(); setShowExportModal(false); }}
                className="w-full p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl text-left border border-gray-200 text-gray-800 flex items-center justify-between cursor-pointer"
              >
                <span>Microsoft Excel (.xlsx)</span>
                <FileSpreadsheet className="w-4 h-4 text-[#074504]" />
              </button>

              <button
                onClick={() => { exportToPDF(); setShowExportModal(false); }}
                className="w-full p-3 bg-gray-50 hover:bg-emerald-50 rounded-xl text-left border border-gray-200 text-gray-800 flex items-center justify-between cursor-pointer"
              >
                <span>Executive PDF Report (.pdf)</span>
                <PdfIcon className="w-4 h-4 text-[#074504]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-[#074504] uppercase flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#C0991B]" /> Generate Executive PDF Report
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Generate and download a branded PDF summary for executives and board members.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  exportToPDF();
                  setShowReportModal(false);
                }}
                className="px-5 py-2 bg-[#074504] text-white rounded-xl text-xs font-black uppercase cursor-pointer hover:bg-[#599200] shadow-md"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Helper icons
function LayoutGridIcon(props: any) {
  return <Layers {...props} />;
}

function UserCheckIcon(props: any) {
  return <Users {...props} />;
}

function XIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className || "w-4 h-4"}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
