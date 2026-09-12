import { ArrowRight, TrendingUp, Handshake, Landmark, Briefcase, CheckCircle2, BarChart3, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function EconomicEmpowerment() {
  const pillars = [
    {
      icon: <Landmark className="w-10 h-10" />,
      title: "Group Lending & Support",
      description: "We champion microfinance loans via structured groups, fostering accountability and allowing individuals without traditional collateral to access credit and build sustainable futures.",
      highlights: ["No traditional collateral required", "Peer support networks", "Structured repayment plans"]
    },
    {
      icon: <Handshake className="w-10 h-10" />,
      title: "Business Mentorship",
      description: "Beyond capital, we pair established business owners with rising entrepreneurs. Our mentorship program focuses on structural growth and long-term sustainability.",
      highlights: ["1-on-1 coaching", "Industry-specific advice", "Performance tracking"]
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Market Linkages",
      description: "Connecting producers directly with bulk off-takers. We mitigate post-harvest losses and secure reliable income streams for agricultural and small-scale manufacturers.",
      highlights: ["Direct buyer access", "Value chain optimization", "B2B networking"]
    }
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-[#074504] text-white py-24 lg:py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#074504] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8"
          >
            <Briefcase className="w-4 h-4 text-[#C0991B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C0991B]">Economic Resilience</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tighter uppercase leading-[0.95]"
          >
            Building <span className="text-[#C0991B]">Sustainable</span> <br/>
            Wealth <span className="text-[#C0991B]">Together</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Breaking the cycle of poverty by providing SMEs and vulnerable groups with structural tools, capital access, and strategic financial advice.
          </motion.p>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -12 }}
              className="bg-white border border-gray-100 p-10 rounded-[2.5rem] flex flex-col items-start hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#074504]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#074504]/10 border border-[#074504]/20 flex items-center justify-center mb-8 text-[#074504] group-hover:bg-[#074504] group-hover:text-[#C0991B] transition-all duration-300 shadow-xs">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black text-[#074504] mb-4 uppercase tracking-tight leading-tight">{pillar.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-semibold">
                {pillar.description}
              </p>
              <div className="space-y-3 w-full border-t border-gray-50 pt-8 mt-auto">
                {pillar.highlights.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 text-sm font-bold text-[#074504]/70"
                    whileHover={{ x: 5 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Statistics / Impact Row - Animated */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#074504] rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl"
        >
           <div className="absolute top-0 left-0 w-64 h-64 bg-[#C0991B]/10 rounded-full blur-[100px]"></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
              {[
                { icon: BarChart3, color: '#C0991B', value: '1000+', label: 'Active Enterprises' },
                { icon: Globe, color: '#C0991B', value: '7', label: 'Counties Reached' },
                { icon: TrendingUp, color: '#C0991B', value: '98%', label: 'Loan Success Rate' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <stat.icon className="w-8 h-8 text-[#C0991B] mx-auto mb-4" />
                  <h4 className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</h4>
                  <p className="text-white/60 font-bold uppercase text-[10px] tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
        <div className="inline-flex items-center gap-2 text-[#074504] font-black uppercase text-xs tracking-widest mb-6">
           Ready to Start?
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#074504] mb-8 uppercase tracking-tight leading-tight">
          Ready to scale <br className="hidden md:block"/> your enterprise?
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg font-medium">
          Take the first step towards sustainable structural growth. Reach out for a specialized consultation or join our network today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/contact" className="w-full sm:w-auto bg-[#074504] hover:bg-[#052903] text-white font-black uppercase text-xs tracking-widest py-5 px-10 rounded-full transition-all shadow-xl hover:scale-105">
            Request a Call Back
          </Link>
          <Link to="/registration" className="w-full sm:w-auto border-2 border-[#074504] text-[#074504] font-black uppercase text-xs tracking-widest py-5 px-10 rounded-full hover:bg-[#074504] hover:text-white transition-all">
            Join the Network
          </Link>
        </div>
      </section>
    </main>
  );
}

