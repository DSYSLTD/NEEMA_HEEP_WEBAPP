import { Link } from 'react-router-dom';
import { Info, Smartphone, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function RequirementsPage() {
  return (
    <main className="flex-grow pt-32 pb-20 bg-[#f8faf8] flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-[#074504] leading-tight mb-4">
            Loan <span className="text-[#C0991B]">Requirements</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Get your documents ready before applying. A clean CRB record significantly improves your chances of approval.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* General Requirements */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <h3 className="text-xl font-bold text-[#074504] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#C0991B]" /> General Documents
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#074504]/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#074504]">1</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">Original National ID</p>
                  <p className="text-sm text-gray-500">Must be valid and legible.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#074504]/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#074504]">2</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">M-PESA / Bank Statements</p>
                  <p className="text-sm text-gray-500">6 months of certified statements.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#074504]/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#074504]">3</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">Passport Photo</p>
                  <p className="text-sm text-gray-500">Recent color passport size photo.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#074504]/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#074504]">4</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">KRA PIN Certificate</p>
                  <p className="text-sm text-gray-500">Tax compliance documentation.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* CRB Status Helper */}
          <div className="bg-[#074504] rounded-3xl p-8 border border-[#074504] shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#599200]/20 rounded-full blur-[40px] pointer-events-none"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-5 h-5 text-[#C0991B]" /> Know Your CRB Status
            </h3>
            <p className="text-white/80 text-sm mb-6 relative z-10">
              Your Credit Reference Bureau (CRB) status is key to loan approval. Before applying, we recommend checking your status to ensure there are no surprises.
            </p>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone className="w-5 h-5 text-[#C0991B]" />
                  <p className="font-bold text-white">Via Metropol Crystobol</p>
                </div>
                <div className="text-sm text-white/70 space-y-1 pl-8">
                  <p>1. Dial <span className="font-mono bg-black/20 px-1 rounded text-[#C0991B]">*433#</span> on your Safaricom line.</p>
                  <p>2. Enter your ID number and follow the prompts.</p>
                  <p>3. Pay KES 100 registration fee if prompted.</p>
                </div>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-5 h-5 text-[#C0991B]" />
                  <p className="font-bold text-white">Via CreditInfo</p>
                </div>
                <div className="text-sm text-white/70 space-y-1 pl-8">
                  <p>1. Visit <a href="https://ke.creditinfo.com" target="_blank" rel="noreferrer" className="text-[#C0991B] hover:underline">ke.creditinfo.com</a></p>
                  <p>2. Request your free annual credit report.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 bg-[#C0991B]/10 p-4 rounded-xl border border-[#C0991B]/20 relative z-10">
              <AlertTriangle className="w-5 h-5 text-[#C0991B] shrink-0 mt-0.5" />
              <p className="text-xs text-white/80">
                If you have a negative listing, obtaining a clearance certificate before applying will heavily speed up our evaluation process.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/join" 
            className="inline-flex items-center gap-3 bg-[#C0991B] hover:bg-[#A38217] text-[#074504] font-black uppercase text-sm tracking-widest py-6 px-12 rounded-full shadow-2xl transition-all hover:scale-105"
          >
            Start Your Registration Now <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
            Identity & Documents ready? Join the Neema HEEP family today.
          </p>
        </div>
      </div>
    </main>
  );
}
