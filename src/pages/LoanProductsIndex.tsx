import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LOAN_PRODUCTS } from '../lib/loanData';
import { 
  ArrowRight, 
  Wallet, 
  LineChart, 
  Shield, 
  Sprout, 
  CheckCircle2, 
  Key, 
  Users, 
  Home, 
  TrendingUp, 
  ChevronDown, 
  Calculator,
  Banknote,
  Car,
  GraduationCap,
  PiggyBank,
  Droplets,
  Clock,
  Sun,
  ShieldCheck,
  Coins
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

import CountUp from 'react-countup';
import SimpleProcess from '../components/SimpleProcess';

const CATEGORIES = [
  { id: 'all', title: "All" },
  { id: 'business', title: "Business and Growth", loans: ['nawiri', 'imara'] },
  { id: 'personal', title: "Personal and Assets", loans: ['green-energy', 'dairy', 'wash', 'logbook', 'busara', 'mali', 'housing', 'ipf'] },
  { id: 'emergency', title: "Quick and Emergency", loans: ['dharura', 'boresha'] }
];

export default function LoanProductsIndex() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate network request
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredLoans = activeCategory === 'all' 
    ? Object.keys(LOAN_PRODUCTS)
    : CATEGORIES.find(c => c.id === activeCategory)?.loans || [];

  const getLoanIcon = (id: string) => {
    const iconClass = "w-5 h-5 text-[#074504] group-hover:text-[#C0991B] transition-colors duration-300";
    switch (id) {
      case 'boresha': return <Banknote className={iconClass} />;
      case 'logbook': return <Car className={iconClass} />;
      case 'imara': return <Wallet className={iconClass} />;
      case 'nawiri': return <TrendingUp className={iconClass} />;
      case 'busara': return <GraduationCap className={iconClass} />;
      case 'mali': return <PiggyBank className={iconClass} />;
      case 'wash': return <Droplets className={iconClass} />;
      case 'dairy': return <Sprout className={iconClass} />;
      case 'dharura': return <Clock className={iconClass} />;
      case 'housing': return <Home className={iconClass} />;
      case 'ipf': return <ShieldCheck className={iconClass} />;
      case 'green-energy': return <Sun className={iconClass} />;
      default: return <Coins className={iconClass} />;
    }
  };

  return (
    <main className="flex-grow bg-[#f8faf8]">
      <section className="bg-[#074504] text-white pt-24 pb-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#599200] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">12 LOAN PRODUCTS</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
                FIND THE RIGHT<br/>
                <span className="text-[#C0991B]">LOAN FOR YOU.</span>
              </h1>
              <p className="text-lg text-white/80 max-w-xl mb-12 font-medium">
                From personal loans to business financing, group lending to asset acquisition: Neema HEEP has a product designed for your exact situation.
              </p>
              
              <div className="flex flex-wrap gap-12 mt-8">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-2 hover:scale-110 transition-transform duration-300 origin-left">
                    <CountUp end={5000} formattingFn={(val) => 'KES ' + val.toLocaleString()} duration={2.5}/>
                  </p>
                  <p className="text-xs uppercase tracking-wider text-white/60 font-bold">MINIMUM LOAN</p>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-2 hover:scale-110 transition-transform duration-300 origin-left">
                    Rapid
                  </p>
                  <p className="text-xs uppercase tracking-wider text-white/60 font-bold">APPROVAL GOAL</p>
                </div>
              </div>

              {/* 4 Hero CTAs including Strategic Financial Quiz and Eligibility Calculator */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3.5 mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <Link to="/registration" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-6 py-3.5 rounded-xl font-extrabold shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 text-center uppercase text-xs tracking-wider">
                  Register to Apply <ArrowRight className="w-4 h-4"/>
                </Link>
                <Link
                  to="/checklists"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-2 border-[#C0991B] px-6 py-3.5 rounded-xl font-extrabold shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase text-xs tracking-wider"
                >
                  View Requirements
                </Link>
                <Link to="/pre-qualification" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3.5 rounded-xl font-extrabold shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
                  <Calculator className="w-4 h-4 text-[#C0991B]"/> Calculate Eligibility
                </Link>
                <a href="https://wa.me/254705759365" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-xl font-extrabold shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
                  <WhatsAppIcon className="w-4 h-4 text-white"/> WhatsApp Us
                </a>
              </div>
            </div>
            
            <div className="w-full lg:w-[450px] shrink-0 xl:w-[500px]">
              <SimpleProcess className="shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 tracking-tight">Browse by Category</h2>
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200 pb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-[#074504] text-white border-[#074504] shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Loan Cards */}
        <div className={`flex flex-wrap justify-between items-stretch ${(activeCategory === 'business' || activeCategory === 'emergency') ? 'gap-0' : 'gap-6'} text-left`}>
          {isLoading ? (
            <>
              {[1, 2, 3].map((skeletonId) => {
                const cardWidth = (activeCategory === 'business' || activeCategory === 'emergency')
                  ? 'w-full lg:w-1/3'
                  : 'w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
                return (
                  <div key={skeletonId} className={`bg-white rounded-[2rem] border border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden animate-pulse ${cardWidth} ${(activeCategory === 'business' || activeCategory === 'emergency') ? 'rounded-none first:rounded-l-[2rem] last:rounded-r-[2rem] border-r-0 last:border-r' : ''}`}>
                    <div className="h-64 bg-gray-200" />
                    <div className="p-8 pb-0">
                      <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4" />
                      <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-8" />
                      <div className="space-y-3 mb-8">
                        <div className="h-4 bg-gray-200 rounded-md w-full" />
                        <div className="h-4 bg-gray-200 rounded-md w-5/6" />
                        <div className="h-4 bg-gray-200 rounded-md w-4/6" />
                      </div>
                    </div>
                    <div className="p-8 pt-4">
                      <div className="h-12 bg-gray-200 rounded-full w-full mb-3" />
                      <div className="h-14 bg-gray-200 rounded-full w-full" />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {filteredLoans.map((loanId) => {
            const loan = LOAN_PRODUCTS[loanId];
            if (!loan) return null;
            
            const categoryObj = CATEGORIES.find(c => c.loans?.includes(loanId));
            
            // Use standard grid sizing for all cards except when specified otherwise
            // On desktop, "normal" is 1/3rd width.
            const cardWidth = (activeCategory === 'business' || activeCategory === 'emergency')
              ? 'w-full lg:w-1/3'
              : 'w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';

            return (
              <div 
                key={loanId} 
                className={`bg-white border border-gray-200 shadow-sm flex flex-col justify-between group overflow-hidden ${cardWidth} ${
                  (activeCategory === 'business' || activeCategory === 'emergency')
                    ? 'rounded-none first:rounded-l-[2rem] last:rounded-r-[2rem] border-r-0 last:border-r' 
                    : 'rounded-[2rem]'
                }`}
              >
                <div>
                  {loan.image && (
                    <div className="relative h-64 bg-[#074504]/5 overflow-hidden group/image">
                      <img 
                        src={encodeURI(loan.image)} 
                        alt={loan.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback && loan.driveFallback) {
                            target.dataset.triedFallback = 'true';
                            target.src = loan.driveFallback;
                          } else if (!target.dataset.triedUnsplash) {
                            target.dataset.triedUnsplash = 'true';
                            target.src = `https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&text=${encodeURIComponent(loan.name)}`;
                          }
                        }}
                      />
                      {/* Deep Green Overlay */}
                      <div className="absolute inset-0 bg-[#074504]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[3px] z-20">
                        <Link 
                          to={`/loans/${loanId}`}
                          className="bg-white text-[#074504] px-8 py-3 rounded-full font-bold text-sm transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 shadow-2xl tracking-[0.2em] uppercase border-2 border-[#C0991B]/20 hover:bg-[#C0991B] hover:text-white hover:border-white"
                        >
                          View details
                        </Link>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                          {categoryObj?.title.split(' ')[0] || 'LOAN'}
                        </div>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border border-[#074504]/20 shadow-md group-hover:bg-[#074504] group-hover:border-[#074504] transition-all duration-300">
                          {getLoanIcon(loanId)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8 pb-0">
                    {!loan.image && (
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#074504]/10 border border-[#074504]/20 shadow-sm group-hover:bg-[#074504] group-hover:border-[#074504] transition-all duration-300">
                          {getLoanIcon(loanId)}
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#F9FAFB] text-[#C0991B] border border-gray-100">
                          {categoryObj?.title.split(' ')[0] || 'LOAN'}
                        </div>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-black mb-1">{loan.name}</h3>
                    <p className="text-sm font-bold mb-4 text-[#C0991B]">{loan.tagline}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {loan.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="text-sm font-medium text-gray-600 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#C0991B] shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="p-8 pt-4">
                  {loan.associatedProgram && (
                    <Link 
                      to={loan.associatedProgram.programPath}
                      className="w-full flex items-center justify-between gap-2 py-2.5 px-4 mb-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-[#074504] font-black text-xs uppercase tracking-tight transition-all group/prog"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="truncate">{loan.associatedProgram.name}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#599200] group-hover/prog:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  )}

                  <Link 
                    to={`/loans/${loanId}`}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#C0991B] border-2 border-[#599200] rounded-full hover:bg-[#599200] hover:text-white transition-colors mb-3"
                  >
                    View Details and Eligibility
                  </Link>

                  <Link 
                    to={`/registration`}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-white bg-[#074504] transition-transform hover:scale-105 shadow-md hover:bg-[#053303]"
                  >
                    Register to Apply <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
          </>
        )}

          {/* CTA Card for Business tab gap */}
          {activeCategory === 'business' && (
            <div className="bg-[#074504] rounded-[2rem] rounded-l-none border border-[#074504] p-8 shadow-xl flex flex-col justify-center items-center group text-center text-white relative overflow-hidden w-full lg:w-1/3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#599200] rounded-full blur-[60px] opacity-20 pointer-events-none" />
              <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tighter">Scale Your Business <span className="text-[#C0991B]">Faster</span></h3>
              <p className="text-white/80 mb-8 font-medium text-sm leading-relaxed">
                Looking for larger capital injections? Our experts can help you structure the perfect growth strategy for your enterprise.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <Link to="/request-callback" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-6 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-lg">
                  Consult an Expert <ArrowRight className="w-4 h-4"/>
                </Link>
                <a href="https://wa.me/254705759365" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-6 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2">
                  <WhatsAppIcon className="w-4 h-4"/> Chat with Us
                </a>
              </div>
            </div>
          )}

          {/* CTA Card for "All" tab - expanded full width */}
          {activeCategory === 'all' && (
            <div className="col-span-full w-full bg-[#074504] rounded-[2.5rem] border border-[#074504] p-8 md:p-12 shadow-xl flex flex-col lg:flex-row justify-between items-center group text-left text-white relative overflow-hidden gap-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#599200] rounded-full blur-[100px] opacity-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[100px] opacity-10 pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <span className="bg-[#C0991B] text-[#074504] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-3">Custom Financing</span>
                <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tighter">Don't see what you <span className="text-[#C0991B]">need?</span></h3>
                <p className="text-white/80 mt-2 font-medium text-sm leading-relaxed">
                  We offer flexible, custom microfinance and credit options tailored specifically to your unique business or personal requirements. Talk with our dedicated credit specialists today.
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <Link to="/request-callback" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-8 py-4 rounded-full font-bold shadow-[0_4px_14px_rgba(212,175,55,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2 text-xs uppercase tracking-widest min-w-[200px]">
                  Talk to an Expert <ArrowRight className="w-4 h-4"/>
                </Link>
                <a href="https://wa.me/254705759365" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest min-w-[200px]">
                  <WhatsAppIcon className="w-4 h-4"/> Chat on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* CTA Section for Personal Tab (Grid Filler) */}
          {activeCategory === 'personal' && (
            <div className="bg-[#074504] rounded-[2rem] border border-[#074504] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between items-center group text-left text-white relative overflow-hidden w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#599200] rounded-full blur-[60px] opacity-20 pointer-events-none" />
              <div className="relative z-10 w-full">
                <h3 className="text-xl font-extrabold mb-4 uppercase tracking-tighter">Invest in <span className="text-[#C0991B]">Assets</span> Today</h3>
                <p className="text-white/80 mb-6 font-medium text-sm leading-tight">
                  Our individual asset financing is designed to help you build wealth sustainably.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <Link to="/registration" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-6 py-3.5 rounded-full font-bold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-xs uppercase tracking-widest w-full">
                    Get Started <ArrowRight className="w-4 h-4"/>
                  </Link>
                  <Link to="/request-callback" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest w-full">
                    Request a Call Back
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section for Emergency Tab (Slot 3 filler matching Business tab format) */}
          {activeCategory === 'emergency' && (
            <div className="bg-[#074504] rounded-[2rem] rounded-l-none border border-[#074504] p-8 shadow-xl flex flex-col justify-center items-center group text-center text-white relative overflow-hidden w-full lg:w-1/3">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#599200] rounded-full blur-[60px] opacity-20 pointer-events-none" />
              <div className="relative z-10 w-full">
                <span className="bg-[#C0991B] text-[#074504] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-3">
                  ⚡ Express Disbursement
                </span>
                <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-tighter">Need <span className="text-[#C0991B]">Immediate</span> Cash?</h3>
                <p className="text-white/80 mb-6 font-medium text-sm leading-relaxed">
                  Urgent school fees, medical shocks, or emergency stock top-ups? Access M-PESA interventions in hours.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <Link to="/registration" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-6 py-3.5 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 text-xs uppercase tracking-widest w-full shadow-lg">
                    Register to Apply <ArrowRight className="w-4 h-4"/>
                  </Link>
                  <a href="https://wa.me/254705759365" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md text-xs uppercase tracking-widest w-full">
                    <WhatsAppIcon className="w-4 h-4 text-white"/> Instant WhatsApp Help
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="bg-white py-20 px-6 lg:px-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block mb-4">Check Your Eligibility</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#074504] leading-tight mb-6">
              NOT SURE WHICH LOAN FITS YOUR <span className="text-[#C0991B]">UNIQUE GOALS?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 font-medium leading-relaxed">
              Answer a few questions and our smart pre-qualification system will recommend the best financial products for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/pre-qualification" className="bg-[#074504] text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#053303] transition-all shadow-xl text-center">
                Get Pre-Qualified Now
              </Link>
              <Link to="/contact" className="bg-white text-[#074504] border-2 border-[#074504]/20 px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:border-[#074504] transition-all text-center">
                Contact Specialist
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-96 bg-[#F9FAFB] rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#074504] mb-6">Expert Guidance</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                  <LineChart className="w-5 h-5 text-[#074504]" />
                </div>
                <div>
                  <p className="font-bold text-[#074504] text-sm">Financial Planning</p>
                  <p className="text-xs text-gray-500">Free advisory on loan utilization.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF9C4] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#827717]" />
                </div>
                <div>
                  <p className="font-bold text-[#074504] text-sm">Clear Terms</p>
                  <p className="text-xs text-gray-500">No hidden charges or complex fine print.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5 text-[#1565C0]" />
                </div>
                <div>
                  <p className="font-bold text-[#074504] text-sm">Growth Pathways</p>
                  <p className="text-xs text-gray-500">Structure your repayment for success.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#074504] text-white py-20 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#599200] rounded-full blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#599200] rounded-full blur-[100px] opacity-10 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">LIMITED OFFER : FAST APPROVAL TODAY</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-none uppercase">
            READY TO APPLY?<br/>
            <span className="text-[#C0991B]">GET FUNDED TODAY.</span>
          </h2>
          <p className="text-lg text-white/80 mb-10 font-medium">
            Walk into any Neema HEEP branch or contact our loan officers. We will guide you through every step.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full max-w-lg mx-auto">
            <Link to="/registration" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg transition-all hover:scale-105 w-full sm:w-1/2 flex items-center justify-center gap-2">
              Register to Apply <ArrowRight className="w-4 h-4"/>
            </Link>
            <a href="https://wa.me/254705759365" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all hover:scale-105 w-full sm:w-1/2 uppercase text-xs tracking-widest flex items-center justify-center gap-2">
              <WhatsAppIcon className="w-5 h-5 text-white"/> WhatsApp Us
            </a>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/60 font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> AMFI Kenya Member</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Data Protected</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C0991B]" /> Fast Approval</span>
          </div>
        </div>
      </section>
    </main>
  );
}

