import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProvenProcess from '../components/ProvenProcess';
import SimpleProcess from '../components/SimpleProcess';

export default function ProcessAndCompliance() {
  return (
    <main className="flex-grow flex flex-col items-center w-full bg-[#f8faf8] font-sans">
      <section className="w-full bg-[#074504] text-white pt-32 pb-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            How We Work
          </h1>
          <p className="text-lg text-white/80 font-medium">
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
