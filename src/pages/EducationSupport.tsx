import { ArrowRight, BookOpen, GraduationCap, School, CheckCircle2, Award, History, Users, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function EducationSupport() {
  const milestones = [
    { year: '2011', detail: 'The pilot phase: Sponsored 5 students from Embu County, focusing on secondary education foundation.' },
    { year: '2012', detail: 'Expanded to 12 students and introduced the first holiday mentorship session with career guidance.' },
    { year: '2013-14', detail: 'Program reach extended to Kirinyaga County, supporting orphans and vulnerable children (OVCs).' },
    { year: '2015', detail: 'First cohort of sponsored students completed secondary school; 80% qualified for university entry.' },
    { year: '2016', detail: 'Introduced the "Arise & Shine" university scholarship fund for top secondary graduates.' },
    { year: '2017', detail: 'Deepened commitment with a focus on empowering young women through specialized vocational training.' },
    { year: '2018', detail: 'Launched the "Neema Mentors" alumni network, connecting past graduates with current students.' },
    { year: '2019', detail: 'Expanded support to include technical and vocational colleges (TVETs) to bridge local skills gaps.' },
    { year: '2020', detail: 'Pivoted during the global pandemic to provide remote learning support and essential supplies.' },
    { year: '2021', detail: 'Celebrated 10 years of Arise & Shine, reaching a milestone of 150 total students sponsored.' },
    { year: '2022', detail: 'Strengthened partnership with local technical institutions to create direct employment pipelines.' },
    { year: '2023', detail: 'Introduced the Digital Literacy initiative, providing laptops and internet access to tertiary students.' },
    { year: '2024', detail: 'Scaled reach to Tharaka Nithi region, identifying 20 new high-potential students for full scholarships.' },
    { year: '2025', detail: 'Implementation of the "Green Education" pillar, sponsoring environmental and sustainable agriculture studies.' },
    { year: '2030', detail: 'Vision 2030: Sponsoring 1,000+ junior secondary students from grade 10 to 12 with a 95% professional transition rate.' }
  ];

  const criteria = [
    { title: "Academic Merit", desc: "Candidates must have achieved 350 marks and above in KCPE examinations." },
    { title: "Marginalized Backgrounds", desc: "Priority for rural public primary school students with limited access to resources." },
    { title: "Vulnerable Families", desc: "Focus on single-parent households or families facing severe economic hardship/landlessness." },
    { title: "Lack of Support", desc: "Children neglected by extended family or affected by parental financial mismanagement." }
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      {/* Arise & Shine Hero */}
      <section className="bg-[#074504] text-white py-24 lg:py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#074504] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#C0991B]/20 backdrop-blur-md border border-[#C0991B]/30 px-6 py-2 rounded-full mb-8"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C0991B]">Arise & Shine Education Program</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9] text-white"
          >
            Light Up <br/>
            Their <span className="text-[#C0991B]">Future</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed mb-12"
          >
            At Neema HEEP, our Arise & Shine Education Program offers hope and access to bright, underprivileged scholars by dedicatedly sponsoring junior secondary education from grade 10 to 12, paving their way to a brighter future.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/beneficiaries" className="bg-white text-[#074504] px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">
              View Beneficiaries
            </Link>
            <Link to="/request-partnership" className="bg-[#C0991B] text-[#074504] px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Program Origin Section - Enhanced for Neema DNA */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#074504]/5 rounded-full blur-3xl -translate-x-1/2"></div>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="inline-flex items-center gap-2 text-[#074504] font-black uppercase text-xs tracking-[0.3em] mb-6">
                <span className="w-10 h-0.5 bg-[#C0991B]"></span> OUR DNA & ROOTS
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-[#074504] mb-8 uppercase tracking-tighter leading-[1.1]">
               Built on <br/> <span className="text-[#C0991B]">Lived</span> Experience
             </h2>
             <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-lg">
                <p>
                  Our commitment to education is not theoretical: it is built on years of lived experience supporting bright but financially disadvantaged junior secondary students from grade 10 to 12 across Kenya.
                </p>
                <div className="bg-white p-6 rounded-3xl border-l-4 border-[#C0991B] shadow-sm italic text-[#074504]">
                  "What began as a small, informal family initiative has grown into a structured Arise & Shine education sponsorship programme, dedicated to empowering junior secondary grade 10 to 12 students."
                </div>
                <p>
                  This hands-on journey has given us deep understanding of the challenges faced by vulnerable families. We don't just pay fees; we provide a robust path for success through the grades 10 to 12 secondary curriculum.
                </p>
             </div>
             
             <div className="mt-10 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F4F7F6] rounded-xl text-[#074504] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Merit Based
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F4F7F6] rounded-xl text-[#074504] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Social Need
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F4F7F6] rounded-xl text-[#074504] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Holistic Care
                </div>
             </div>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
             {milestones.slice(0, 8).map((m, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
               >
                  <p className="text-[#C0991B] font-black text-2xl mb-1">{m.year}</p>
                  <p className="text-gray-500 text-xs font-bold leading-snug uppercase tracking-tight">{m.detail}</p>
               </motion.div>
             ))}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="col-span-2 bg-[#074504] p-8 rounded-[2.5rem] mt-4 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B]/20 rounded-full blur-3xl"></div>
                <h4 className="text-white font-black text-xl mb-2 italic">Vision 2030</h4>
                <p className="text-white/70 text-sm font-medium">Targeting 1,000+ successful junior secondary grade 10-12 transitions and a powerful professional mentorship framework.</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Selection Criteria */}
      <section className="bg-[#074504]/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#074504] mb-4 uppercase tracking-tighter">Who We Support</h2>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Selection based on academic merit and social need</p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {criteria.map((c, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-[#074504]/5 shadow-sm hover:-translate-y-2 transition-all duration-300">
                   <div className="w-12 h-12 rounded-2xl bg-[#074504]/5 flex items-center justify-center text-[#C0991B] mb-6">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <h3 className="text-xl font-black text-[#074504] mb-4 uppercase leading-tight tracking-tight">{c.title}</h3>
                   <p className="text-gray-500 font-medium text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Holistic Approach */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="bg-[#074504] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C0991B]/10 rounded-full blur-[100px]" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-tight">Beyond <span className="text-[#C0991B]">School Fees</span></h2>
                  <p className="text-lg text-white/70 font-medium leading-relaxed mb-10">
                    Neema HEEP runs holistic mentorship programmes during school holidays, where students are exposed to professionals from different fields.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                     {['Leadership Development', 'Career Guidance', 'Life Skills & Discipline', 'Social Responsibility', 'Peer Mentorship', 'Community Awareness'].map((item, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#C0991B]" />
                          <span className="font-bold text-sm tracking-wide">{item}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[3rem]">
                  <Quote className="w-12 h-12 text-[#C0991B] mb-6" />
                  <p className="text-2xl font-bold italic leading-relaxed mb-8">
                    "Accountable systems that benefit the wider community: this is our blueprint for educational empowerment."
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-[#C0991B] flex items-center justify-center font-black text-[#074504]">NH</div>
                     <div>
                        <p className="font-black uppercase text-sm tracking-wide">Neema HEEP Board</p>
                        <p className="text-xs text-white/50 font-bold uppercase">CSR Initiative 2026</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-6 text-center">
         <Heart className="w-16 h-16 text-[#C0991B] mx-auto mb-8 animate-bounce" />
         <h2 className="text-4xl md:text-6xl font-black text-[#074504] mb-8 uppercase tracking-tighter">Expand the Mission</h2>
         <p className="text-xl text-gray-500 font-medium mb-12">
            We are currently active in Embu County, with strategic plans to build a national network. We actively invite individuals and organizations to join us.
         </p>
         <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 mb-12">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Direct Contributions</p>
            <div className="flex flex-col items-center gap-2">
               <span className="text-[#074504] font-black text-3xl">M-PESA Buy Goods</span>
               <span className="bg-[#C0991B] text-[#074504] px-8 py-3 rounded-2xl text-4xl font-black tracking-tighter">Till: 388285</span>
            </div>
         </div>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sponsorship" className="inline-flex items-center justify-center gap-3 bg-[#074504] hover:bg-[#053303] text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all w-full sm:w-auto min-w-[200px]">
               Apply for Scholarship <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/request-partnership" className="inline-flex items-center justify-center gap-3 bg-[#C0991B] hover:bg-[#a38217] text-[#074504] px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-all w-full sm:w-auto min-w-[200px]">
               Partner Opportunities
            </Link>
         </div>
      </section>
    </main>
  );
}

function Quote(props: any) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-4 6-4 6z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-4 6-4 6z" />
    </svg>
  );
}
