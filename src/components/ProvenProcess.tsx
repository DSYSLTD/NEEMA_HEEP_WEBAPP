import { CheckCircle2, ClipboardCheck, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProvenProcess() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "1. Choose",
      description: "Select the perfect loan for your needs: Business and Growth, Personal and Assets or Quick and Emergency. (2 Minutes browse)",
      color: "text-[#0B6B3A]",
      bg: "bg-[#0B6B3A]/10"
    },
    {
      icon: CheckCircle2,
      title: "2. Apply",
      description: "Submit your ID and MPESA statement at our nearest branch or reach us through 0705 759 365.",
      color: "text-[#F4A300]",
      bg: "bg-[#F4A300]/10"
    },
    {
      icon: Wallet,
      title: "3. Receive",
      description: "Get funds in your M-PESA or Bank account swiftly upon approval. (instant disbursement)",
      color: "text-[#C0991B]",
      bg: "bg-[#599200]/10"
    }
  ];

  return (
    <section className="w-full py-24 px-6 lg:px-12 bg-[#F9FAFB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 justify-center mb-6">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">Our Process</span>
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] leading-[1.1] mb-6 uppercase tracking-tight">
            EASY AS <span className="text-[#C0991B]">1, 2, 3</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">Getting funded shouldn't be a hassle. Experience our streamlined, client-first approach to microfinance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-gray-200 z-0">
             <div className="absolute top-0 left-0 h-full bg-[#599200] w-1/3 animate-[pulse_3s_ease-in-out_infinite]" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-[#074504]/10 border border-[#074504]/20 flex items-center justify-center shadow-md mb-8 group-hover:-translate-y-2 group-hover:bg-[#074504] transition-all duration-300 relative overflow-hidden">
                  <Icon className="w-10 h-10 text-[#074504] group-hover:text-[#C0991B] relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">{step.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed max-w-sm">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          <Link to="/registration" className="inline-flex items-center justify-center gap-2 bg-[#074504] hover:bg-[#053303] text-white font-extrabold py-5 px-10 rounded-full shadow-[0_10px_30px_rgba(0,77,64,0.3)] transition-all hover:-translate-y-1 text-lg group w-full sm:w-auto uppercase tracking-wider">
            Register for Membership <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-[#C0991B] hover:bg-[#a38012] text-[#074504] font-black py-5 px-10 rounded-full transition-all duration-300 w-full sm:w-auto text-lg text-center shadow-lg hover:-translate-y-1 uppercase tracking-wider">
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
