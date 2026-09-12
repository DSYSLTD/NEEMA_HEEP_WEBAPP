import { Users, Target, ShieldCheck, Leaf, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Users,
      title: "Community-Centered Approach",
      description: "Solutions designed around real needs on the ground."
    },
    {
      icon: Target,
      title: "Holistic Impact Model",
      description: "Financial, educational, and health support working together."
    },
    {
      icon: ShieldCheck,
      title: "Integrity and Accountability",
      description: "Transparent, professional, responsible operations."
    },
    {
      icon: Leaf,
      title: "Sustainable Empowerment",
      description: "Focus on long-term independence, not short-term relief."
    },
    {
      icon: MapPin,
      title: "Strong Local Presence",
      description: "Deep roots across the Mt. Kenya region."
    }
  ];

  return (
    <section className="w-full py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 justify-center mb-6"
          >
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">The Neema HEEP Difference</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] uppercase tracking-tight mb-6">
            Why <span className="text-[#C0991B]">Choose</span> Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            We are more than a lender; we are your partner in progress. Our solutions are designed around real needs on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#F9FAFB] border border-gray-100 p-8 rounded-3xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#074504]/10 border border-[#074504]/20 flex items-center justify-center shrink-0 shadow-xs mb-6 group-hover:scale-110 group-hover:bg-[#074504] group-hover:border-[#074504] transition-all duration-300">
                <item.icon className="w-7 h-7 text-[#074504] group-hover:text-[#C0991B] transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-extrabold text-gray-900 mb-3 tracking-tight">{item.title}</h4>
              <p className="text-gray-600 font-medium leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
          
          <Link 
            to="/request-callback"
            className="bg-[#074504] p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-end min-h-[250px] group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#599200] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Speak with an Expert</h4>
              <p className="text-white/80 font-medium mb-6">Get tailored financial advice today.</p>
              <div className="inline-flex items-center gap-2 text-[#C0991B] font-bold group-hover:translate-x-1 transition-transform">
                Request a Call Back <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
