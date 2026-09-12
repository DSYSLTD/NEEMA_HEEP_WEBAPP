import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ChevronDown, ArrowRight, MessageSquare, PhoneCall, 
  CheckCircle2, Send, Flame, Briefcase, FileText, 
  CreditCard, ShieldCheck, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQ_DATA = [
  {
    id: "popular",
    name: "Most Popular Questions",
    icon: <Flame className="w-5 h-5" />,
    faqs: [
      {
        q: "How fast can I get a loan from NEEMA HEEP?",
        a: "From our experience serving clients across Kenya, most qualified applicants receive approval within hours, and funds are typically disbursed the same day once documentation is complete.",
        bullets: ["Fast internal review process", "Dedicated loan officers", "Real-time communication"],
        cta: { text: "If speed matters, start your application now and get guided step-by-step.", isLink: true, to: "/registration", actionLabel: "Register Now" }
      },
      {
        q: "What do I need to qualify for a loan?",
        a: "We keep requirements practical and inclusive: Our approach focuses on your ability to repay, not just paperwork.",
        bullets: ["National ID (for identity verification)", "Active mobile number", "Proof of income (business or employment)", "Collateral (for secured loans like logbook loans)"],
        cta: { text: "Check your eligibility in minutes: no commitment required.", isLink: true, to: "/registration", actionLabel: "Check Eligibility" }
      },
      {
        q: "Can I get a loan without a payslip?",
        a: "Yes. Many of our clients are business owners or self-employed. We assess:",
        bullets: ["Daily/weekly business cash flow", "Transaction history", "Business stability"],
        cta: { text: "If you run a biashara, you're already eligible to apply.", isLink: true, to: "/registration", actionLabel: "Register Now" }
      },
      {
        q: "Is my car safe with a logbook loan?",
        a: "Yes, this is one of the most common concerns we address.",
        bullets: ["You continue using your car normally", "Ownership remains yours", "Repossession only happens in extreme default cases (and after engagement)"],
        cta: { text: "We prioritize responsible lending, not asset seizure.", isLink: true, to: "/loans", actionLabel: "Learn More" }
      },
      {
        q: "How much can I borrow?",
        a: "Loan amounts are personalized based on:",
        bullets: ["Your repayment capacity", "Loan product selected", "Value of collateral (if applicable)"],
        cta: { text: "Apply to get a realistic offer tailored to your situation.", isLink: true, to: "/registration", actionLabel: "Register Now" }
      },
      {
        q: "How quickly will I know if I'm approved?",
        a: "Most applicants receive feedback within the same day. Our team communicates clearly at every step."
      },
      {
        q: "Do I need to visit your office physically?",
        a: "In many cases, the process can be started and completed remotely, depending on the loan type."
      },
      {
        q: "Are there hidden charges?",
        a: "No. We operate with full transparency: all costs are explained before you commit."
      },
      {
        q: "Can I apply more than once?",
        a: "Yes. Many clients return for repeat financing after successful repayment."
      },
      {
        q: "Why should I choose NEEMA HEEP over other lenders?",
        a: "We aim to build long-term financial relationships, not one-time transactions.",
        bullets: ["Fast processing", "Flexible eligibility", "Transparent terms", "Customer-first approach"],
        cta: { text: "Join thousands of satisfied clients.", isLink: true, to: "/registration", actionLabel: "Get Started" }
      }
    ]
  },
  {
    id: "products",
    name: "Loan Products",
    icon: <Briefcase className="w-5 h-5" />,
    faqs: [
      {
        q: "What types of loans does NEEMA HEEP offer?",
        a: "We offer tailored financial solutions including:",
        bullets: ["Logbook Loans", "Business and Growth Loans (Nawiri Loan)", "Personal and Asset Financing", "Quick and Emergency Loans", "Insurance Premium Financing (IPF)"]
      },
      {
        q: "Which loan is best for my situation?",
        a: "It depends on your need:",
        bullets: ["Urgent cash → Quick Loan", "Business expansion → Nawiri Loan", "Large financing → Logbook Loan"],
        cta: { text: "Our advisors can guide you to the best option.", isAction: true, actionType: "advisor", actionLabel: "Talk to an Advisor" }
      },
      {
        q: "What is a logbook loan?",
        a: "A secured loan using your vehicle as collateral while you still use it."
      },
      {
        q: "What is the Nawiri Loan?",
        a: "A structured facility designed to help businesses scale operations and increase revenue."
      },
      {
        q: "What is IPF (Insurance Premium Financing)?",
        a: "A solution that allows you to spread insurance payments into manageable installments."
      },
      {
        q: "Do you offer loans for startups?",
        a: "Yes, provided there is clear income potential or supporting documentation."
      },
      {
        q: "Can I refinance an existing loan?",
        a: "Yes, we offer top-ups and refinancing options for eligible clients."
      },
      {
        q: "What is the minimum and maximum loan amount?",
        a: "Varies depending on product and qualification: assessed individually."
      },
      {
        q: "Are your loans Sharia-compliant?",
        a: "Currently, our products follow conventional financing models, but we are evolving based on market needs."
      },
      {
        q: "Can I take multiple loans at once?",
        a: "In some cases, yes, subject to your repayment capacity."
      }
    ]
  },
  {
    id: "eligibility",
    name: "Application and Eligibility",
    icon: <FileText className="w-5 h-5" />,
    faqs: [
      {
        q: "How do I apply for a loan?",
        a: "Applying is simple and clear:",
        bullets: ["Fill the application form", "Submit documents", "Get reviewed", "Receive funds"]
      },
      {
        q: "Do you check CRB?",
        a: "Yes, but decisions are based on a balanced review, not CRB alone."
      },
      {
        q: "Can self-employed individuals apply?",
        a: "Yes, this is a large part of our customer base."
      },
      {
        q: "What documents are required?",
        a: "Depends on the loan but typically includes ID and proof of income."
      },
      {
        q: "How long does the process take?",
        a: "Usually same-day to shortly after application."
      },
      {
        q: "What if I don't have all documents?",
        a: "Our team will guide you on alternative verification options."
      },
      {
        q: "Is there an age limit?",
        a: "Applicants must be 18 years and above."
      },
      {
        q: "Can foreigners apply?",
        a: "Yes, subject to legal documentation and residency status."
      },
      {
        q: "Will applying affect my credit score?",
        a: "Only formal credit checks may reflect, but we keep this minimal and responsible."
      },
      {
        q: "Can I cancel my application?",
        a: "Yes, before disbursement with no penalty."
      }
    ]
  },
  {
    id: "repayment",
    name: "Repayment and Interest",
    icon: <CreditCard className="w-5 h-5" />,
    faqs: [
      {
        q: "What are your interest rates?",
        a: "Rates vary based on risk and product, but we ensure:",
        bullets: ["Clear breakdowns", "No hidden fees"]
      },
      {
        q: "How do I repay my loan?",
        a: "You can repay using convenient methods:",
        bullets: ["M-Pesa", "Bank transfer", "Direct payment"]
      },
      {
        q: "Can I repay early?",
        a: "Yes, and in many cases, this reduces total cost."
      },
      {
        q: "What happens if I miss a payment?",
        a: "We engage you early to find solutions before penalties escalate."
      },
      {
        q: "Are there penalties?",
        a: "Yes, but clearly disclosed upfront."
      },
      {
        q: "Can I change my repayment plan?",
        a: "In certain cases, restructuring is possible."
      },
      {
        q: "Do you send reminders?",
        a: "Yes, via SMS or calls."
      },
      {
        q: "Is there a grace period?",
        a: "Depends on loan type: explained during onboarding."
      },
      {
        q: "Can someone else repay on my behalf?",
        a: "Yes, as long as correct details are used."
      },
      {
        q: "What happens after full repayment?",
        a: "Your account is updated instantly:",
        bullets: ["Loan closure confirmation", "Security (e.g., logbook) fully released"]
      }
    ]
  },
  {
    id: "security",
    name: "Security and Trust",
    icon: <ShieldCheck className="w-5 h-5" />,
    faqs: [
      {
        q: "Is NEEMA HEEP legitimate?",
        a: "Yes, we operate with professional, transparent financial practices."
      },
      {
        q: "Is my data safe?",
        a: "We use secure systems and strict confidentiality protocols."
      },
      {
        q: "Do you share my information?",
        a: "Only when required legally or for processing services."
      },
      {
        q: "How do you protect clients from fraud?",
        a: "We implement robust security measures:",
        bullets: ["Verified communication channels", "Secure onboarding"]
      },
      {
        q: "Will you take my asset unfairly?",
        a: "No, repossession is always a last resort after engagement."
      },
      {
        q: "Do you have physical offices?",
        a: "Yes, plus digital support channels."
      },
      {
        q: "Are your contracts transparent?",
        a: "Yes, everything is explained before signing."
      },
      {
        q: "Can I get a copy of my agreement?",
        a: "Always, digitally or physically."
      },
      {
        q: "How experienced is your team?",
        a: "Our team combines financial expertise with real market experience."
      },
      {
        q: "Do you offer financial advice?",
        a: "Yes, we guide clients toward responsible borrowing decisions."
      }
    ]
  },
  {
    id: "support",
    name: "Support and Help",
    icon: <Headphones className="w-5 h-5" />,
    faqs: [
      {
        q: "How can I contact NEEMA HEEP?",
        a: "We are available across multiple channels:",
        bullets: ["Phone", "Email", "Website", "WhatsApp"]
      },
      {
        q: "Do you offer WhatsApp support?",
        a: "Yes, fast and convenient."
      },
      {
        q: "What are your working hours?",
        a: "Standard business hours + extended support for urgent cases."
      },
      {
        q: "Can I speak to a loan officer?",
        a: "Yes, personalized assistance is always available."
      },
      {
        q: "Do you offer in-person consultations?",
        a: "Yes, on request."
      },
      {
        q: "How fast do you respond?",
        a: "Usually within minutes during working hours."
      },
      {
        q: "Can I request a callback?",
        a: "Yes, via website form.",
        cta: { text: "Speak to us today.", isAction: true, actionType: "advisor", actionLabel: "Request a Call Back" }
      },
      {
        q: "What if I have a complaint?",
        a: "We have a structured resolution process to handle concerns quickly."
      },
      {
        q: "Do you educate customers?",
        a: "Yes, we believe in financial literacy and empowerment."
      },
      {
        q: "What if I don't find my answer here?",
        a: "Reach out: we'll respond personally and improve our FAQ.",
        cta: { text: "We're here to help.", isLink: true, to: "/contact", actionLabel: "Contact Us" }
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('popular');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NEEMA HEEP - Frequently Asked Questions (FAQs)";
  }, []);

  // Filter FAQs based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    
    const query = searchQuery.toLowerCase();
    const results = FAQ_DATA.map(category => {
      const filteredFaqs = category.faqs.filter(
        faq => faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query)
      );
      return { ...category, faqs: filteredFaqs };
    }).filter(category => category.faqs.length > 0);

    return results;
  }, [searchQuery]);

  const toggleFaq = (idx: string) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleFeedback = (id: string, isHelpful: boolean) => {
    // In a real app, send this to analytics backend
    setFeedbackGiven(prev => ({ ...prev, [id]: true }));
  };

  return (
    <main className="flex-grow bg-[#f8faf8] min-h-screen pb-32">
      {/* Intelligent Search Header */}
      <section className="bg-[#074504] text-white pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#599200] opacity-30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C0991B] opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 justify-center mb-6">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">NEEMA HEEP FAQs</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight uppercase">
            HOW CAN WE <span className="text-[#C0991B]">HELP YOU?</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Expert, trusted, and customer-focused guide to unlocking financial opportunities responsibly. Find clear and honest answers below.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full bg-white text-gray-900 rounded-full py-5 pl-16 pr-8 text-lg font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#C0991B]/50 transition-all border-none"
              placeholder="e.g., How do I qualify for a logbook loan?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-sm font-medium text-white/80">
                Searching for: <span className="text-white">"{searchQuery}"</span>
              </div>
            )}
          </div>
          
          {/* Quick Suggestions */}
          {!searchQuery && (
             <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
               <span className="text-sm font-bold text-white/70">Popular:</span>
               <button onClick={() => setSearchQuery('logbook loan')} className="bg-[#C0991B]/20 hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/40 text-sm font-bold rounded-full px-4 py-1.5 transition-all shadow-xs cursor-pointer">Logbook Loan</button>
               <button onClick={() => setSearchQuery('interest')} className="bg-[#C0991B]/20 hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/40 text-sm font-bold rounded-full px-4 py-1.5 transition-all shadow-xs cursor-pointer">Interest Rates</button>
               <button onClick={() => setSearchQuery('requirements')} className="bg-[#C0991B]/20 hover:bg-[#C0991B] text-white hover:text-[#074504] border border-[#C0991B]/40 text-sm font-bold rounded-full px-4 py-1.5 transition-all shadow-xs cursor-pointer">Requirements</button>
             </div>
          )}
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="max-w-6xl mx-auto px-4 py-12 lg:py-20 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Sidebar Categories (Hidden when searching) */}
        {!searchQuery && (
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-[180px] bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
              <h3 className="font-bold text-[#074504] mb-4 px-3 text-sm uppercase tracking-wider">Categories</h3>
              {FAQ_DATA.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const element = document.getElementById(`category-${cat.id}`);
                    if (element) {
                      const yOffset = -150; 
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({top: y, behavior: 'smooth'});
                    }
                  }}
                  className={`w-full text-left px-5 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-4 group cursor-pointer ${
                    activeCategory === cat.id 
                    ? 'bg-[#074504] text-[#C0991B] shadow-lg shadow-[#074504]/20 scale-[1.02]' 
                    : 'text-gray-700 hover:bg-[#074504] hover:text-white border border-transparent hover:border-[#074504]'
                  }`}
                >
                  <span className={`p-2 rounded-lg transition-colors ${activeCategory === cat.id ? 'bg-white/10 text-[#C0991B]' : 'bg-gray-100 text-gray-500 group-hover:bg-[#C0991B] group-hover:text-[#074504]'}`}>
                    {cat.icon}
                  </span>
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* FAQs */}
        <div className="flex-1 w-full max-w-3xl">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-[#074504]/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C0991B] ring-8 ring-[#074504]/[0.02]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No exact matches found</h3>
              <p className="text-gray-600 font-medium mb-8">
                Didn't find your answer? Let us help you personally. Our support team is ready to guide you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/request-callback"
                  className="bg-[#074504] hover:bg-[#599200] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5"/> Request a Call Back
                </Link>
                <Link 
                  to="/contact"
                  className="bg-[#C0991B] hover:bg-[#074504] text-[#074504] hover:text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5"/> Contact Support
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredData.map(category => (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-[150px]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#074504]/5 text-[#C0991B] flex items-center justify-center border border-[#074504]/10">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-[#074504]">
                      {category.name}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {category.faqs.map((faq, i) => {
                      const faqId = `${category.id}-${i}`;
                      const isOpen = openFaq === faqId;
                      
                      return (
                        <div 
                          key={faqId} 
                          className={`bg-white border rounded-[1.5rem] overflow-hidden transition-all duration-300 ${
                            isOpen ? 'border-[#C0991B] shadow-[0_10px_30px_rgba(192,153,27,0.12)]' : 'border-gray-200 hover:border-[#074504]/50'
                          }`}
                        >
                          <button 
                            className="w-full px-6 py-5 text-left flex items-start sm:items-center justify-between font-bold text-gray-900 gap-4 cursor-pointer"
                            onClick={() => toggleFaq(faqId)}
                          >
                            <span className="text-lg pr-4">{faq.q}</span>
                            <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-all duration-300 mt-1 sm:mt-0 ${
                              isOpen ? 'bg-[#074504] border-[#074504] text-[#C0991B] rotate-180 shadow-xs' : 'bg-gray-50 border-gray-200 text-[#074504] hover:bg-[#074504] hover:text-white hover:border-[#074504]'
                            }`}>
                              <ChevronDown className="w-4 h-4" />
                            </span>
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 pt-2 border-t border-gray-50 leading-relaxed">
                                  <p className="text-gray-700 font-medium mb-4">{faq.a}</p>
                                  
                                  {faq.bullets && (
                                    <ul className="mb-6 space-y-3">
                                      {faq.bullets.map((bullet, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600 font-medium">
                                          <CheckCircle2 className="w-5 h-5 text-[#599200] shrink-0 mt-0.5" />
                                          {bullet}
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {faq.cta && (
                                    <div className="bg-[#074504]/5 p-4 rounded-xl mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#074504]/10">
                                      <p className="text-sm font-bold text-[#074504] flex items-center gap-2">
                                        {faq.cta.text}
                                      </p>
                                      {(faq.cta as any).isLink && (faq.cta as any).to ? (
                                        <Link 
                                          to={(faq.cta as any).to}
                                          className="bg-[#074504] hover:bg-[#599200] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap shrink-0 shadow-sm hover:shadow-md cursor-pointer"
                                        >
                                          {faq.cta.actionLabel}
                                        </Link>
                                      ) : (faq.cta as any).isAction ? (
                                        <button 
                                          onClick={(faq.cta as any).actionType === 'advisor' ? () => navigate('/request-callback') : undefined}
                                          className="bg-[#C0991B] hover:bg-[#074504] text-[#074504] hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap shrink-0 shadow-sm hover:shadow-md cursor-pointer"
                                        >
                                          {faq.cta.actionLabel}
                                        </button>
                                      ) : null}
                                    </div>
                                  )}

                                  {/* Feedback Loop */}
                                  <div className="mt-8 pt-4 flex items-center justify-end gap-3 text-sm font-medium text-gray-500">
                                    {feedbackGiven[faqId] ? (
                                      <span className="text-[#599200] flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4"/> Thanks for your feedback!</span>
                                    ) : (
                                      <>
                                        <span>Was this helpful?</span>
                                        <button onClick={() => handleFeedback(faqId, true)} className="hover:bg-[#074504] hover:text-[#C0991B] text-[#074504] bg-[#074504]/10 px-3 py-1 rounded-full transition-all font-bold cursor-pointer">Yes</button>
                                        <button onClick={() => handleFeedback(faqId, false)} className="hover:bg-[#074504] hover:text-white text-gray-600 bg-gray-100 px-3 py-1 rounded-full transition-all font-bold cursor-pointer">No</button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Smart Fallback and Lead Capture Engine */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#599200]/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 p-10 lg:p-14 text-center">
            <h2 className="text-3xl font-extrabold text-[#074504] mb-4">Still have questions?</h2>
            <p className="text-gray-600 font-medium mb-10 max-w-lg mx-auto">
              If you didn't find the answer you were looking for, our team is standing by to help you personally.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              <Link to="/request-callback" className="bg-[#F4F7F6] hover:bg-[#074504] p-8 rounded-3xl transition-all duration-300 border border-[#eef2f0] hover:border-[#074504] shadow-sm hover:shadow-xl hover:shadow-[#074504]/20 hover:-translate-y-1 group text-center flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-white group-hover:bg-[#C0991B] rounded-2xl flex items-center justify-center shadow-sm mb-6 text-[#074504] group-hover:text-[#074504] group-hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <span className="font-extrabold text-gray-900 group-hover:text-white block mb-2 text-lg">Request a Call Back</span>
                <span className="text-sm text-gray-500 group-hover:text-white/80 font-medium">We'll call you right back</span>
              </Link>
              
              <Link to="/contact" className="bg-[#F4F7F6] hover:bg-[#074504] p-8 rounded-3xl transition-all duration-300 border border-[#eef2f0] hover:border-[#074504] shadow-sm hover:shadow-xl hover:shadow-[#074504]/20 hover:-translate-y-1 group text-center flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-white group-hover:bg-[#599200] rounded-2xl flex items-center justify-center shadow-sm mb-6 text-[#599200] group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:-rotate-3">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <span className="font-extrabold text-gray-900 group-hover:text-white block mb-2 text-lg">WhatsApp Chat</span>
                <span className="text-sm text-gray-500 group-hover:text-white/80 font-medium">Instant messaging support</span>
              </Link>
              
              <Link to="/contact" className="bg-[#F4F7F6] hover:bg-[#074504] p-8 rounded-3xl transition-all duration-300 border border-[#eef2f0] hover:border-[#074504] shadow-sm hover:shadow-xl hover:shadow-[#074504]/20 hover:-translate-y-1 group text-center flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-white group-hover:bg-[#C0991B] rounded-2xl flex items-center justify-center shadow-sm mb-6 text-[#074504] group-hover:text-[#074504] group-hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                  <Send className="w-7 h-7" />
                </div>
                <span className="font-extrabold text-gray-900 group-hover:text-white block mb-2 text-lg">Send a Message</span>
                <span className="text-sm text-gray-500 group-hover:text-white/80 font-medium">Email our support team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
