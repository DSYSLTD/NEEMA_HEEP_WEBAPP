import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import { CheckCircle2, ArrowRight, Users, BarChart3, ShieldCheck, HeartHandshake, PhoneCall, Calculator, MessageCircle } from 'lucide-react';

export default function WhoWeAre() {
  return (
    <section id="who-we-are-section" className="w-full py-20 lg:py-28 px-6 lg:px-12 bg-[#FAFCFB] relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white rounded-l-[120px] pointer-events-none -mr-24 z-0 hidden lg:block" />
      <div className="absolute -top-40 right-20 w-96 h-96 bg-[#599200]/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C0991B]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10">
        
        {/* Left Column: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {/* Eyebrow Header: WHO WE ARE */}
          <div className="inline-flex items-center gap-2.5 mb-6">
            <span className="w-6 h-[3px] bg-[#599200] rounded-full" />
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">WHO WE ARE</span>
            <span className="w-6 h-[3px] bg-[#599200] rounded-full" />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black text-[#074504] leading-tight mb-6 uppercase tracking-tight">
            CATALYZING PROGRESS <span className="text-[#C0991B]">BUILDING LEGACIES</span>
          </h2>

          {/* Description Paragraph */}
          <div className="space-y-6 text-gray-700 font-medium leading-relaxed text-base lg:text-lg mb-8 text-left">
            <p className="text-left text-pretty">
              Through these offerings, combined with tailored credit facilities and financial literacy programs, the institution leverages technology enabled operations and mobile money systems to drive efficiency, transparency, and scalability while empowering communities to grow incomes, build resilience, and achieve sustainable prosperity.
            </p>

            {/* Checkmark Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 py-2 text-left">
              {[
                "Consistent community engagement",
                "Responsible lending practices",
                "A strong focus on financial literacy",
                "Sustainable growth & impact"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#599200] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#599200]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">{item}</span>
                </div>
              ))}
            </div>

            {/* Links Paragraph */}
            <p className="text-sm lg:text-base text-gray-700 text-left text-pretty">
              Today, Neema HEEP is a trusted financial partner serving individuals, farmers and businesses across Kenya with accessible{' '}
              <Link to="/loans" className="text-[#C0991B] font-extrabold hover:underline">
                business loans
              </Link>
              ,{' '}
              <Link to="/loans/mali" className="text-[#C0991B] font-extrabold hover:underline">
                asset financing
              </Link>
              {' '}and inclusive financial solutions designed to support enterprise growth and improve livelihoods.
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/loans" 
              className="bg-[#074504] hover:bg-[#032b02] text-white font-extrabold py-4 px-9 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 group w-full sm:w-auto text-base tracking-wide uppercase"
            >
              <span>Explore Our Loans</span> 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Animation & Card Grid starting at same level as CATALYZING */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col items-center justify-center w-full lg:pt-11 gap-6"
        >
          {/* Dashed Gold Circular Ring Behind Cards */}
          <div className="absolute top-11 w-[110%] sm:w-[105%] max-w-[480px] aspect-square rounded-full border-[2.5px] border-dashed border-[#C0991B]/60 animate-[spin_45s_linear_infinite] pointer-events-none z-0" />

          {/* 2x2 Grid of Interactive Visual Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 relative z-10 w-full max-w-[460px]">
            
            {/* Card 1: 100% COMMUNITY FOCUSED */}
            <div className="bg-[#074504] p-6 sm:p-8 rounded-[2rem] shadow-xl text-white transform hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[190px]">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#C0991B]/20 border border-[#C0991B]/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xs">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0991B]" />
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-[#C0991B] mb-1">
                  <CountUp end={100} suffix="%" enableScrollSpy scrollSpyOnce />
                </div>
                <p className="text-white/80 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  COMMUNITY FOCUSED
                </p>
              </div>
            </div>
            
            {/* Card 2: GROWTH SUSTAINABLE SCALE */}
            <div className="bg-[#599200] p-6 sm:p-8 rounded-[2rem] shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 overflow-hidden relative border border-[#599200]/50 flex flex-col justify-between text-white min-h-[170px] sm:min-h-[190px]">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#074504]/30 border border-[#C0991B]/30 rounded-2xl flex items-center justify-center shadow-xs backdrop-blur-sm">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0991B]" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
                  GROWTH
                </div>
                <p className="text-white/80 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  SUSTAINABLE SCALE
                </p>
              </div>
            </div>

            {/* Card 3: TRUSTED RELIABILITY */}
            <div className="bg-[#C0991B] p-6 sm:p-8 rounded-[2rem] shadow-xl text-[#074504] transform hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[190px]">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#074504]/20 border border-[#074504]/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#074504]" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-[#074504] mb-1 tracking-tight uppercase">
                  TRUSTED
                </div>
                <p className="text-[#074504]/80 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  RELIABILITY
                </p>
              </div>
            </div>

            {/* Card 4: 2010 FOUNDED IN EMBU */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl text-[#074504] transform hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between border border-gray-100 min-h-[170px] sm:min-h-[190px]">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#074504] border border-[#074504] rounded-2xl flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0991B]" />
              </div>
              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-[#074504] mb-1">
                  2010
                </div>
                <p className="text-gray-500 font-extrabold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  FOUNDED IN EMBU
                </p>
              </div>
            </div>

          </div>

          {/* CTA Banner Immediately Below the 2x2 Card Grid */}
          <div className="relative z-10 w-full max-w-[460px] bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#599200] block mb-0.5">Quick Consultation</span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#074504] leading-snug">Need Financial Guidance?</h4>
              <p className="text-xs text-gray-500 font-medium">Connect with our advisors today</p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <Link
                to="/contact"
                className="flex-1 sm:flex-initial bg-[#074504] hover:bg-[#053303] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide group"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#C0991B] group-hover:scale-110 transition-transform" />
                <span>Request Call Back</span>
              </Link>

              <a
                href="https://wa.me/254700000000?text=Hello%20Neema%20HEEP%2C%20I%20would%20like%20to%20inquire%20about%20your%20financial%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold p-3 rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
              </a>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}


