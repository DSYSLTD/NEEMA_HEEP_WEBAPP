import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCode2, Search, ExternalLink, Compass, ShieldCheck, 
  Coins, HeartHandshake, Calculator, Users, BookOpen, 
  ChevronRight, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { PRODUCT_LINKS } from '../lib/loanData';

interface SitemapCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: {
    title: string;
    path: string;
    description: string;
    badge?: string;
  }[];
}

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const sitemapData: SitemapCategory[] = useMemo(() => [
    {
      title: 'Company & Mission',
      description: 'Founding story, leadership, impact reporting, and physical branch contacts.',
      icon: <Compass className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'Home', path: '/', description: 'Official landing page with real-time loan calculator and impact counters.' },
        { title: 'About Us', path: '/about-us', description: 'Our history, mission, Board of Directors, and management team.' },
        { title: 'Impact & Community', path: '/impact', description: 'Measured community achievements across health, education, and micro-enterprises.' },
        { title: 'Client Testimonials', path: '/client-testimonials', description: 'Real stories from entrepreneurs and farmers across Mt. Kenya.' },
        { title: 'Process & Compliance', path: '/process-and-compliance', description: 'Our transparent 4-step appraisal and responsible lending framework.' },
        { title: 'Contact Us', path: '/contact', description: 'Direct branch phone numbers, GPS locations, and physical office addresses.' }
      ]
    },
    {
      title: 'Loan Products',
      description: 'Comprehensive financial solutions tailored for business owners, farmers, and households.',
      icon: <Coins className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'All Loan Products', path: '/loans', description: 'Comprehensive directory and comparison of all 12 credit facilities.' },
        ...PRODUCT_LINKS.map((prod) => ({
          title: prod.label,
          path: `/loans/${prod.id}`,
          description: `Specific terms, eligibility criteria, repayment schedule, and requirements for ${prod.label}.`,
          badge: 'Product'
        }))
      ]
    },
    {
      title: 'Community Programs & Partnerships',
      description: 'Non-profit and community empowerment pillars under the HEEP framework.',
      icon: <HeartHandshake className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'Programs Overview', path: '/programs', description: 'Integrated Health, Education, Economic, and Physical community initiatives.' },
        { title: 'Education Support', path: '/programs/education-support', description: 'Student scholarship funds, school fees support, and classroom resources.' },
        { title: 'Community Health', path: '/programs/community-health', description: 'Mosquito net distribution, medical outreach, and health insurance education.' },
        { title: 'Economic Empowerment', path: '/programs/economic-empowerment', description: 'Financial literacy workshops, business mentorship, and table banking groups.' },
        { title: 'Beneficiaries & Stories', path: '/beneficiaries', description: 'Verified profiles and impact tracking of community program recipients.' },
        { title: 'Sponsorship Inquiries', path: '/sponsorship', description: 'Request scholarship support or institutional community grants.' },
        { title: 'Partners & Donors', path: '/partnership', description: 'Institutional donors, development agencies, and banking partners.' },
        { title: 'Request Partnership', path: '/request-partnership', description: 'Form for organizations wishing to co-fund or partner with NEEMA HEEP.' }
      ]
    },
    {
      title: 'Tools & Borrowing Calculators',
      description: 'Interactive utilities to plan loan repayments, assess eligibility, and download forms.',
      icon: <Calculator className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'Pre-Qualification Check', path: '/pre-qualification', description: 'Evaluate your estimated credit score and loan eligibility without credit bureau impact.', badge: 'Interactive' },
        { title: 'Current Interest Rates', path: '/current-rates', description: 'Transparent interest schedules, administrative fees, and repayment tenures.' },
        { title: 'Borrower Checklists', path: '/checklists', description: 'Interactive check-sheets for business, individual, and logbook applicants.' },
        { title: 'Requirements Guide', path: '/requirements', description: 'Exact identity, bank statement, and guarantor documentation needed.' },
        { title: 'Talk to an Advisor', path: '/talk-to-us', description: 'Connect directly with a dedicated credit officer via WhatsApp or phone.' },
        { title: 'Request Call Back', path: '/request-callback', description: 'Submit your contact details for an officer to call you within 1 business hour.' }
      ]
    },
    {
      title: 'Membership & Opportunities',
      description: 'Join our microfinance community, apply for careers, or volunteer in field programs.',
      icon: <Users className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'Join / Open Account', path: '/join', description: 'Online member onboarding and loan application starter form.' },
        { title: 'Volunteer With Us', path: '/volunteer', description: 'Field volunteer programs supporting rural health and financial literacy.' },
        { title: 'Careers & Job Openings', path: '/careers', description: 'Current professional vacancies across credit analysis, field officers, and tech.' },
        { title: 'Job Application Portal', path: '/careers/apply', description: 'Direct application submission form for open positions.' }
      ]
    },
    {
      title: 'Knowledge Center & News',
      description: 'Financial literacy guides, community news, and regulatory articles.',
      icon: <BookOpen className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'Frequently Asked Questions', path: '/faq', description: 'Searchable answers covering collateral, approval speed, and interest rates.' },
        { title: 'Blog & Articles', path: '/blog', description: 'Insights into Kenyan microfinance, SME scaling, and economic resilience.' },
        { title: 'From NGO to MFI Journey', path: '/blog/ngo-to-mfi-journey', description: 'Our decade-long story from community health NGO to regulated MFI.' },
        { title: 'Lending Without Collateral', path: '/blog/lending-without-collateral', description: 'Why trust-based micro-lending empowers the Kenyan working poor.' },
        { title: 'The HEEP Model Explained', path: '/blog/heep-model-physical-health', description: 'Why financial wealth requires foundational physical and community health.' },
        { title: 'Nawiri vs. Imara Loan Guide', path: '/blog/nawiri-vs-imara-loan', description: 'How to select between group-guaranteed and individual business credit.' },
        { title: 'Executive Director Profile', path: '/author/patrick-munene', description: 'Editorial profile and insights from founder Patrick Munene.' }
      ]
    },
    {
      title: 'Legal, Compliance & Machine Sitemaps',
      description: 'Official corporate compliance policies and machine-readable indexing feeds.',
      icon: <ShieldCheck className="w-5 h-5 text-[#599200]" />,
      links: [
        { title: 'Privacy Policy', path: '/privacy-policy', description: 'Data protection standards under the Kenya Data Protection Act, 2019.' },
        { title: 'Terms & Conditions', path: '/terms-conditions', description: 'User agreement, account responsibilities, and website conditions.' },
        { title: 'Regulatory Disclosures', path: '/regulatory-disclosures', description: 'Microfinance regulatory alignment, fair debt collection, and governance.' },
        { title: 'XML Sitemap (Search Engines)', path: '/sitemap.xml', description: 'Raw XML index formatted for Google Search Console, Bing, and crawlers.', badge: 'XML' },
        { title: 'Robots Protocol', path: '/robots.txt', description: 'Web crawler directives and crawler access permissions.', badge: 'TXT' }
      ]
    }
  ], []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return sitemapData;
    const query = searchQuery.toLowerCase();

    return sitemapData
      .map((cat) => ({
        ...cat,
        links: cat.links.filter(
          (l) =>
            l.title.toLowerCase().includes(query) ||
            l.description.toLowerCase().includes(query) ||
            l.path.toLowerCase().includes(query)
        )
      }))
      .filter((cat) => cat.links.length > 0);
  }, [sitemapData, searchQuery]);

  const totalLinks = useMemo(() => {
    return sitemapData.reduce((acc, cat) => acc + cat.links.length, 0);
  }, [sitemapData]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B4332] pb-24">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#074504] to-[#0A5C05] text-white py-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#C0991B] text-xs font-bold uppercase tracking-wider mb-4">
            <FileCode2 className="w-3.5 h-3.5" /> Comprehensive Directory
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
            Website Site Map
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
            Navigate through all pages, financial calculators, credit products, community programs, 
            and official search engine indexing endpoints of NEEMA HEEP Microfinance.
          </p>

          {/* Quick Access Badges & XML Link */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C0991B] text-[#074504] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#d8ae22] transition-colors shadow-sm"
            >
              <FileCode2 className="w-4 h-4" /> View XML Sitemap (sitemap.xml)
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Robots.txt <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <span className="text-white/60 text-xs font-medium py-2 px-3">
              Total Indexable Endpoints: <strong className="text-white">{totalLinks}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content & Search */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-[#E8ECE7] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages by name, keyword or path..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#074504] focus:outline-none focus:ring-2 focus:ring-[#599200] transition-all"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium self-end md:self-center">
            Showing {filteredCategories.reduce((a, c) => a + c.links.length, 0)} of {totalLinks} links
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mt-10 space-y-10">
          {filteredCategories.map((category) => (
            <div 
              key={category.title}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E8ECE7] transition-all"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-2.5 rounded-xl bg-[#074504]/5">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#074504]">
                    {category.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.links.map((link) => {
                  const isExternal = link.path.endsWith('.xml') || link.path.endsWith('.txt');
                  return isExternal ? (
                    <a
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl border border-gray-100 hover:border-[#599200]/40 hover:bg-[#F4F9F1] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-sm text-[#074504] group-hover:text-[#599200] transition-colors flex items-center gap-1.5">
                            {link.title}
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </span>
                          {link.badge && (
                            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#C0991B]/20 text-[#C0991B]">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-gray-400 group-hover:text-[#599200] transition-colors flex items-center gap-1">
                        <code>{link.path}</code>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="group p-4 rounded-xl border border-gray-100 hover:border-[#599200]/40 hover:bg-[#F4F9F1] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-bold text-sm text-[#074504] group-hover:text-[#599200] transition-colors flex items-center gap-1">
                            {link.title}
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#599200]" />
                          </span>
                          {link.badge && (
                            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#599200]/10 text-[#599200]">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                      <div className="mt-3 text-[11px] font-mono text-gray-400 group-hover:text-[#599200] transition-colors flex items-center gap-1">
                        <code>{link.path}</code>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-sm font-medium">
                No matching pages found for "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-sm text-[#599200] font-bold hover:underline"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>

        {/* XML Sitemap Submission Info Box */}
        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-[#E8ECE7] shadow-sm">
          <h3 className="text-base font-bold text-[#074504] mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#599200]" />
            Search Console & Webmaster Indexing
          </h3>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            For search engine crawlers (Google Search Console, Bing Webmaster Tools, Yandex), 
            submit the direct canonical XML endpoint:
          </p>
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs text-[#074504] select-all flex items-center justify-between">
            <span>https://neemaheep.com/sitemap.xml</span>
            <span className="text-gray-400 text-[10px] font-sans uppercase">XML Sitemaps 0.9</span>
          </div>
        </div>
      </div>
    </div>
  );
}
