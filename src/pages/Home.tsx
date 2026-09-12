import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall, Building2, TrendingUp, Clock, MapPin, MousePointer2, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'motion/react';
import WhyChooseUs from '../components/WhyChooseUs';
import ImpactCounters from '../components/ImpactCounters';
import TestimonialCarousel from '../components/TestimonialCarousel';
import TrustBadges from '../components/TrustBadges';
import StickyApplyBar from '../components/StickyApplyBar';
import ProvenProcess from '../components/ProvenProcess';

const HERO_IMAGES = [
  { src: "/slider_1.jpg", driveFallback: "https://lh3.googleusercontent.com/d/1-YvLfz-HNAfDvcxc0nLeNi6K2C2Hhq4a" },
  { src: "/slider_2.jpg", driveFallback: "https://lh3.googleusercontent.com/d/1tSDoE_fFpz9eCKhNS2luIT9FzsA54BX7" },
  { src: "/slider_3.jpg", driveFallback: "https://lh3.googleusercontent.com/d/1JdnsZU0dE174YSyjjaw73k0fp5iFab0I" },
  { src: "/slider_4.jpg", driveFallback: "https://lh3.googleusercontent.com/d/1PnF6KuHvvRVKV_qx0Vl-oqBElOD9IVaQ" },
  { src: "/slider_5.jpg", driveFallback: "https://lh3.googleusercontent.com/d/1B8QD80-i-e0Ax7v4_F1peU1xjfdCz6c0" },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // 6 seconds per image
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_IMAGES[currentImageIndex];

  return (
    <>
      <main className="flex-grow flex border-b border-gray-100 flex-col items-center w-full bg-[#f8faf8]">
        {/* Hero Section */}
        <section className="w-full relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image Slider */}
          <div className="absolute inset-0 z-0 bg-[#074504]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentSlide.src}
                src={encodeURI(currentSlide.src)} 
                alt="Neema HEEP Financial Growth" 
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = currentSlide.driveFallback;
                  }
                }}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover aspect-video"
              />
            </AnimatePresence>

            {/* Transition Overlay */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`overlay-${currentImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 1, times: [0, 0.5, 1], ease: "easeInOut" }}
                className="absolute inset-0 z-[1] bg-[#074504] pointer-events-none"
              />
            </AnimatePresence>

            <div className="absolute inset-0 z-[2] bg-black/50 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
            
            {/* Decorative Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            {/* Slider Indicators */}
            <div className="absolute bottom-10 right-6 lg:right-12 z-20 flex gap-2">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-1 transition-all duration-500 rounded-full ${i === currentImageIndex ? 'w-8 bg-[#599200]' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          </div>
          
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 w-full py-20 lg:py-32">
            <div className="max-w-3xl text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#599200]/30 backdrop-blur-md border border-[#599200]/40 text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[#599200] animate-pulse" />
                AMFI KENYA MEMBER · EST. 2010
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8"
              >
                Your Trusted Partner <br />
                in <span className="text-[#599200]">Financial Growth.</span>
              </motion.h1>
  
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl font-medium leading-relaxed"
              >
                From business financing to community empowerment groups, Neema HEEP is committed to helping communities prosper.
              </motion.p>
 
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row flex-wrap items-center gap-4 md:gap-5"
              >
                <Link 
                  to="/about-us" 
                  className="bg-[#074504] hover:bg-[#0a5a06] text-white font-black py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto text-base uppercase tracking-wider shadow-2xl border-b-4 border-[#599200] active:translate-y-1 active:border-b-0"
                >
                  Join Neema HEEP
                </Link>
                <Link 
                  to="/pre-qualification" 
                  className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] font-black py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto text-base uppercase tracking-wider shadow-2xl cursor-pointer"
                >
                  Check Eligibility
                </Link>
                <Link 
                  to="/about-us" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-white font-black py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto text-base uppercase tracking-wider shadow-2xl"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-[#599200] rounded-full"
              />
            </div>
            <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Scroll</span>
          </motion.div>
        </section>

        {/* Stats Row Section */}
        <section className="w-full bg-[#f8faf8] py-24 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { num: 8600, suffix: "+", label: "FAMILIES REACHED", icon: Users, color: "#C0991B" },
                { num: 56, suffix: "%", label: "RURAL OUTREACH", icon: TrendingUp, color: "#C0991B" },
                { num: 6, suffix: "hrs", label: "AVERAGE RESPONSE", icon: Clock, color: "#C0991B" },
                { num: 7, suffix: "", label: "COUNTIES SERVED", icon: MapPin, color: "#C0991B" }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -12 }}
                  className="flex flex-col items-start p-10 bg-[#074504] rounded-[2.5rem] border border-[#0a5a06] shadow-2xl relative overflow-hidden group"
                >
                  {/* Decorative background circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B] opacity-[0.08] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500 shadow-inner bg-[#C0991B]/15 border border-[#C0991B]/30 text-[#C0991B]"
                  >
                    <stat.icon className="w-7 h-7 text-[#C0991B]" strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <h3 className="text-5xl font-black text-white mb-3 tracking-tighter">
                      <CountUp end={stat.num} duration={3} separator="," />{stat.suffix}
                    </h3>
                    <div className="w-12 h-1 bg-[#599200] mb-6 group-hover:w-24 transition-all duration-500" style={{ backgroundColor: stat.color }} />
                    <p className="text-xs uppercase font-black tracking-[0.25em] text-white/40 group-hover:text-white/80 transition-colors">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Sections --- */}
        <WhyChooseUs />
        <TrustBadges />

        {/* Dynamic Arise & Shine Scholarship CTA Block */}
        <section className="w-full py-20 bg-emerald-50/40 border-y border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#C0991B]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="bg-[#074504]/10 text-[#074504] border border-[#074504]/5 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full inline-block">
                  Education Support & Scholarships
                </span>
                <h2 className="text-4xl lg:text-5xl font-black text-[#074504] uppercase tracking-tighter leading-tight">
                  Arise & Shine <span className="text-[#C0991B]">Scholarship</span> Support
                </h2>
                <p className="text-gray-600 font-medium text-base leading-relaxed max-w-2xl">
                  Through the Arise & Shine Education Support, we actively identify and co-sponsor bright students facing financial hardship for junior and senior secondary school education (grades 10 to 12).
                </p>
                <div className="flex flex-wrap gap-6 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-2">✓ School Fee Scholarships</span>
                  <span className="flex items-center gap-2">✓ Mentorship Support</span>
                  <span className="flex items-center gap-2">✓ Grades 10 to 12 Focus</span>
                </div>
              </div>
              <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                   <h3 className="text-lg font-black text-[#074504] uppercase tracking-tight">Need Scholarship Support?</h3>
                   <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">
                     Our streamlined digital intake allows students and families to submit application details and documents for formal scholarship evaluation.
                   </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    to="/sponsorship" 
                    className="flex-grow bg-[#074504] hover:bg-[#599200] text-center text-white font-black py-4 px-8 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:scale-[1.02]"
                  >
                    Apply for Support
                  </Link>
                  <Link 
                    to="/beneficiaries" 
                    className="flex-grow bg-[#C0991B] hover:bg-[#a38012] text-center text-[#074504] font-black py-4 px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:scale-[1.02]"
                  >
                    View Beneficiaries
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProvenProcess />
        <ImpactCounters />
        
        {/* CTA Section with Animated Metrics Below */}
        <section className="w-full py-24 bg-[#074504] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#599200]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block mb-4">Start Your Journey Today</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-8">
              Transform Your <br />
              <span className="text-[#C0991B]">Future Now</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of Kenyan entrepreneurs and families who have found prosperity with Neema HEEP. Our streamlined process ensures you get the support you need when you need it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Link to="/registration" className="w-full sm:w-auto bg-[#C0991B] hover:bg-[#A38217] text-[#074504] font-black py-6 px-12 rounded-full text-base uppercase tracking-widest transition-all shadow-xl hover:scale-105">
                Become a Member
              </Link>
              <Link to="/pre-qualification" className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-white text-white font-black py-6 px-12 rounded-full text-base uppercase tracking-widest transition-all hover:scale-105">
                See If You Qualify
              </Link>
            </div>

            {/* Animated Impact Metrics Below Start Your Journey Today */}
            <div className="pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              {[
                { label: "Families Reached", val: 8600, suffix: "+", color: "#C0991B" },
                { label: "Years of Impact", val: 15, suffix: "+", color: "#599200" },
                { label: "Counties Served", val: 7, suffix: "", color: "#C0991B" },
                { label: "Satisfaction Rate", val: 98.4, suffix: "%", isDecimal: true, color: "#599200" }
              ].map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -6 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#C0991B]/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                  <p className="text-2xl lg:text-3xl font-black text-white mb-1 tracking-tight">
                    {('prefix' in m ? (m as { prefix?: string }).prefix : "")}
                    {m.isDecimal ? (
                      <CountUp end={m.val} decimals={1} duration={2.5} />
                    ) : (
                      <CountUp end={m.val} duration={2.5} separator="," />
                    )}
                    {m.suffix}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider font-extrabold text-[#C0991B]">{m.label}</p>
                  <div className="w-8 h-1 rounded-full mt-3 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: m.color }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialCarousel />
        <StickyApplyBar />
        
      </main>
    </>
  );
}
