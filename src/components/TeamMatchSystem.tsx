import React, { useState, useMemo } from 'react';
import { Phone, Calendar, ArrowRight, Search, Filter } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { Link } from 'react-router-dom';

type Category = 'Leadership' | 'Governance' | 'Branch Manager' | 'Loan Officers' | 'Customer Care';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: Category;
  bio: string;
  message?: string;
  superpower: string;
  image: string;
  isAvailable: boolean;
  branch?: string;
}

const LEADERSHIP_DATA: TeamMember[] = [
  {
    id: 'l1',
    name: 'Grace Wanjiku',
    role: 'Chief Executive Officer',
    category: 'Leadership',
    bio: 'Visionary leader with 15+ years in microfinance, driving financial inclusion across Kenya.',
    message: 'Welcome to NEEMA HEEP Microfinance. Our mission is to empower you to reach your financial goals. We believe in providing accessible, transparent, and transformative financial solutions tailored to your unique journey. Together, we can build a strong foundation for your prosperity.',
    superpower: 'Strategic Vision and Partnerships',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 'l2',
    name: 'James Mwangi',
    role: 'Chief Finance Officer',
    category: 'Leadership',
    bio: 'Expert in financial structuring and risk management, ensuring sustainable growth.',
    message: 'Numbers matter, but people matter more. My focus is ensuring our financial health so that we can consistently provide the capital you need to grow your business sustainably.',
    superpower: 'Numbers and Capital Allocation',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
    isAvailable: false,
  },
  {
    id: 'l3',
    name: 'Dr. Evans Kiprotich',
    role: 'Board of Directors',
    category: 'Governance',
    bio: 'Ensures strict compliance and ethical lending practices across all our branches.',
    message: 'Governance and ethical practices are at the core of everything we do. We hold ourselves to the highest standards to protect your interests and foster long-term community trust.',
    superpower: 'Regulatory Navigation',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 's4',
    name: 'Mercy Mutuku',
    role: 'Customer Care Lead',
    category: 'Customer Care',
    bio: 'Ensures every member enquiry is handled swiftly and politely.',
    message: 'We are here to help you navigate your financial journey smoothly.',
    superpower: 'Client Satisfaction',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    isAvailable: true,
  },
  {
    id: 's5',
    name: 'Sarah Ndung\'u',
    role: 'Customer Care Agent',
    category: 'Customer Care',
    bio: 'Your first point of contact for all support requirements.',
    message: 'Welcome! I will ensure you get the best support experience.',
    superpower: 'Problem Resolution',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
    isAvailable: true,
  }
];

const STAFF_DATA: TeamMember[] = [
  {
    id: 's1',
    name: 'Peter Kamau',
    role: 'Branch Manager',
    category: 'Branch Manager',
    bio: 'Overseeing daily operations and leading our team to deliver exceptional service.',
    superpower: 'Operational Excellence',
    image: 'https://images.unsplash.com/photo-1506277886159-e38a2e1d00c3?q=80&w=400&auto=format&fit=crop',
    isAvailable: true,
    branch: 'Embu'
  },
  {
    id: 's6',
    name: 'Faith Njoki',
    role: 'Assistant Manager',
    category: 'Branch Manager',
    bio: 'Supporting branch operations and ensuring seamless membership onboarding.',
    superpower: 'Team Coordination',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    isAvailable: true,
    branch: 'Siakago'
  },
  {
    id: 's2',
    name: 'Amina Hassan',
    role: 'Senior Loan Officer',
    category: 'Loan Officers',
    bio: 'Dedicated to helping small businesses scale. Speaks to 20+ entrepreneurs daily.',
    superpower: 'Lightning-Fast Approvals',
    image: 'https://images.unsplash.com/photo-1531123414780-fee2a217c7ed?q=80&w=400&auto=format&fit=crop',
    isAvailable: false,
    branch: 'Chuka'
  },
  {
    id: 's3',
    name: 'David Ochieng',
    role: 'Assistant Loan Officer',
    category: 'Loan Officers',
    bio: 'Assists with documentation and rapid application processing for urgent needs.',
    superpower: 'Process Efficiency',
    image: 'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=400&auto=format&fit=crop',
    isAvailable: true,
    branch: 'Meru'
  }
];

