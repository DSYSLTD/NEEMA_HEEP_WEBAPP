import { Droplets, BookOpen, Store, Sprout } from "lucide-react";
import { motion } from "motion/react";

const items = [
  {
    icon: Droplets,
    label: "Health",
    description: "Health is a foundational pillar of Neema HEEP.  We believe healthy communities are the foundation of productivity, dignity, and sustainable development.",
  },
  {
    icon: BookOpen,
    label: "Education",
    description: "Education is a transformative pillar. We invest in education as the key driver of economic mobility and long-term community progress.",
  },
  {
    icon: Store,
    label: "Empowerment",
    description: "Empowerment is at the core of Neema HEEP. We promote dignity, self-reliance, and inclusive economic participation.",
  },
  {
    icon: Sprout,
    label: "Prosperity",
    description: "Prosperity represents our long-term vision of sustainable wealth creation and shared economic growth. We support members in building financial stability.",
  },
];

export default function IconGrid() {
  return (
    <section className="w-full pt-16 pb-20 px-6 lg:px-12 bg-white relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-3 justify-center mb-6">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">OUR FOUNDATION</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-tight mb-6">
            NEEMA HEEP <span className="text-[#C0991B]">CORE PILLARS</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="group flex flex-col items-start text-left p-10 rounded-[2rem] bg-[#074504] border border-[#0a5c05] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C0991B]/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                
                {/* Giant faded background icon */}
                <Icon className="absolute -bottom-6 -right-6 w-32 h-32 text-white/[0.03] group-hover:text-white/[0.06] group-hover:rotate-12 transition-all duration-700 pointer-events-none" />

                <div className="w-16 h-16 rounded-[1.25rem] bg-[#C0991B]/20 backdrop-blur-sm flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#C0991B] transition-all duration-500 border border-[#C0991B]/30 group-hover:border-[#C0991B] relative z-10 shadow-md">
                  <Icon className="w-8 h-8 text-[#C0991B] group-hover:text-[#074504] transition-colors" />
                </div>
                
                <h3 className="text-2xl font-extrabold text-white mb-4 relative z-10 tracking-tight group-hover:text-[#C0991B] transition-colors">{item.label}</h3>
                <p className="text-white/80 text-[15px] font-medium leading-relaxed relative z-10">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
    </div>
</section>
  );
}
