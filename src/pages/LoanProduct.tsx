import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { LOAN_PRODUCTS } from '../lib/loanData';
import { LoanType } from '../lib/loanEngine';
import { CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Users, UserCheck, Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { trackHighInterestTimeOnPage } from '../services/trackingService';

export default function LoanProduct() {
  const { loanId } = useParams<{ loanId: string }>();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loanId]);

  // Track time spent on loan product pages for high-interest segment targeting (>2 mins)
  useEffect(() => {
    if (!loanId || !LOAN_PRODUCTS[loanId]) return;
    const productName = LOAN_PRODUCTS[loanId].name;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const secondsSpent = Math.floor((Date.now() - startTime) / 1000);
      if (secondsSpent >= 120) {
        trackHighInterestTimeOnPage(productName, secondsSpent);
      }
    }, 15000); // check periodically

    return () => clearInterval(timer);
  }, [loanId]);

  if (!loanId || !LOAN_PRODUCTS[loanId]) {
    return <Navigate to="/" replace />;
  }

  const product = LOAN_PRODUCTS[loanId];
  
  // Cast loanId to LoanType if applicable to the engine. Sync with loanEngine.ts
  const engineLoanType = loanId as LoanType;

  return (
    <main className="flex-grow flex flex-col items-center w-full bg-white">
      {/* Hero Banner */}
      <section className="w-full bg-[#074504] text-white py-16 lg:py-24 px-6 lg:px-12 relative overflow-hidden flex justify-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#599200] rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            {product.image && (
              <div className="mb-8 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700 bg-white/5">
                <img 
                  src={encodeURI(product.image)} 
                  alt={product.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback && product.driveFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = product.driveFallback;
                    } else if (!target.dataset.triedUnsplash) {
                      target.dataset.triedUnsplash = 'true';
                      target.src = `https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&text=${encodeURIComponent(product.name)}`;
                    }
                  }}
                />
              </div>
            )}
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">
                Loan Product
              </span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 leading-[1.1] tracking-tight uppercase">
              {product.name}
            </h1>
            <p className="text-lg lg:text-xl text-[#C0991B] max-w-lg mb-8 font-bold leading-relaxed">
              {product.subHeading || product.tagline}
            </p>
            <Link to="/pre-qualification" className="inline-flex items-center gap-2 bg-[#599200] hover:bg-[#28A428] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 duration-300 shadow-[0_10px_20px_rgba(50,205,50,0.3)]">
              Check your loan eligibility
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#599200]" />
            <h3 className="text-2xl font-bold mb-4 text-[#074504]">About {product.name}</h3>
            <p className="text-gray-700 leading-relaxed mb-6 font-medium text-sm">
              {product.description}
            </p>

            {product.targetMarket && (
              <div className="bg-[#074504]/5 rounded-2xl p-5 mb-6 border border-[#074504]/10">
                <p className="font-bold text-[#074504] mb-2 text-xs uppercase tracking-wider">Target Market</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{product.targetMarket}</p>
              </div>
            )}

            {product.associatedProgram && (
              <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl p-5 mb-8 border border-emerald-200/80 shadow-xs relative overflow-hidden group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#074504] bg-white/80 px-2.5 py-1 rounded-full border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C0991B]" /> Associated Flagship Programme
                  </div>
                </div>
                <h4 className="font-extrabold text-[#074504] text-base mb-1">{product.associatedProgram.name}</h4>
                <p className="text-xs text-gray-600 font-medium mb-4 italic">"{product.associatedProgram.subtitle}"</p>
                <Link 
                  to={product.associatedProgram.programPath}
                  className="inline-flex items-center gap-2 bg-[#074504] hover:bg-[#599200] text-white text-xs font-bold py-2.5 px-4 rounded-full transition-all shadow-sm"
                >
                  {product.associatedProgram.ctaText || 'Explore Programme Page'} <ArrowRight className="w-3.5 h-3.5 text-[#C0991B]" />
                </Link>
              </div>
            )}
            
            <ul className="space-y-3 mb-8">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#C0991B] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#074504] border border-[#074504]/20 rounded-full hover:bg-[#F4F7F6] transition-colors mb-4"
              >
                View Details and Eligibility {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isExpanded && (
                <div className="bg-[#F4F7F6] rounded-2xl p-4 mb-4 text-sm text-gray-600 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                  <p className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-wider">Eligibility</p>
                  <ul className="space-y-1 mb-4 text-xs font-medium">
                    {(product.eligibility || [
                      'Valid Kenyan National ID',
                      'Proof of income or business',
                      'Age 18-70 years'
                    ]).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-wider">Required Documents</p>
                  <ul className="space-y-1 text-xs font-medium">
                    {(product.requiredDocuments || [
                      'National ID / Passport',
                      '3 months bank statements',
                      'Utility bill (proof of residence)'
                    ]).map((doc, idx) => (
                      <li key={idx}>• {doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Link 
                to={`/registration`}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-white bg-[#074504] hover:bg-[#053303] transition-transform hover:scale-105 shadow-md"
              >
                Apply for {product.name} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Product Sections for Nawiri and Rich Products */}
      {(product.whoCanApply || product.howItWorks || product.whyNawiri) && (
        <section className="w-full py-16 px-6 lg:px-12 bg-[#f8faf8] border-y border-gray-200/80">
          <div className="max-w-5xl mx-auto space-y-16">
            
            {/* Header & Overview */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#074504]/10 text-[#074504] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> {product.name} Overview
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#074504]">
                {product.subHeading || product.tagline}
              </h2>
            </div>

            {/* Who Can Apply? */}
            {product.whoCanApply && (
              <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#074504] text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-[#C0991B]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#074504]">Who Can Apply?</h3>
                    <p className="text-xs text-gray-500 font-medium">Simple qualification requirements to get started</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {product.whoCanApply.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[#f8faf8] p-4 rounded-2xl border border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-[#074504] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#C0991B]" />
                      </div>
                      <span className="text-sm text-gray-800 font-medium leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How Does It Work? */}
            {product.howItWorks && (
              <div className="space-y-8">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-extrabold text-[#074504]">How Does the {product.name} Work?</h3>
                  <p className="text-xs text-gray-500 font-medium">Follow these 5 simple steps to access growth capital</p>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  {product.howItWorks.map((stepItem) => (
                    <div key={stepItem.step} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3 relative flex flex-col justify-between hover:border-[#074504]/40 transition-colors">
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-[#074504] text-[#C0991B] font-black text-sm flex items-center justify-center shadow-xs">
                          {stepItem.step}
                        </div>
                        <h4 className="font-extrabold text-sm text-[#074504] leading-tight">{stepItem.title}</h4>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">{stepItem.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Nawiri? */}
            {product.whyNawiri && (
              <div className="bg-[#074504] text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#599200]/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <span className="text-xs font-black uppercase text-[#C0991B] tracking-widest block">Why Choose Nawiri?</span>
                  <h3 className="text-2xl lg:text-3xl font-extrabold italic text-white">
                    "{product.whyNawiri.tagline}"
                  </h3>
                  <p className="text-sm lg:text-base text-white/90 font-medium leading-relaxed max-w-2xl">
                    {product.whyNawiri.description}
                  </p>
                </div>

                <div className="pt-4 relative z-10">
                  <Link 
                    to="/registration" 
                    className="inline-flex items-center gap-2 bg-[#C0991B] hover:bg-[#A38217] text-[#074504] font-black uppercase text-xs tracking-widest py-3.5 px-8 rounded-full transition-all hover:scale-105 shadow-md"
                  >
                    Apply For Nawiri Loan Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full py-20 bg-[#F4F7F6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-[#074504] mb-6 tracking-tight uppercase">Ready to get started?</h2>
          <p className="text-gray-600 mb-10 font-medium leading-relaxed">
            Our loan officers are standing by to help you navigate your financial journey with ease and transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/pre-qualification" className="w-full sm:w-auto bg-[#074504] text-white font-bold py-4 px-10 rounded-full hover:bg-[#053303] transition-all text-sm uppercase tracking-widest">
              Check Pre-Qualification
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-white border-2 border-[#074504]/20 text-[#074504] font-bold py-4 px-10 rounded-full hover:border-[#074504] transition-all text-sm uppercase tracking-widest">
              Request a Call Back
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
