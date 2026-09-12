import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Lightbulb, Users, BarChart3, BookOpen, CheckCircle2, ArrowRight, Store, Target, Eye, Sprout, Award, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import IconGrid from '../components/IconGrid';
import SimpleProcess from '../components/SimpleProcess';
import SmartLeadForm from '../components/SmartLeadForm';
import WhoWeAre from '../components/WhoWeAre';

export default function AboutUs() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Neema HEEP Microfinance",
    "description": "A Kenyan microfinance institution providing business loans, asset financing, and sustainable financial solutions to individuals, SMEs, and farmers.",
    "url": "https://www.neemaheep.com",
    "areaServed": {
      "@type": "Place",
      "name": "Kenya"
    },
    "serviceType": [
      "Microfinance",
      "Business Loans",
      "Asset Financing",
      "Financial Literacy"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE"
    },
    "knowsAbout": [
      "Microfinance in Kenya",
      "Business loans Embu",
      "Asset financing Mt. Kenya",
      "Financial inclusion"
    ]
  };

  return (
    <main className="flex-grow flex flex-col items-center w-full bg-[#f8faf8] font-sans">
      {/* Schema Markup */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="w-full bg-[#074504] text-white pt-40 pb-32 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={encodeURI("/Out reach hero.jpeg")} 
            alt="Neema HEEP Exhibition" 
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedFallback) {
                target.dataset.triedFallback = 'true';
                target.src = "/Out_reach_hero.jpeg";
              }
            }}
            className="w-full h-full object-cover aspect-video opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#074504] via-[#074504]/90 to-[#074504]" />
        </div>
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#599200] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 justify-center mb-8 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-[#599200] animate-pulse"></span>
            <span className="text-[#C0991B] font-black tracking-[0.3em] text-[10px] uppercase block">ESTABLISHED 2010 · KENYA BASED</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[6rem] font-black mb-10 leading-[0.95] tracking-tight max-w-5xl"
          >
            Empowering <span className="text-[#C0991B]">Growth</span><br/>
            Through Inclusion.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-4xl mb-16 font-medium leading-relaxed"
          >
            <p className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Neema HEEP Microfinance is a Kenya-based, impact-driven microfinance institution dedicated to advancing financial inclusion by providing accessible, flexible, and responsible financial solutions to underserved individuals, entrepreneurs, and SMEs.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <Link to="/registration" className="bg-[#599200] hover:bg-[#4d7d00] text-white font-black py-5 px-12 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-2xl text-center uppercase tracking-widest text-sm border-b-4 border-[#3a5e00]">
              Start Your Journey
            </Link>
            <Link to="/request-callback" className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 backdrop-blur-md font-black py-5 px-12 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-2xl text-center uppercase tracking-widest text-sm">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section with SEO Text */}
      <section className="w-full border-b border-gray-100 bg-white relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12 text-center max-w-3xl mx-auto px-6">
            <p className="text-gray-600 font-medium">
              We combine real community experience with professional financial systems to deliver sustainable financial solutions that create long-term stability and growth.
            </p>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-10 grid grid-cols-1 md:grid-cols-3 gap-8 divide-x-0 md:divide-x divide-gray-100 text-center">
            <div className="px-4">
              <p className="text-4xl font-extrabold text-[#074504] mb-2">
                <CountUp end={10000} duration={2.5} separator="," suffix="+" enableScrollSpy scrollSpyOnce />
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Clients Served</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-extrabold text-[#074504] mb-2">
                <CountUp end={7} duration={2} suffix="+" enableScrollSpy scrollSpyOnce />
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Counties Served</p>
            </div>
            <div className="px-4">
              <p className="text-4xl font-extrabold text-[#074504] mb-2">
                <CountUp end={2010} duration={2} useGrouping={false} enableScrollSpy scrollSpyOnce />
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Established</p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. WHO WE ARE */}
      <WhoWeAre />

      {/* 2. NEEMA CORE PILLARS */}
      <IconGrid />

      {/* 3. MISSION, VISION and WHAT DRIVES US (CORE VALUES) - Placed immediately above OUR SERVICES */}
      <section className="w-full py-24 px-6 lg:px-12 bg-[#074504] text-white">
        <div className="max-w-7xl mx-auto">
          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-10 md:p-12 rounded-[3rem] backdrop-blur-sm relative overflow-hidden group hover:border-[#C0991B]/40 transition-colors"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#599200] rounded-full blur-[80px] opacity-20 pointer-events-none" />
              <div className="w-16 h-16 bg-[#599200]/20 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-[#C0991B]" />
              </div>
              <h3 className="text-3xl font-black mb-4 relative z-10 text-white uppercase tracking-tight">Our Mission</h3>
              <p className="text-lg text-white/80 leading-relaxed font-medium relative z-10">
                To empower small-scale farmers, entrepreneurs, and vulnerable communities by delivering innovative and sustainable financial solutions alongside social support services that enhance livelihoods and long-term resilience.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 p-10 md:p-12 rounded-[3rem] backdrop-blur-sm relative overflow-hidden group hover:border-[#C0991B]/40 transition-colors"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C0991B] rounded-full blur-[80px] opacity-20 pointer-events-none" />
              <div className="w-16 h-16 bg-[#C0991B]/20 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8 text-[#C0991B]" />
              </div>
              <h3 className="text-3xl font-black mb-4 relative z-10 text-white uppercase tracking-tight">Our Vision</h3>
              <p className="text-lg text-white/80 leading-relaxed font-medium relative z-10">
                To be the leading provider of accessible financial and non-financial services in Kenya and beyond, transforming communities through inclusive economic empowerment.
              </p>
            </motion.div>
          </div>

          {/* Core Values - WHAT DRIVES US */}
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">WHAT DRIVES US</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight uppercase">
              OUR CORE <span className="text-[#C0991B]">VALUES</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
             <div className="p-8 border border-white/10 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-[#C0991B]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Discipline</h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  We adhere strictly to professional standards, regulatory compliance, and excellent fiscal responsibility to safeguard our members' future.
                </p>
             </div>

             <div className="p-8 border border-white/10 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-[#C0991B]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Professionalism</h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Serving our members with highest competence, courtesy, and efficiency, providing superior financial advice and customized assistance.
                </p>
             </div>

             <div className="p-8 border border-white/10 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-[#C0991B]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Innovation</h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  We continuously improve and customize our services with forward-thinking products and cutting-edge financial platforms.
                </p>
             </div>

             <div className="p-8 border border-white/10 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-[#C0991B]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Integrity</h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                  Operating with total transparency, ethical stewardship, and absolute honesty in every single interaction and transaction.
                </p>
             </div>

             <div className="p-8 border border-white/10 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                   <Users className="w-6 h-6 text-[#C0991B]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Team work</h3>
                <p className="text-sm text-white/70 font-medium leading-relaxed">
                   Collaborating seamlessly across teams and working in unison with local communities to generate collective wealth and growth.
                </p>
             </div>
        </div>
      </div>
</section>

      {/* 4. OUR SERVICES (WHAT WE DO) */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 bg-[#F4F7F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">OUR SERVICES</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6">
              WHAT <span className="text-[#C0991B]">WE DO</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 font-medium text-xl leading-relaxed">Financing solutions and support programs that empower businesses, families, and communities.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Business Loans", text: "We provide accessible and affordable financing tailored for SMEs, traders, and entrepreneurs to support business growth and expansion.", icon: Store },
              { title: "Asset Financing", text: "We enable clients to acquire productive assets such as tools, equipment, and machinery through flexible financing options.", icon: Target },
              { title: "Climate Smart Agriculture Solutions", text: "Financing sustainable agriculture by empowering farmers with high-impact, climate-smart solutions.", icon: Sprout },
              { title: "Education Support Programs", text: "We invest in education through sponsorship and mentorship initiatives that keep vulnerable students in school.", icon: BookOpen },
              { title: "Community Health Initiatives", text: "We promote community well-being through programs that support healthy families, recognizing the link between health and financial stability.", icon: HeartHandshake },
              { title: "Sustainable Financial Solutions", text: "Our holistic approach ensures members are not just accessing credit, but building independence and long-term resilience.", icon: Users },
            ].map((item, i) => {
              const Icon = item.icon || CheckCircle2;
              return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-10 rounded-[2.5rem] hover:border-[#599200]/30 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#599200]/0 to-[#C0991B]/0 group-hover:from-[#599200]/5 group-hover:to-[#C0991B]/5 transition-colors duration-700 ease-in-out z-0"></div>
                
                {/* Animated decorative orb */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#599200] rounded-full blur-[50px] opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700 ease-out z-0"></div>

                {/* Decorative background number */}
                <div className="absolute -top-6 -right-6 text-[180px] font-black text-gray-50/50 group-hover:text-[#C0991B]/5 group-hover:rotate-12 transition-all duration-500 leading-none select-none pointer-events-none z-0">
                  {i + 1}
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#F4F7F6] group-hover:bg-[#074504] text-[#074504] group-hover:text-[#C0991B] transition-all duration-500 p-4 rounded-[1.25rem] inline-flex items-center justify-center mb-8 rotate-3 group-hover:-rotate-3">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-[#074504] text-2xl mb-4 group-hover:text-[#C0991B] transition-colors relative z-10">{item.title}</h4>
                  <p className="text-gray-600 font-medium leading-relaxed text-[15px] relative z-10">{item.text}</p>
                </div>
              </motion.div>
            )})}
          </div>
      </div>
</section>

      {/* 5. WHY CHOOSE US and OUR COMMITMENT (THE NEEMA ADVANTAGE) */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#599200]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C0991B]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">THE NEEMA ADVANTAGE</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] mb-6 tracking-tight uppercase">Why Choose <span className="text-[#C0991B]">NEEMA HEEP MICRO FINANCE</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg lg:text-xl">
              We provide more than just financial support: we offer a partnership built on trust, community values, and a commitment to long-term success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Local Expertise", 
                desc: "Deeply rooted in the regional community with unmatched understanding of local economic realities.",
                icon: Target,
                color: "bg-[#074504]"
              },
              { 
                title: "Tailored Solutions", 
                desc: "Financial products precisely calibrated for Kenyan SMEs, small-scale farmers, and growing households.",
                icon: Lightbulb,
                color: "bg-[#599200]"
              },
              { 
                title: "Transparency", 
                desc: "Every transaction, rate, and policy is clear and honest. No hidden fees, just straightforward financial services.",
                icon: ShieldCheck,
                color: "bg-[#C0991B]"
              },
              { 
                title: "Impact Focused", 
                desc: "We measure our success by the resilience and independence we build within our communities.",
                icon: Users,
                color: "bg-[#074504]"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F4F7F6] p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-[1.25rem] ${item.color} flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-extrabold text-[#074504] text-xl mb-4 group-hover:text-[#C0991B] transition-colors">{item.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-24 bg-[#074504] rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-white/5"
          >
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#599200] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
             
             <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
               <div className="inline-flex items-center gap-2 mb-8 bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
                 <ShieldCheck className="w-5 h-5 text-[#C0991B]" />
                 <span className="text-[#C0991B] font-black tracking-widest text-xs uppercase">OUR COMMITMENT</span>
               </div>
               
               <h3 className="text-4xl lg:text-6xl font-extrabold mb-8 tracking-tighter leading-[1.1]">
                 WE BUILD <span className="text-[#C0991B]">PATHWAYS</span> TO<br className="hidden md:block"/> FINANCIAL STABILITY.
               </h3>
               <p className="text-xl text-white/80 mb-12 font-medium leading-relaxed max-w-2xl">
                 We don’t just provide loans: we build infrastructure for progress. Our commitment is to remain your trusted partner in building a future that is secure, sustainable, and prosperous.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                 <Link to="/contact" className="bg-[#599200] hover:bg-[#4d7d00] text-white px-10 py-5 rounded-full font-extrabold shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-3 text-lg group">
                   Build Your Future With Us <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                 </Link>
                  <Link to="/request-callback" className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-10 py-5 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-lg">
                    Talk to an Expert
                  </Link>
               </div>
               
               <div className="mt-16 flex flex-wrap justify-center gap-8 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-700">
                 <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                   <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> AMFI Member
                 </div>
                 <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                   <CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Data Protected
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 6. OUR MILESTONES (Neema HEEP's Journey) - Placed immediately below OUR COMMITMENT */}
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12 bg-[#F4F7F6] relative overflow-hidden border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">OUR MILESTONES</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6 uppercase">
              Neema HEEP’s <span className="text-[#C0991B]">Journey</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              From a grassroots microfinance vision to a multi-county financial engine empowering thousands of small businesses, households, and youth.
            </p>
          </div>

          {/* Network & Presence Callout Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#074504] bg-[#599200]/10 border border-[#599200]/20 px-3.5 py-1.5 rounded-full uppercase inline-block mb-4">
                  Branch Network
                </span>
                <h3 className="text-xl font-extrabold text-[#074504] mb-3">Our Branch Network</h3>
                <p className="text-gray-600 font-medium text-base leading-relaxed">
                  Our branch network covers: <strong className="text-[#074504]">Meru, Chuka, Siakago, Kiritiri, Embu, Murang'a and Thika</strong>.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#074504] bg-[#C0991B]/15 border border-[#C0991B]/30 px-3.5 py-1.5 rounded-full uppercase inline-block mb-4">
                  County Presence
                </span>
                <h3 className="text-xl font-extrabold text-[#074504] mb-3">County Presence</h3>
                <p className="text-gray-600 font-medium text-base leading-relaxed">
                  We are present in the following counties: <strong className="text-[#074504]">Embu, Meru, Tharaka Nithi, Kirinyaga, Murang'a, Kiambu and Nyeri</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Milestones (Progress flow without year markers) */}
          <div className="relative border-l-2 border-[#074504]/20 ml-4 sm:ml-8 lg:ml-12 pl-6 sm:pl-10 space-y-12">
            {[
              {
                stage: "Progress Phase 1",
                title: "Inception & Vision",
                desc: "Founded to solve credit access barriers for micro-entrepreneurs, women's solidarity groups, and smallholder farmers."
              },
              {
                stage: "Progress Phase 2",
                title: "Regional Branch Footprint",
                desc: "Expanded community outreach offices, establishing trusted relationships with local trader groups and businesses."
              },
              {
                stage: "Progress Phase 3",
                title: "Launch of Tailored Micro-Loan Engine",
                desc: "Introduced specialized products including Nawiri, Imara, Dharura, and Busara."
              },
              {
                stage: "Progress Phase 4",
                title: "Digital Integration & Group Empowerment",
                desc: "Adopted mobile repayment channels, digital eligibility tools, and member portals to reduce turnaround times to under 24 hours."
              },
              {
                stage: "Progress Phase 5",
                title: "Strategic Partnerships & Youth Mentorship",
                desc: "Partnered with educational initiatives, agricultural collectives, and youth mentorship programs across Kenya."
              },
              {
                stage: "Progress Phase 6",
                title: "Present Day & Sustainable Impact",
                desc: "Empowered thousands of active clients with a sustained 98% portfolio repayment rate, driving economic growth and community transformation."
              }
            ].map((milestone, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#074504] border-4 border-white shadow-md group-hover:scale-125 group-hover:bg-[#C0991B] transition-all" />
                
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 hover:border-[#074504]/30 hover:shadow-lg transition-all">
                  <div className="inline-block bg-[#074504] text-[#C0991B] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                    {milestone.stage}
                  </div>
                  <h4 className="text-xl font-extrabold text-[#074504] mb-2">{milestone.title}</h4>
                  <p className="text-gray-600 font-medium text-sm sm:text-base leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BEYOND FINANCE - Holistic Approach */}
      <section className="w-full py-24 px-6 lg:px-12 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-2xl mx-auto">
             <div className="inline-flex items-center justify-center gap-3 mb-6">
               <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
               <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">OUR HOLISTIC APPROACH</span>
               <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6 uppercase">
               Beyond <span className="text-[#C0991B]">Microfinance</span>
             </h2>
             <p className="text-gray-600 font-medium text-xl leading-relaxed">Our approach is holistic. We go beyond lending by combining financial services, education and mentorship, and community-driven programs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/programs/education-support" className="group rounded-[2.5rem] bg-white border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#599200] rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"></div>
               <div className="w-16 h-16 bg-[#074504] rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10">
                 <BookOpen className="w-8 h-8 text-[#C0991B]" />
               </div>
               <h3 className="text-2xl font-extrabold text-[#074504] mb-3 relative z-10 group-hover:text-[#C0991B] transition-colors duration-300">Education Support</h3>
               <p className="text-gray-600 font-medium leading-relaxed mb-8 relative z-10">Sponsorship and mentorship programs that keep vulnerable students in school, ensuring the next generation thrives.</p>
               <span className="text-[#C0991B] font-bold flex items-center gap-2 group-hover:gap-3 transition-all tracking-wide relative z-10">Learn More <ArrowRight className="w-5 h-5" /></span>
            </Link>
            
            <Link to="/programs/community-health" className="group rounded-[2.5rem] bg-white border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B] rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"></div>
               <div className="w-16 h-16 bg-[#074504] rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10">
                 <HeartHandshake className="w-8 h-8 text-[#C0991B]" />
               </div>
               <h3 className="text-2xl font-extrabold text-[#074504] mb-3 relative z-10 group-hover:text-[#C0991B] transition-colors duration-300">Community Health</h3>
               <p className="text-gray-600 font-medium leading-relaxed mb-8 relative z-10">Programs that promote well-being, ensuring financial growth is supported by healthy families and strong communities.</p>
               <span className="text-[#C0991B] font-bold flex items-center gap-2 group-hover:gap-3 transition-all tracking-wide relative z-10">Learn More <ArrowRight className="w-5 h-5" /></span>
            </Link>
            
            <Link to="/programs/economic-empowerment" className="group rounded-[2.5rem] bg-white border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#074504] rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"></div>
               <div className="w-16 h-16 bg-[#074504] rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10">
                 <Store className="w-8 h-8 text-[#C0991B]" />
               </div>
               <h3 className="text-2xl font-extrabold text-[#074504] mb-3 relative z-10 group-hover:text-[#C0991B] transition-colors duration-300">Economic Empowerment</h3>
               <p className="text-gray-600 font-medium leading-relaxed mb-8 relative z-10">Tailored support for entrepreneurship, asset acquisition, and agricultural productivity to unlock potential.</p>
               <span className="text-[#C0991B] font-bold flex items-center gap-2 group-hover:gap-3 transition-all tracking-wide relative z-10">Learn More <ArrowRight className="w-5 h-5" /></span>
            </Link>
          </div>

          {/* High-Impact CTA Row - GET PRE-APPROVED TODAY */}
          <div className="mt-16 bg-[#074504] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border border-[#C0991B]/30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C0991B] rounded-full blur-[120px] opacity-20 pointer-events-none" />
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-[#C0991B] text-[#074504] text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
                GET PRE-APPROVED TODAY
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold mb-3 uppercase tracking-tight">
                Ready to take the next step with <span className="text-[#C0991B]">NEEMA HEEP?</span>
              </h3>
              <p className="text-white/80 font-medium text-base md:text-lg max-w-2xl">
                Get instant credit clearance and talk directly with our regional financial experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <Link
                to="/pre-qualification"
                className="bg-[#C0991B] hover:bg-[#a38217] text-[#074504] font-black px-8 py-4 rounded-full transition-all text-center uppercase tracking-wider text-sm shadow-xl hover:scale-105"
              >
                Check Eligibility Now
              </Link>
              <Link
                to="/request-callback"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold px-8 py-4 rounded-full transition-all text-center uppercase tracking-wider text-sm"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
      </div>
</section>

      {/* 7. BEYOND FINANCE - Holistic Approach */}

      {/* ENHANCED STRATEGIC IMPACT & TOOLS SECTION */}
      <section className="w-full py-24 px-6 lg:px-12 bg-gradient-to-b from-white via-[#F4F7F6] to-gray-50 relative overflow-hidden border-t border-b border-gray-200/60">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C0991B]/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#599200]/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-3 justify-center mb-4 bg-[#074504]/5 px-5 py-2 rounded-full border border-[#074504]/10">
              <span className="w-3 h-3 bg-[#C0991B] rounded-full animate-pulse"></span>
              <span className="text-[#074504] font-black tracking-[0.2em] text-xs uppercase block">STRATEGIC ADVANTAGE & TOOLS</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#074504] leading-tight mb-6 uppercase">
              Financial Clarity <span className="text-[#C0991B]">& Impact Ecosystem</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg lg:text-xl leading-relaxed">
              We empower our members with transparent tools, pre-qualification engines, and certified checklists to streamline funding access and accelerate business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                title: "Instant Loan Projections",
                desc: "Calculate loan schedules and repayment timelines tailored to your business cash flow.",
                icon: BarChart3,
                badge: "Calculator Tool",
                link: "/pre-qualification"
              },
              {
                title: "Funding-Ready Checklists",
                desc: "Verify requirement compliance for SME loans, asset financing, and emergency credit.",
                icon: CheckCircle2,
                badge: "Instant PDF",
                link: "/checklists"
              },
              {
                title: "Scholarship & Mentorship",
                desc: "Explore education funding intake guidelines and community youth mentorship schedules.",
                icon: BookOpen,
                badge: "Community Hub",
                link: "/programs/education-support"
              },
              {
                title: "Fast Pre-Qualification",
                desc: "Check your borrowing limits in 60 seconds with zero impact on your credit history.",
                icon: ShieldCheck,
                badge: "60-Sec Check",
                link: "/pre-qualification"
              }
            ].map((tool, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(7,69,4,0.12)] hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-[#074504] group-hover:bg-[#C0991B] text-[#C0991B] group-hover:text-[#074504] rounded-2xl flex items-center justify-center transition-colors shadow-sm">
                      <tool.icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-[#074504] bg-[#F4F7F6] border border-gray-200 px-3 py-1 rounded-full uppercase">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[#074504] text-xl mb-3 group-hover:text-[#C0991B] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6">
                    {tool.desc}
                  </p>
                </div>
                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-xs font-black text-[#074504] group-hover:text-[#C0991B] uppercase tracking-wider transition-all pt-4 border-t border-gray-100"
                >
                  <span>Explore Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. IMPACT CTA SECTION */}
      <section className="w-full py-16 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#074504] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight uppercase">
                Ready to <span className="text-[#C0991B]">Scale Your Impact?</span>
              </h2>
              <p className="text-white/80 text-lg font-medium mb-0 max-w-xl">
                Whether you're looking for growth capital, asset financing, or expert financial advice, Neema HEEP is your partner in building sustainable wealth.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
               <Link to="/request-callback" className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold transition-all text-center">
                 Get Expert Advice
               </Link>
            </div>
          </div>
        </div>
      </section>



      {/* LEAD CAPTURE SECTION */}
      <section className="w-full py-20 px-6 lg:px-12 bg-[#074504] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#599200] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-3 justify-center mb-6">
            <span className="w-6 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-[10px] uppercase block">EXPERT GUIDANCE</span>
            <span className="w-6 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6 uppercase">
            Want personalized <span className="text-[#C0991B]">financial advice?</span>
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-medium mb-10 max-w-2xl">
            Drop your email or phone number below, and one of our Neema Experts will reach out to guide you through your best options.
          </p>
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] w-full max-w-2xl mx-auto shadow-2xl relative">
            <SmartLeadForm 
              type="Callback"
              title=""
              description=""
              ctaText="Request a Call Back"
              fields={[
                { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
                { name: 'phone', label: 'Email or Phone Number', type: 'tel', placeholder: '+254...', required: true }
              ]}
              successMessage="We have received your details. A Neema Expert will contact you shortly!"
            />
          </div>
          <p className="text-white/60 text-sm mt-6 font-bold uppercase tracking-wider">No commitments. Just clear, honest financial guidance.</p>
        </div>
      </section>

      {/* Regulated banner */}
      <section className="w-full py-16 px-6 lg:px-12 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
           <div className="text-center lg:text-left">
             <h3 className="font-extrabold text-[#074504] text-xl mb-2">Fully Regulated and Compliant</h3>
             <p className="text-sm text-gray-500 font-medium">AMFI Kenya Member · Data Protection Act 2019</p>
           </div>
           <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              <span className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 flex items-center gap-2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><CheckCircle2 className="w-4 h-4 text-[#C0991B]"/> AMFI Kenya</span>
              <span className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 flex items-center gap-2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><CheckCircle2 className="w-4 h-4 text-[#C0991B]"/> Data Protected</span>
              <span className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 flex items-center gap-2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><CheckCircle2 className="w-4 h-4 text-[#C0991B]"/> ISO Certified</span>
           </div>
      </div>
</section>

      {/* Footer CTA */}
      <section className="bg-[#074504] text-white py-32 px-6 lg:px-12 text-center relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#599200] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 justify-center mb-6">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">YOUR NEXT CHAPTER</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            READY TO START<br/>
            <span className="text-[#C0991B]">YOUR JOURNEY?</span>
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-12 font-medium">
            Take the guesswork out of lending. See what rates and limits you qualify for in seconds before speaking with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link 
               to="/request-callback"
               className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] font-extrabold py-5 px-10 rounded-full transition-transform hover:-translate-y-1 duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
             >
               Request a Free Callback <span className="text-xl leading-none">→</span>
             </Link>
             <Link to="/newsletter-subscribe" 
               className="bg-white hover:bg-gray-50 text-[#074504] font-extrabold py-5 px-10 rounded-full transition-transform hover:-translate-y-1 duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
             >
               Subscribe to Our Newsletter <span className="text-xl leading-none">→</span>
             </Link>
          </div>
      </div>
</section>
    </main>
  );
}
