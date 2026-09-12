import { useState, useEffect } from 'react';
import { ArrowUpRight, MapPin, Briefcase, Linkedin, Github, Instagram, Heart, Sun, TrendingUp, Clock, FileText, CheckCircle2, ChevronDown, ChevronUp, Facebook, Youtube, Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SmartLeadForm from '../components/SmartLeadForm';
import { XIcon, TikTokIcon } from '../components/SocialIcons';
import { useJobs } from '../hooks/useJobs';

const FAQS = [
  {
    q: "What is the company culture like at NEEMA HEEP?",
    a: "We are a mission-driven, highly collaborative microfinance institution. We value integrity, community empowerment, and continuous learning. Expect a supportive environment where your ideas directly impact the communities we serve."
  },
  {
    q: "How long does the application process take?",
    a: "Our recruitment process typically takes 2-3 weeks from application to offer. We believe in transparency and value your time."
  },
  {
    q: "Do you offer remote work configurations?",
    a: "Yes, for specific roles like Credit Analysts or Tech Support, we offer hybrid and remote options. Field roles require on-ground presence in our key regions."
  },
  {
    q: "What does the interview process involve?",
    a: "It usually involves a screening call, a technical or role-based assessment, and a final culture-fit interview with leadership."
  }
];

export default function Careers() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [viewMode, setViewMode] = useState<'all' | 'saved'>('all');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('neema_candidate_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { vacancies } = useJobs();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem('neema_candidate_saved_jobs', JSON.stringify(savedJobIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedJobIds]);

  const toggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobIds(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeVacancies = vacancies.filter(v => {
    if (v.status !== 'Published' && (v.status as string) !== 'Open') return false;
    if (v.deadline && v.deadline < todayStr) return false;
    return true;
  });

  const departments = ['All', ...Array.from(new Set(activeVacancies.map(v => v.department).filter(Boolean)))];

  const filteredVacancies = activeVacancies.filter(job => {
    if (viewMode === 'saved' && !savedJobIds.includes(job.id)) return false;
    if (selectedDepartment !== 'All' && job.department !== selectedDepartment) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDept = job.department?.toLowerCase().includes(q);
      const matchLoc = job.location?.toLowerCase().includes(q);
      const matchRef = job.refNumber?.toLowerCase().includes(q);
      const matchSummary = job.summary?.toLowerCase().includes(q);
      if (!matchTitle && !matchDept && !matchLoc && !matchRef && !matchSummary) return false;
    }
    return true;
  });

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5 text-white" />, href: "https://www.facebook.com/NeemaHeepOrganization", label: "Facebook" },
    { icon: <Instagram className="w-5 h-5 text-white" />, href: "https://www.instagram.com/neemaheep", label: "Instagram" },
    { icon: <XIcon className="w-4 h-4 text-white" />, href: "https://x.com/NeemaHeepLtd", label: "X" },
    { icon: <Linkedin className="w-5 h-5 text-white" />, href: "https://www.linkedin.com/in/neema-heep-ltd", label: "LinkedIn" },
    { icon: <TikTokIcon className="w-4 h-4 text-white" />, href: "https://www.tiktok.com/@neema.heep.ltd", label: "TikTok" },
    { icon: <Youtube className="w-5 h-5 text-white" />, href: "#", label: "YouTube" }
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-0">
      {/* Hero */}
      <section className="bg-[#074504] text-white py-24 px-6 lg:px-12 text-center relative overflow-hidden">
        <p className="text-[#C0991B] font-bold tracking-widest uppercase text-sm mb-4">Empower Your Future</p>
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">CAREERS AT NEEMA <span className="text-[#C0991B]">HEEP</span></h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          Join a team dedicated to real microfinance impact across Kenya. Discover roles where your career growth aligns with community empowerment.
        </p>
        
        {/* Social Media Integration */}
        <motion.div 
          className="flex justify-center items-center gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {socialLinks.map((link, idx) => (
            <motion.a 
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.1, backgroundColor: '#C0991B' }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* Recruiting KPIs */}
      <section className="max-w-6xl mx-auto px-6 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-gray-100">
          <div>
            <p className="text-3xl font-extrabold text-[#074504] mb-1">11 Days</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Avg Time to Offer</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#074504] mb-1">{activeVacancies.length}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Open Positions</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#074504] mb-1">92%</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Offer Acceptance</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#074504] mb-1">High</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Growth Potential</p>
          </div>
        </div>
      </section>

      {/* Impactful Mission Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="bg-[#074504] rounded-[3rem] p-10 lg:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#599200] opacity-20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C0991B] opacity-20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="max-w-3xl relative z-10">
            <p className="text-[#C0991B] font-bold tracking-widest uppercase text-sm mb-4">Our Core Mission</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold uppercase mb-6 leading-tight tracking-tight">
              MORE THAN A CAREER. A <span className="text-[#C0991B]">CALLING</span> TO EMPOWER.
            </h2>
            <p className="text-xl text-white/80 font-medium leading-relaxed mb-10">
              At NEEMA HEEP, our work directly translates to stronger communities. By providing accessible financial solutions and health initiatives, we break the cycle of poverty. We're looking for passionate individuals ready to turn their skills into measurable social impact.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-10">
              <div>
                <p className="text-4xl font-extrabold text-[#C0991B] mb-2">10k+</p>
                <p className="text-sm font-bold text-white/70 uppercase tracking-wider">Lives Impacted</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#C0991B] mb-2">12+</p>
                <p className="text-sm font-bold text-white/70 uppercase tracking-wider">Years of Service</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-[#C0991B] mb-2">7</p>
                <p className="text-sm font-bold text-white/70 uppercase tracking-wider">Key Regions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Steps: Hiring Process */}
      <section className="bg-gray-50 py-20 px-6 lg:px-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">JOIN US</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6">
              OUR <span className="text-[#C0991B]">HIRING PROCESS</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center relative">
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-1 bg-gray-200" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#074504] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-[#074504]/30">1</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Apply</h3>
              <p className="text-sm text-gray-500 font-medium">Submit your resume or use our One-Click LinkedIn import.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#599200] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-[#599200]/30">2</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Screening</h3>
              <p className="text-sm text-gray-500 font-medium">A quick 20-minute chat with our Talent team.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#C0991B] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-[#C0991B]/30">3</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Interview</h3>
              <p className="text-sm text-gray-500 font-medium">Meet your future manager and complete a role assessment.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#074504] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-[#074504]/30">4</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Offer</h3>
              <p className="text-sm text-gray-500 font-medium">Welcome aboard! We move fast to finalize details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions (Direct Job Portal) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-3 justify-start mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">EXPLORE OPPORTUNITIES</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight">
              CURRENTLY <span className="text-[#C0991B]">OPEN POSITIONS</span>
            </h2>
          </div>

          {/* View Toggle Tabs: Listed Posts vs Saved Posts */}
          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            <button
              onClick={() => setViewMode('all')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-[#074504] text-[#C0991B] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>All Listed Jobs ({activeVacancies.length})</span>
            </button>
            <button
              onClick={() => setViewMode('saved')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'saved'
                  ? 'bg-[#074504] text-[#C0991B] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Jobs ({savedJobIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        {activeVacancies.length > 0 && (
          <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-200 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, department, location, or ref number..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#074504] focus:bg-white transition-all"
              />
            </div>
            
            {departments.length > 1 && (
              <div className="w-full md:w-64">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:border-[#074504] focus:bg-white transition-all cursor-pointer"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>Department: {dept}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {filteredVacancies.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-16 text-center max-w-3xl mx-auto shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#074504]/10 text-[#074504] flex items-center justify-center mb-6">
              {viewMode === 'saved' ? <Bookmark className="w-8 h-8 text-[#074504]" /> : <Briefcase className="w-8 h-8 text-[#074504]" />}
            </div>
            <h3 className="text-2xl font-black text-[#074504] mb-3 uppercase tracking-tight">
              {viewMode === 'saved' 
                ? 'No Saved Job Posts Yet' 
                : (searchQuery || selectedDepartment !== 'All') 
                  ? 'No Matching Jobs Found' 
                  : 'No Vacancies Currently Posted'}
            </h3>
            <p className="text-gray-600 font-medium leading-relaxed max-w-xl mx-auto mb-8 text-sm md:text-base">
              {viewMode === 'saved'
                ? 'You haven\'t saved or bookmarked any job listings yet. Click the bookmark icon on any active position to save it for later review.'
                : (searchQuery || selectedDepartment !== 'All')
                  ? 'Try broadening your search keywords or choosing a different department filter.'
                  : 'There are currently no active job openings or vacancies available at NEEMA HEEP. We invite you to register with our Talent Network below to be automatically notified as soon as new positions open up!'}
            </p>
            {viewMode === 'saved' ? (
              <button onClick={() => setViewMode('all')} className="inline-flex items-center gap-2 bg-[#074504] hover:bg-[#599200] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-xs uppercase tracking-widest cursor-pointer">
                View All Listed Jobs
              </button>
            ) : (
              <a href="#talent-network" className="inline-flex items-center gap-2 bg-[#074504] hover:bg-[#599200] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-xs uppercase tracking-widest">
                Join Talent Network Below
              </a>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {filteredVacancies.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div key={job.id} className="bg-white border border-gray-100 p-8 lg:p-10 rounded-[2.5rem] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col justify-between border-t-4 border-t-[#074504] relative">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="px-3 py-1 bg-amber-50 text-[#826507] text-[10px] font-mono font-black rounded-full border border-[#C0991B]/30 uppercase block w-fit mb-2">
                          {job.refNumber}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#074504] transition-colors">{job.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {job.isUrgent && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-black rounded-full uppercase">
                            Urgent Slot
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleSaveJob(job.id, e)}
                          title={isSaved ? "Remove from saved jobs" : "Save job post"}
                          className={`p-2.5 rounded-full transition-all border cursor-pointer ${
                            isSaved 
                              ? 'bg-amber-100 border-[#C0991B] text-[#074504]' 
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-[#074504] hover:bg-gray-100'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="w-5 h-5 fill-[#C0991B]" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#C0991B] uppercase tracking-wider mb-4">
                      {job.employmentType} ({job.workArrangement}) • {job.department}
                    </p>
                    <p className="text-gray-600 mb-8 leading-relaxed text-sm font-medium">
                      {job.summary}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100 mt-auto">
                    <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#C0991B]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C0991B]" />
                        <span>Deadline: {job.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        onClick={() => navigate(`/job-application?vacancyId=${job.id}`)} 
                        className="flex-1 bg-[#074504] hover:bg-[#053203] text-[#C0991B] px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md text-center cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Apply Online</span>
                        <ArrowUpRight className="w-4 h-4 text-[#C0991B]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Benefits and Perks */}
      <section className="bg-[#F4F7F6] py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">WHY NEEMA HEEP</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6">
              YOUR <span className="text-[#C0991B]">GROWTH,</span> OUR COMMITMENT
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#eef2f0] flex items-center justify-center text-[#074504] mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Health Coverage</h3>
              <p className="text-sm text-gray-500">Comprehensive medical, dental, and vision insurance for you and your dependents.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#fcf5e2] flex items-center justify-center text-[#C0991B] mb-4">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Generous Vacation</h3>
              <p className="text-sm text-gray-500">21 days of paid time off plus public holidays to ensure you recharge and refresh.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#eef2f0] flex items-center justify-center text-[#599200] mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Career Growth</h3>
              <p className="text-sm text-gray-500">Mentorship programs, continuous training, and distinct paths for internal progression.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Work-Life Balance</h3>
              <p className="text-sm text-gray-500">Flexible working hours and remote options for applicable roles to support your lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">GOT QUESTIONS?</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6">
            FREQUENTLY ASKED <span className="text-[#C0991B]">QUESTIONS</span>
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-colors ${openFaq === index ? 'border-[#074504] bg-[#074504]/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <button 
                className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-gray-900"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {faq.q}
                {openFaq === index ? <ChevronUp className="w-5 h-5 text-[#074504]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Talent Community CTA */}
      <section id="talent-network" className="bg-[#074504] text-white py-24 px-6 text-center rounded-t-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#599200] opacity-30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#C0991B] opacity-20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <p className="text-[#C0991B] font-bold tracking-widest uppercase text-sm mb-4">Stay Connected</p>
          <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white uppercase">NOT READY TO <span className="text-[#C0991B]">APPLY</span> YET?</h2>
          <p className="text-[#C0991B] text-lg mb-10 max-w-xl mx-auto font-medium">
            Join our Talent Network to stay updated on future opportunities, company news, and upcoming microfinance developments.
          </p>
          <div className="bg-white p-8 md:p-12 rounded-[3rem] max-w-lg mx-auto shadow-2xl relative">
            <SmartLeadForm 
              type="Volunteer"
              title=""
              description=""
              ctaText="Join Talent Network"
              fields={[
                { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
                { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254...', required: true },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true }
              ]}
              successMessage="Welcome to the Talent Network! We will keep you updated on future opportunities."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
