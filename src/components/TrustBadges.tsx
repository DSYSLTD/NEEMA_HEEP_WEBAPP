import { Award, ShieldCheck, Landmark, CheckCircle2 } from "lucide-react";

export default function TrustBadges() {
  return (
    <section className="w-full py-20 bg-[#074504] border-y border-[#074504]/20 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-white/5 rotate-12 transform origin-center"></div>
        <div className="absolute top-[-50%] right-[-10%] w-[30%] h-[200%] bg-[#C0991B]/5 -rotate-12 transform origin-center"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="mb-14">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">Credentials and Compliance</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            CERTIFIED AND <span className="text-[#C0991B]">TRUSTED BY</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start justify-items-center relative">
          <div className="flex flex-col items-center gap-5 text-[#C0991B]/80 hover:text-[#C0991B] transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#C0991B]/10 group-hover:scale-105 transition-all duration-300 shadow-lg">
              <Award className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-bold text-sm md:text-base text-center uppercase tracking-widest text-white/90">AMFI-K Member</span>
          </div>
          
          <div className="flex flex-col items-center gap-5 text-[#C0991B]/80 hover:text-[#C0991B] transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#C0991B]/10 group-hover:scale-105 transition-all duration-300 shadow-lg">
              <CheckCircle2 className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-bold text-sm md:text-base text-center uppercase tracking-widest text-white/90">KRA Compliant</span>
          </div>

          <div className="flex flex-col items-center gap-5 text-[#C0991B]/80 hover:text-[#C0991B] transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#C0991B]/10 group-hover:scale-105 transition-all duration-300 shadow-lg">
              <ShieldCheck className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-bold text-sm md:text-base text-center uppercase tracking-widest text-white/90">Data Protected</span>
          </div>
        </div>
      </div>
    </section>
  );
}
