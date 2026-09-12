import { ArrowRight, HeartPulse, Stethoscope, Droplets, Activity, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function CommunityHealth() {
  const initiatives = [
    {
      icon: <Stethoscope className="w-10 h-10" />,
      title: "Community Health Outreaches",
      description: "We routinely organize free health checkups, preventive screenings, and clinical consultations in marginalized zones across Mt. Kenya to ensure residents access essential care.",
      highlights: ["Free Consultations", "Preventive Screenings", "Essential Drug Access"]
    },
    {
      icon: <Droplets className="w-10 h-10" />,
      title: "WASH Programs",
      description: "Empowering households to build sanitation facilities and access clean water through targeted WASH Loans and community education.",
      highlights: ["Clean water access", "Sanitation financing", "Hygiene education"]
    },
    {
      icon: <PlusCircle className="w-10 h-10" />,
      title: "Maternal Health",
      description: "Partnering with clinics to provide grant-based support for better equipment and maternal care resources to reduce infant mortality.",
      highlights: ["Facility upgrades", "Maternal kits", "Emergency support"]
    },
    {
      icon: <HeartPulse className="w-10 h-10" />,
      title: "Mosquito Net Distribution",
      description: "Initiated in September 2013, our programme distributes long-lasting insecticide-treated mosquito nets (LLINs) to microfinance clients, expectant mothers, and under-5s to prevent malaria and safeguard household working capital.",
      highlights: ["5,000+ Nets Distributed", "Expectant Mothers & Under-5s", "Malaria Bill Savings"]
    }
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-[#074504] text-white py-24 lg:py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#074504] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8"
          >
            <Activity className="w-4 h-4 text-[#C0991B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C0991B]">Community Well-being</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tighter uppercase leading-[0.95]"
          >
            Healthy <span className="text-[#C0991B]">People</span>. <br/>
            Prosperous <span className="text-[#C0991B]">Wealth</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            A healthy community is the foundation of a prosperous economy. We integrate health initiatives deeply within our operations to ensure long-term well-being.
          </motion.p>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {initiatives.map((initiative, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-gray-100 p-10 rounded-[2.5rem] flex flex-col items-start hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 text-[#C0991B] group-hover:bg-[#C0991B]/10 transition-colors">
                {initiative.icon}
              </div>
              <h3 className="text-2xl font-black text-[#074504] mb-4 uppercase tracking-tight">{initiative.title}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                {initiative.description}
              </p>
              <div className="space-y-3 w-full">
                {initiative.highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold text-[#074504]/70">
                    <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          {/* CTA Card to fill space */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#074504] text-white border border-[#074504] p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C0991B]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 uppercase leading-tight tracking-tighter">
                Want to expand your <br/> healthcare outreach?
              </h3>
              <p className="text-white/80 font-bold text-lg mb-0">
                Partner with us for health outreaches, net distribution, or supply sponsorships.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <Link 
                to="/request-partnership" 
                className="inline-flex items-center gap-3 bg-[#C0991B] hover:bg-[#a38217] text-[#074504] px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-all justify-center min-w-[200px]"
              >
                Become a Health Partner <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/request-callback" 
                className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-md transition-all justify-center min-w-[200px]"
              >
                Request a Call Back
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero-like Highlight Row */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-32">
        <div className="bg-[#074504] rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C0991B]/5 -skew-x-12 translate-x-12" />
          
          <div className="lg:w-1/2 relative z-10 text-white">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-[1.1] uppercase tracking-tight">
              Impact <span className="text-[#C0991B]">Numbers</span>.
            </h2>
            <div className="grid grid-cols-2 gap-8">
               <div>
                  <h4 className="text-4xl font-black text-[#C0991B]">50+</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Health Outreaches</p>
               </div>
               <div>
                  <h4 className="text-4xl font-black text-[#C0991B]">2k+</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Free Consultations</p>
               </div>
               <div>
                  <h4 className="text-4xl font-black text-white">5,000+</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Nets Distributed</p>
               </div>
               <div>
                  <h4 className="text-4xl font-black text-[#C0991B]">24/7</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Health Support</p>
               </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative z-10 text-white/80 space-y-6 text-lg font-medium leading-relaxed">
             <p>
               Neema HEEP recognizes that health costs are one of the biggest drivers of financial instability in Kenyan households.
             </p>
             <p>
               By integrating preventative healthcare and sanitation into our financing matrix, we ensure that the wealth our members build isn't wiped out by avoidable illness.
             </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#074504] mb-8 uppercase tracking-tight leading-tight">
          Are you running <br className="hidden md:block"/> a medical clinic?
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg font-medium">
          We understand health business models. Join us to access specialized capital aimed at upscaling your facility and serving more people.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/request-callback" className="w-full sm:w-auto bg-[#074504] hover:bg-[#052903] text-white font-black uppercase text-xs tracking-widest py-5 px-12 rounded-full transition-all shadow-xl hover:scale-105">
            Request a Call Back
          </Link>
          <Link to="/registration" className="w-full sm:w-auto border-2 border-[#074504] text-[#074504] font-black uppercase text-xs tracking-widest py-5 px-12 rounded-full hover:bg-[#074504] hover:text-white transition-all">
            Become a Member
          </Link>
        </div>
      </section>
    </main>
  );
}

