import { ArrowRight, Heart, Handshake, ShieldCheck, Globe, Users, Briefcase, TrendingUp, MessageSquare, Copy, Building2, BookOpen, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import SmartLeadForm from '../components/SmartLeadForm';

export default function Donors() {
  const [copied, setCopied] = useState(false);

  const copyTill = () => {
    navigator.clipboard.writeText('388285');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const partnerTypes = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Individual Well-wishers",
      desc: "One-off or recurring contributions that go directly towards school fees and basic needs for our students."
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Institutional Partners",
      desc: "Corporate entities looking to channel CSR funds into a credible, grassroots initiative with measurable impact."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Professional Mentors",
      desc: "Lend your expertise during our holiday mentorship programs to guide students on career paths."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Foundations",
      desc: "Strategic partnerships aiming to scale the Arise & Shine junior secondary (grade 10-12) model to all 47 counties in Kenya."
    }
  ];



  const partners = [
    { name: 'Musoni Systems', sub: 'Core Banking Partner', logo: <img src="/musoni_logo.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/18bwtrkXovP9_vjEb5NEmjOtoD2ltqbwg"; }} alt="Musoni Logo" loading="lazy" className="w-24 h-24 object-contain grayscale group-hover/card:grayscale-0 transition-all duration-500" />, color: 'bg-white shadow-sm ring-1 ring-gray-100', tagline: 'Technology Partner' },
    { name: 'KCB Bank', sub: 'KCB Foundation', logo: <img src="/kcb_logo.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/1lOM7DWOkRUS24xL_wdFl7P-O7boarFW5"; }} alt="KCB Logo" loading="lazy" className="w-24 h-24 object-contain grayscale group-hover/card:grayscale-0 transition-all duration-500" />, color: 'bg-white shadow-sm ring-1 ring-gray-100', tagline: 'Financial Partner' },
    { name: 'AMFI', sub: 'Microfinance Association', logo: <img src="/amfi_logo.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/1uGjWzkaQmCE6c1XAS8K8cun4RmmMpIkO"; }} alt="AMFI Logo" loading="lazy" className="w-24 h-24 object-contain grayscale group-hover/card:grayscale-0 transition-all duration-500" />, color: 'bg-white shadow-sm ring-1 ring-gray-100', tagline: 'Industry Body' },
    { name: 'USAID', sub: 'Gov Agencies', logo: <img src="/usaid_logo.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/d/1PhQJZjUieQd2DBXot1QXfP8lETA3NeB4"; }} alt="USAID Logo" loading="lazy" className="w-24 h-24 object-contain grayscale group-hover/card:grayscale-0 transition-all duration-500" />, color: 'bg-white shadow-sm ring-1 ring-gray-100', tagline: 'Development Partner' },
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-350px * 4)); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
      {/* Hero */}
      <section className="bg-[#074504] text-white py-24 lg:py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C0991B] rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#599200] rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#C0991B]/20 backdrop-blur-md border border-[#C0991B]/30 px-6 py-2 rounded-full mb-8 shadow-xl"
          >
            <Heart className="w-5 h-5 text-[#C0991B] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C0991B]">Become a Partner in Progress</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9] text-white">
            Fuel the <br/>
            <span className="text-[#C0991B]">Dreams</span> of Many.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
            We actively seek partnerships with individuals and organizations who share our vision of educational empowerment. Together, we can reach more deserving students.
          </p>
        </div>
      </section>

      {/* Partners Showcase */}
      <section className="py-24 px-6 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 px-6">
            <p className="text-[#599200] font-black uppercase tracking-widest text-xs mb-4">Strategic Collaborators</p>
            <h2 className="text-4xl md:text-6xl font-black text-[#074504] uppercase tracking-tighter leading-none mb-6">Our Institutional <br/><span className="text-[#C0991B]">Partners</span></h2>
          </div>
          
          <div className="relative mt-8">
            <div className="flex gap-8 animate-scroll w-max">
              {[...partners, ...partners].map((p, idx) => (
                <div 
                  key={`${p.name}-${idx}`}
                  className="bg-white border-2 border-gray-50 p-10 rounded-[3rem] text-center hover:border-[#C0991B]/30 transition-all group/card hover:shadow-2xl min-w-[320px] relative overflow-hidden"
                >
                  <div className="absolute top-4 right-8">
                     <div className="bg-gray-50 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-gray-400 border border-gray-100">
                        Verified Partner
                     </div>
                  </div>
                  
                  <div className={`w-36 h-36 ${p.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover/card:scale-110 transition-transform shadow-sm`}>
                    {React.cloneElement(p.logo as React.ReactElement<any>, { className: "w-24 h-24" })}
                  </div>
                  <h3 className="text-2xl font-black text-[#074504] leading-tight mb-2 whitespace-nowrap">{p.name}</h3>
                  <p className="text-[#C0991B] font-black text-xs uppercase tracking-widest mb-4">{p.sub}</p>
                  
                  <div className="pt-4 border-t border-gray-50">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{p.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient Overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Contribution Card */}
      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-30 mb-24">
         <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(7,69,4,0.15)] border border-gray-100 p-8 md:p-16 text-center overflow-hidden relative">
            <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-[#599200]/10 px-4 py-2 rounded-full mb-6">
                   <Heart className="w-4 h-4 text-[#599200]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#599200]">Support Our Work</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[#074504] uppercase tracking-tighter leading-none mb-6">Direct <span className="text-[#C0991B]">Contribution</span></h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed mb-8">
                  Empower communities with an M-Pesa contribution. Please use our Buy Goods Till Number below to support our initiatives.
                </p>
                <div className="bg-[#074504]/5 rounded-[2.5rem] p-8 border border-[#074504]/10 max-w-md mx-auto">
                   <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#599200]">
                         <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Buy Goods Till</p>
                        <p className="text-3xl font-black text-[#074504]">388285</p>
                      </div>
                   </div>
                   <button 
                     onClick={copyTill}
                     className="mx-auto text-xs font-black text-[#C0991B] uppercase tracking-widest hover:text-[#074504] transition-colors flex items-center gap-2 justify-center"
                   >
                     {copied ? 'Copied Successfully' : 'Copy Till Number'} <Copy className="w-3.5 h-3.5" />
                   </button>
                </div>
            </div>
         </div>
      </section>

      {/* Why Partner with Us */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-4xl md:text-5xl font-black text-[#074504] mb-8 uppercase tracking-tighter leading-tight">
                 A Credible <br/> <span className="text-[#C0991B]">Grassroots</span> Partner
               </h2>
               <div className="space-y-8 font-medium text-gray-600 leading-relaxed">
                  <div className="flex gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-[#074504] flex items-center justify-center text-[#C0991B] shrink-0 shadow-lg">
                        <ShieldCheck className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-[#074504] uppercase mb-2">Total Transparency</h4>
                        <p className="text-sm">Strict commitment to integrity in student selection and sponsorship criteria. Every shilling is accounted for.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-[#599200] flex items-center justify-center text-white shrink-0 shadow-lg">
                        <Users className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-[#074504] uppercase mb-2">Locally Rooted</h4>
                        <p className="text-sm">Deeply embedded in Embu County with hands-on knowledge of the specific challenges faced by vulnerable families.</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-[#C0991B] flex items-center justify-center text-[#074504] shrink-0 shadow-lg">
                        <TrendingUp className="w-8 h-8" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-[#074504] uppercase mb-2">Measurable Growth</h4>
                        <p className="text-sm">Proven track record since 2011, from a family initiative to a structured network with clear expansion plans.</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-[#074504] p-12 rounded-[3.5rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B]/10 rounded-full blur-[80px]" />
               <Heart className="text-[#C0991B]/20 w-32 h-32 absolute -bottom-10 -right-10" />
               
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">Ways to <span className="text-[#C0991B]">Get Involved</span></h3>
               
               <div className="space-y-6">
                  {partnerTypes.map((type, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-default group/item">
                       <div className="flex items-start gap-4">
                          <div className="text-[#C0991B] group-hover/item:scale-110 transition-transform">{type.icon}</div>
                          <div>
                             <h5 className="text-white font-black uppercase text-sm mb-2">{type.title}</h5>
                             <p className="text-white/60 text-xs font-medium leading-relaxed">{type.desc}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Holiday Mentorship Focus */}
      <section className="bg-[#C0991B] py-24 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#d4af37_1px,_transparent_1px)] bg-[size:40px_40px] opacity-20" />
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-[#074504]">
            <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl flex flex-col md:flex-row items-center gap-16">
               <div className="md:w-1/2">
                  <div className="inline-flex items-center gap-2 bg-[#074504]/5 px-4 py-2 rounded-full mb-6">
                     <MessageSquare className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Holiday Mentorship</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-8">
                    Lend Your <span className="text-[#C0991B]">Voice</span>, <br/> Not Just Your Funds.
                  </h2>
                  <p className="text-lg font-medium text-gray-500 leading-relaxed mb-10">
                    We run holiday mentorship sessions focusing on leadership, career guidance, and social responsibility. Professionals from any field are invited to share their journey.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/volunteer" className="bg-[#074504] hover:bg-[#053303] text-white px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2 min-w-[200px]">
                      Volunteer as a Mentor <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/request-partnership" className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-[#074504] px-8 py-5 rounded-full font-bold uppercase text-xs tracking-widest transition-all inline-flex items-center justify-center gap-2 min-w-[200px]">
                      Request Partnership
                    </Link>
                  </div>
               </div>
                <div className="md:w-1/2 grid grid-cols-2 gap-4">
                  {[
                    { src: '/developer_teaching_coding.jpg', alt: 'Developer teaching coding basics', driveFallback: 'https://lh3.googleusercontent.com/d/14RPSykiRJbqEVi6gn5kUbuxrK-562tQr' },
                    { src: '/holiday_mentorship_workshop.jpg', alt: 'Holiday mentorship workshop', driveFallback: 'https://lh3.googleusercontent.com/d/1oXzNE7mFoUrvyijmLrv-fVeE0RjTXgfm' },
                    { src: '/mentor_sharing_challenges.jpg', alt: 'Mentor sharing life challenges', driveFallback: 'https://lh3.googleusercontent.com/d/1btVpM_QWyF0eyI5ky-nxlCz7VHipXOmj' },
                    { src: '/teenagers_planting_trees.jpg', alt: 'Teenagers planting trees', driveFallback: 'https://lh3.googleusercontent.com/d/1ABzKLj4gENwf8FZqQbYnvUO7KEc_Bwld' }
                  ].map((img, i) => (
                    <div key={i} className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 transition-all duration-500 border-2 border-transparent hover:border-[#C0991B] hover:scale-[1.05] shadow-sm group">
                      <img 
                        src={img.src} 
                        alt={img.alt}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback && img.driveFallback) {
                            target.dataset.triedFallback = 'true';
                            target.src = img.driveFallback;
                          }
                        }}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-110"
                      />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Global Vision - Enhanced Beyond Embu */}
      <section className="py-24 relative overflow-hidden bg-white border-b border-gray-100">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F4F7F6] rounded-l-[10rem] -z-10 translate-x-24"></div>
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="relative"
               >
                  <div className="rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                    <img 
                      src="/vision_2030.jpg" 
                      alt="Vision 2030"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = 'true';
                          target.src = "https://lh3.googleusercontent.com/d/1Tj_lddMeuu_qSdz0vmBXAnN_nOTHIBAb";
                        }
                      }}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-8 -left-8 bg-[#074504] p-10 rounded-[2.5rem] text-white shadow-2xl z-20">
                     <div className="text-4xl font-black text-[#C0991B] mb-2 uppercase tracking-tighter">Vision 2030</div>
                     <p className="text-xs font-bold uppercase tracking-widest opacity-70">National Scale Readiness</p>
                  </div>
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#C0991B]/10 rounded-full blur-3xl -z-10"></div>
               </motion.div>

               <motion.div
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                  <div className="inline-flex items-center gap-2 text-[#599200] font-black uppercase text-xs tracking-[0.3em] mb-6">
                     <Globe className="w-5 h-5" /> BEYOND EMBU
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-[#074504] mb-8 uppercase tracking-tighter leading-[1.1]">
                    Scaling <span className="text-[#C0991B]">Impact</span> Across Kenya.
                  </h2>
                  <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-lg mb-12">
                     <p>
                        While our roots are deep in Embu County, our vision is limitless. We are building a scalable blueprint for educational sponsorship that can be replicated in every county across Kenya.
                     </p>
                     <p>
                        We are currently looking for strategic partners to help us establish regional hubs, starting with the Mount Kenya region and expanding into marginalized northern counties.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/request-partnership" className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#C0991B] hover:bg-[#a38217] text-[#074504] rounded-full font-black uppercase text-xs tracking-[0.15em] shadow-xl hover:scale-105 transition-all min-w-[200px]">
                      Start a Collaboration <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#074504] hover:bg-[#053303] text-white rounded-full font-bold uppercase text-xs tracking-[0.15em] shadow-lg transition-all min-w-[200px]">
                      Contact Donors Team
                    </Link>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Partner Form Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 text-[#C0991B] font-black uppercase text-xs tracking-[0.3em] mb-4"
            >
               <Handshake className="w-4 h-4" /> Join Our Ecosystem
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-[#074504] uppercase tracking-tighter leading-none mb-6">Partner with <br/><span className="text-[#C0991B]">Neema HEEP</span></h2>
            <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
              We explore collaboration opportunities with NGOs, Retailers, and Government bodies to drive financial inclusion.
            </p>
          </div>
          
          <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-gray-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#599200]/5 rounded-full blur-3xl" />
            
            <SmartLeadForm 
              type="Partnership"
              title="Partnership Application"
              ctaText="Submit Partnership Request"
              fields={[
                { name: 'org', label: 'Organization Name', type: 'text', placeholder: 'Enter your company name', required: true },
                { name: 'name', label: 'Contact Person', type: 'text', placeholder: 'Your full name', required: true },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@company.com', required: true },
                { 
                  name: 'type', 
                  label: 'Partnership Type', 
                  type: 'select', 
                  required: true,
                  options: ['Corporate NGO', 'Safaricom Agent/Partner', 'Ministry/Gov Body', 'Supermarket/Retail Chain', 'Other']
                },
                { name: 'message', label: 'Brief Proposal', type: 'textarea', placeholder: 'How would you like to collaborate?', required: true }
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
