import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProvenProcess from '../components/ProvenProcess';
import SimpleProcess from '../components/SimpleProcess';

export default function ProcessAndCompliance() {
  return (
    <main className="flex-grow flex flex-col items-center w-full bg-[#f8faf8] font-sans">
      <section className="w-full bg-[#074504] text-white pt-24 pb-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">PROVEN PROCESS & STANDARDS</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] uppercase">
            HOW WE <span className="text-[#C0991B]">WORK</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Transparency and compliance are the foundation of everything we do at Neema HEEP.
          </p>
        </div>
      </section>

      <ProvenProcess />
      
      <div className="w-full py-16 text-center">
        <a href="/Neema-HEEP-Process.pdf" download className="inline-flex items-center gap-2 bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-8 py-4 rounded-full font-bold transition-all shadow-[0_4px_14px_rgba(212,175,55,0.4)]">
          Download Our Process PDF <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </main>
  );
}