export default function TeamMatchSystem() {
  const [selectedLeader, setSelectedLeader] = useState<TeamMember>(LEADERSHIP_DATA[0]);
  const [messageOwner, setMessageOwner] = useState<TeamMember | null>(null);
  
  // Filtering States
  const [activeTab, setActiveTab] = useState<'All' | Category>('All');
  const [activeBranch, setActiveBranch] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const categories = ['All', 'Branch Manager', 'Loan Officers'];
  const branches = ['All', 'Embu', 'Siakago', 'Kiritiri', 'Chuka', 'Meru', 'Muranga'];

  const filteredStaff = useMemo(() => {
    return STAFF_DATA.filter((staff) => {
      const matchCategory = activeTab === 'All' || staff.category === activeTab;
      const matchBranch = activeBranch === 'All' || staff.branch === activeBranch;
      
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || 
        staff.name.toLowerCase().includes(searchLower) || 
        staff.role.toLowerCase().includes(searchLower) ||
        staff.category.toLowerCase().includes(searchLower) ||
        (staff.branch && staff.branch.toLowerCase().includes(searchLower));
      
      const matchAvailability = !showAvailableOnly || staff.isAvailable;
      
      return matchCategory && matchBranch && matchSearch && matchAvailability;
    });
  }, [activeTab, activeBranch, searchQuery, showAvailableOnly]);

  return (
    <section className="w-full py-0 bg-transparent relative flex items-center justify-center font-sans" id="team">
      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] border border-gray-100 overflow-hidden relative z-10 p-8 lg:p-16">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 items-stretch">
          
          {/* LEFT PANEL: LEADERSHIP (The "OUR TEAM" side) */}
          <div className="w-full lg:w-[45%] flex flex-col items-center justify-center text-center lg:border-r-2 lg:border-[#C0991B]/30 lg:pr-12 py-4 relative">

            <div className="flex flex-col items-center group cursor-pointer" onClick={() => {
                // Cycle through leaders on click
                const currentIndex = LEADERSHIP_DATA.findIndex(l => l.id === selectedLeader.id);
                setSelectedLeader(LEADERSHIP_DATA[(currentIndex + 1) % LEADERSHIP_DATA.length]);
            }}>
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-8 border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-105">
                <img 
                  src={selectedLeader.image} 
                  alt={selectedLeader.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-[13px] font-black text-[#C0991B] uppercase tracking-[0.15em] mb-2">{selectedLeader.role}</h3>
              <h4 className="text-xl font-medium text-[#074504] mb-4">{selectedLeader.name}</h4>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setMessageOwner(selectedLeader); }}
                className="text-[#C0991B] font-bold text-sm bg-[#C0991B]/10 hover:bg-[#C0991B]/20 py-2.5 px-6 rounded-full transition-colors mb-6 flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4"/> Message from {selectedLeader.name.split(' ')[0]}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 transition-opacity">
                <Link to="/contact" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-8 py-3 rounded-full font-extrabold transition-all shadow-md flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Schedule Appointment
                </Link>
              </div>

              <p className="text-gray-400 text-xs mt-6 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Click here to view next leader
              </p>
            </div>
            
          </div>


          {/* RIGHT PANEL: STAFF DIRECTORY */}
          <div className="w-full lg:w-[55%] flex flex-col lg:pl-12 py-4">
            
            {/* Filters Section */}
            <div className="w-full mb-8 flex flex-col gap-4">
               {/* Search & Availability Toggle */}
               <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search name, role, department or branch..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:border-[#C0991B] focus:ring-1 focus:ring-[#C0991B] transition-all"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      className="accent-[#C0991B] w-4 h-4 cursor-pointer"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Available Now</span>
                  </label>
               </div>

               {/* Category Tabs & Branch Dropdown */}
               <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between overflow-hidden">
                 {/* Categories */}
                 <div className="flex gap-2 w-full sm:w-auto">
                   {categories.map(cat => (
                     <button
                       key={cat}
                       onClick={() => setActiveTab(cat as any)}
                       className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                         activeTab === cat 
                           ? 'bg-[#C0991B] text-white shadow-md' 
                           : 'bg-white text-gray-500 border border-gray-200 hover:border-[#C0991B] hover:text-[#C0991B]'
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>
                 
                 {/* Branch Dropdown */}
                 <div className="relative w-full sm:w-48 shrink-0">
                   <select 
                     value={activeBranch}
                     onChange={(e) => setActiveBranch(e.target.value)}
                     className="w-full appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm font-bold text-gray-700 outline-none focus:border-[#074504] focus:ring-1 focus:ring-[#074504] cursor-pointer"
                   >
                     {branches.map(branch => (
                       <option key={branch} value={branch}>
                         {branch === 'All' ? 'All Branches' : branch}
                       </option>
                     ))}
                   </select>
                   <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                 </div>
               </div>
            </div>

            {/* Staff Grid */}
            <div className="flex-1 min-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredStaff.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 pb-8">
                  {filteredStaff.map((staff) => (
                    <div key={staff.id} className="flex flex-col items-center text-center group">
                      <div className="relative mb-5">
                        <div className="w-28 h-28 rounded-full overflow-hidden shadow-md border-2 border-white group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src={staff.image} 
                            alt={staff.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {staff.isAvailable && (
                          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Available Now"></div>
                        )}
                      </div>
                      
                      <h4 className="text-[11px] font-black text-[#C0991B] uppercase tracking-[0.1em] mb-1.5">{staff.role}</h4>
                      <h5 className="text-base font-medium text-[#074504] mb-1">{staff.name}</h5>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3 bg-gray-100 px-2 py-0.5 rounded-full">{staff.branch}</span>
                      
                      {/* Social/Action Links - Hidden until hover on desktop, always visible on mobile */}
                      <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity translate-y-0 lg:translate-y-2 group-hover:translate-y-0 duration-300">
                        <a href="tel:+254705759365" aria-label="Call" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#074504] text-gray-600 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`https://wa.me/254705759365?text=Hi%20${staff.name},%20I%20need%20assistance.`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#25D366] text-gray-600 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                          <WhatsAppIcon className="w-3.5 h-3.5" />
                        </a>
                        <Link to="/contact" aria-label="Book Appointment" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#C0991B] text-gray-600 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                          <Calendar className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <Filter className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">No team members match your filters.</p>
                  <button onClick={() => { setSearchQuery(''); setShowAvailableOnly(false); }} className="mt-4 text-[#C0991B] text-sm font-bold hover:underline">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {/* MESSAGE POPUP MODAL */}
      {messageOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setMessageOwner(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setMessageOwner(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1L1 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <img src={messageOwner.image} alt={messageOwner.name} className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white" />
              <div>
                <h4 className="text-lg font-bold text-[#074504]">{messageOwner.name}</h4>
                <p className="text-[10px] font-black text-[#C0991B] tracking-wider uppercase">{messageOwner.role}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative mt-2">
              <span className="absolute -top-4 left-6 text-5xl text-[#C0991B]/20 font-serif leading-none">"</span>
              <p className="text-gray-700 text-sm leading-relaxed italic relative z-10 font-medium">
                {messageOwner.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #ccc;
        }
      `}</style>
    </section>
  );
}
