import { ArrowLeft, Search, GraduationCap, School, MapPin, Download, Award, Users, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { beneficiariesStore, maskBeneficiaryName } from '../lib/beneficiariesStore';
import { beneficiaryService } from '../services/beneficiaryService';

export default function Beneficiaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [publishedData, setPublishedData] = useState(() => beneficiariesStore.getPublishedLists().filter(d => d.year !== '2027'));

  // Determine available years and the most current year (highest numerical year)
  const availableYears = Array.from(new Set(publishedData.map(d => d.year)))
    .filter(y => y !== '2027')
    .sort((a, b) => Number(b) - Number(a));
  const mostCurrentYear = availableYears[0] || '2026';

  // Active year defaults to the most current year dynamically
  const [activeYear, setActiveYear] = useState<string>(() => {
    const initialLists = beneficiariesStore.getPublishedLists().filter(d => d.year !== '2027');
    const years = Array.from(new Set(initialLists.map(d => d.year))).filter(y => y !== '2027').sort((a, b) => Number(b) - Number(a));
    return years[0] || '2026';
  });

  useEffect(() => {
    let isMounted = true;
    const loadBeneficiaries = async () => {
      const data = await beneficiaryService.getPublishedBeneficiaries();
      if (isMounted && data && data.length > 0) {
        const cleanData = data.filter(d => d.year !== '2027');
        setPublishedData(cleanData);
        const topYear = cleanData.map(d => d.year).sort((a, b) => Number(b) - Number(a))[0];
        if (topYear) {
          setActiveYear(prev => prev || topYear);
        }
      }
    };

    loadBeneficiaries();

    const refreshData = () => {
      loadBeneficiaries();
    };

    window.addEventListener('neema_cms_beneficiaries_lists_updated', refreshData);
    return () => {
      isMounted = false;
      window.removeEventListener('neema_cms_beneficiaries_lists_updated', refreshData);
    };
  }, []);

  // Year options for dropdown (no duplicate "Most Current" option)
  const yearOptions = [
    { id: 'All', label: 'All Years' },
    ...availableYears.map(y => ({ id: y, label: `Year ${y}` }))
  ];

  // Extract all unique high schools across all cohorts
  const allSchools = ['All', ...Array.from(new Set(
    publishedData.flatMap(d => d.students.map(s => s.school))
  )).filter(Boolean).sort()];

  const isSchoolPicked = selectedSchool !== 'All';
  const isSearchPicked = searchTerm.trim().length > 0;
  const isMostCurrentDefault = activeYear === mostCurrentYear && !isSchoolPicked && !isSearchPicked;

  // Filter Data Logic: Display matching beneficiaries according to activeYear, selectedSchool, and searchTerm
  const filteredData = publishedData.filter(yearGroup => {
    if (activeYear === 'All') {
      return true;
    }
    return yearGroup.year === activeYear;
  }).map(yearGroup => ({
    ...yearGroup,
    students: yearGroup.students.filter(s => {
      const matchSearch = !isSearchPicked ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.school.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSchool = !isSchoolPicked || s.school === selectedSchool;
      return matchSearch && matchSchool;
    })
  })).filter(yearGroup => yearGroup.students.length > 0);

  const totalStudentsCount = publishedData.reduce((acc, curr) => acc + curr.students.length, 0);

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-[#074504] text-white pt-10 pb-8 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#C0991B] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 justify-center mb-3">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">ARISE & SHINE EDUCATION PROGRAMME</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-[1.1] uppercase">
            OUR <span className="text-[#C0991B]">BENEFICIARIES</span>
          </h1>
          
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6 font-medium leading-relaxed">
            Empowering bright and needy students across Embu County and beyond since 2011 through fully verified secondary school scholarships, holiday mentorship, and leadership coaching.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Link 
              to="/sponsorship" 
              className="bg-[#C0991B] hover:bg-[#a68212] text-[#074504] px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider shadow-lg transition-all flex items-center gap-2"
            >
              Apply For Sponsorship
            </Link>
            <Link 
              to="/request-partnership" 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all"
            >
              Sponsor a Scholar
            </Link>
            <Link 
              to="/programs/education-support" 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C0991B]" />
              Program Overview
            </Link>
          </div>

          {/* Program Highlights Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10 w-full text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#C0991B] mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Total Scholars</span>
              </div>
              <p className="text-2xl font-black text-white">{totalStudentsCount}+</p>
              <p className="text-[10px] text-white/60 font-medium">Beneficiaries Supported</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#C0991B] mb-1">
                <School className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Partner High Schools</span>
              </div>
              <p className="text-2xl font-black text-white">{allSchools.length - 1}+</p>
              <p className="text-[10px] text-white/60 font-medium">Embu & National Schools</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#C0991B] mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Impact History</span>
              </div>
              <p className="text-2xl font-black text-white">2011 – 2026</p>
              <p className="text-[10px] text-white/60 font-medium">15 Years Active</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#C0991B] mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">KCPE Cutoff</span>
              </div>
              <p className="text-2xl font-black text-white">350+ Marks</p>
              <p className="text-[10px] text-white/60 font-medium">Bright & Needy Standard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
         <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search by student name or school..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-[#074504]/5 focus:border-[#C0991B] transition-all font-bold text-[#074504]"
                 />
              </div>

              {/* Year Filter Dropdown */}
              <div className="w-full lg:w-56 shrink-0">
                <select
                  value={activeYear}
                  onChange={(e) => setActiveYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-4 focus:ring-[#074504]/5 focus:border-[#C0991B] transition-all font-bold text-[#074504] text-xs uppercase cursor-pointer"
                >
                  {yearOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* High School Filter Dropdown */}
              <div className="w-full lg:w-64 shrink-0">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:ring-4 focus:ring-[#074504]/5 focus:border-[#C0991B] transition-all font-bold text-[#074504] text-xs uppercase cursor-pointer"
                >
                  <option value="All">All High Schools ({allSchools.length - 1})</option>
                  {allSchools.filter(s => s !== 'All').map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>
            </div>
         </div>
      </section>

      {/* Beneficiaries List */}
      <section className="max-w-7xl mx-auto px-6 py-12">
         {/* Status & Filter Indicator Banner (Shown when non-default filters or search terms are applied) */}
         {!isMostCurrentDefault && (
           <div className="mb-8 p-4 bg-[#C0991B]/10 border border-[#C0991B]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
             <div className="flex flex-wrap items-center gap-2 text-[#074504] font-bold">
               <Filter className="w-4 h-4 text-[#C0991B] shrink-0" />
               <span className="uppercase font-black text-[10px] tracking-wider">Active Filter:</span>
               <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-[#074504] uppercase font-black text-[10px]">
                 {activeYear === 'All' ? 'All Years' : `Year ${activeYear}`}
               </span>
               {isSchoolPicked && (
                 <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-[#074504] uppercase font-black text-[10px]">
                   School: {selectedSchool}
                 </span>
               )}
               {isSearchPicked && (
                 <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-[#074504] uppercase font-black text-[10px]">
                   Search: "{searchTerm}"
                 </span>
               )}
               <span className="text-[#074504]/70 font-bold ml-1">
                 ({filteredData.reduce((acc, y) => acc + y.students.length, 0)} Scholars listed)
               </span>
             </div>
             <button
               onClick={() => {
                 setActiveYear(mostCurrentYear);
                 setSelectedSchool('All');
                 setSearchTerm('');
               }}
               className="text-[10px] font-black uppercase text-[#074504] hover:bg-[#074504] hover:text-white transition-all cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs shrink-0"
             >
               Reset to Most Current Only
             </button>
           </div>
         )}

         {filteredData.length > 0 ? (
           <div className="space-y-16">
             {filteredData.map((yearGroup, idx) => (
               <motion.div 
                 key={yearGroup.year}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
               >
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-gray-200 flex-grow" />
                    <div className="flex items-center gap-2 bg-[#074504] text-white px-5 py-2 rounded-full shadow-md">
                      <GraduationCap className="w-4 h-4 text-[#C0991B]" />
                      <h2 className="text-base md:text-lg font-black uppercase tracking-tight">
                        Year <span className="text-[#C0991B]">{yearGroup.year}</span>
                      </h2>
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                        {yearGroup.students.length} Scholars
                      </span>
                    </div>
                    <div className="h-px bg-gray-200 flex-grow" />
                 </div>
                 
                 <div className="overflow-x-auto rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-[#C0991B] text-[#074504]">
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-r border-[#074504]/10 w-24 text-center">S.NO</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-r border-[#074504]/10">Student's Name</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-r border-[#074504]/10">High School Attending</th>
                             <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center w-32">Year</th>
                          </tr>
                       </thead>
                       <tbody>
                          {yearGroup.students.map((student, sIdx) => (
                            <tr key={`${yearGroup.year}-${student.id}-${sIdx}`} className={`${sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-[#C0991B]/5 transition-colors group`}>
                               <td className="px-8 py-4 text-xs font-black text-gray-400 border-r border-gray-100/50 text-center">{student.id}</td>
                               <td className="px-8 py-4 border-r border-gray-100/50">
                                  <div className="flex items-center gap-3">
                                     <GraduationCap className="w-4 h-4 text-[#C0991B] opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <span className="font-bold text-[#074504] uppercase tracking-tight">
                                       {maskBeneficiaryName(student.name)}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-8 py-4 border-r border-gray-100/50">
                                  <div className="flex items-center gap-3">
                                     <School className="w-4 h-4 text-[#599200]" />
                                     <span className="font-medium text-gray-700 text-sm">{student.school}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-4 text-center">
                                 <span className="bg-[#074504]/5 text-[#074504] font-black text-[10px] px-3 py-1 rounded-full border border-[#074504]/10">
                                   {yearGroup.year}
                                 </span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </motion.div>
             ))}
           </div>
         ) : (
           <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No beneficiaries found matching your query</p>
           </div>
         )}
      </section>

      {/* CTA Section - Help Expand the Impact & Sponsorship Intake */}
      <section className="max-w-7xl mx-auto px-6 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#C0991B] rounded-[3rem] p-10 md:p-14 text-[#074504] relative overflow-hidden flex flex-col justify-between"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />
               <div className="relative z-10">
                  <span className="bg-[#074504]/10 text-[#074504] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#074504]/5">Support Neema HEEP</span>
                  <h3 className="text-3xl font-black mt-6 mb-4 uppercase tracking-tighter leading-tight">
                     Become an <span className="text-white">Impact Partner</span>
                  </h3>
                  <p className="text-[#074504]/80 font-bold text-sm leading-relaxed mb-8 max-w-md">
                     Every single beneficiary on this list represents a life transformed. Stand with us to empower and sponsor the next crop of future leaders.
                  </p>
               </div>
               <div className="relative z-10 flex flex-wrap gap-3">
                  <Link to="/request-partnership" className="bg-[#074504] hover:bg-[#052903] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all text-center">
                     Fund a Student Now
                  </Link>
                  <Link to="/request-callback" className="bg-white/20 border border-[#074504]/20 hover:bg-white/30 text-[#074504] px-6 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-center transition-all">
                     Callback Inquiry
                  </Link>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-14 text-[#074504] shadow-md relative overflow-hidden flex flex-col justify-between"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#074504]/5 rounded-full blur-[80px]" />
               <div className="relative z-10">
                  <span className="bg-[#C0991B]/20 text-[#074504] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Apply for Support</span>
                  <h3 className="text-3xl font-black mt-6 mb-4 uppercase tracking-tighter leading-tight">
                     Request <span className="text-[#C0991B]">HEEP Sponsorship</span>
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 max-w-md">
                     Are you or your child in need of financial aid, school fees scholarship, maternal healthcare kits, or enterprise startup support? Apply now through our digital program enrollment.
                  </p>
               </div>
               <div className="relative z-10 flex flex-wrap gap-3">
                  <Link to="/sponsorship" className="bg-[#074504] hover:bg-[#599200] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all text-center flex items-center gap-2">
                     Apply For Sponsorship <span className="text-[#C0991B]">★</span>
                  </Link>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Transparency Note */}
      <section className="max-w-4xl mx-auto px-6 py-12">
         <div className="bg-[#074504] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B]/20 rounded-full blur-3xl" />
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
               <MapPin className="w-8 h-8 text-[#C0991B]" />
            </div>
            <div>
               <h3 className="text-xl font-black uppercase tracking-tight mb-2">Rooted in Accountability</h3>
               <p className="text-white/70 font-medium text-sm leading-relaxed">
                  Selection processes are community-based and locally rooted in Embu County. Partners such as Equity Bank have assisted in identifying students through Wings to Fly collaboration.
               </p>
            </div>
         </div>
      </section>
    </main>
  );
}
