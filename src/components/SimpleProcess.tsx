import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SimpleProcess({ className = '' }: { className?: string }) {
  
  const steps = [
    { 
      num: '1', 
      title: 'Choose', 
      desc: 'Select the perfect loan for your needs: Business and Growth, Personal and Assets or Quick and Emergency.',
      badge: '⏱ 2 Minutes browse'
    },
    { 
      num: '2', 
      title: 'Apply', 
      desc: 'Submit your ID and MPESA statement at our nearest branch or reach us through 0705 759 365.',
      badge: '📍 Branch & Assisted'
    },
    { 
      num: '3', 
      title: 'Receive', 
      desc: 'Get funds in your M-PESA or Bank account promptly upon approval.',
      badge: '💸 instant disbursement'
    }
  ];

  return (
    <div className={`bg-white rounded-[2rem] border border-gray-100 p-6 lg:p-8 ${className}`}>
       <h3 className="text-xl font-bold text-[#074504] mb-1">Cash in Hand, Fast</h3>
       <p className="text-sm font-medium text-gray-500 mb-6">No queues · No hidden fees</p>
       
       <div className="space-y-5">
         {steps.map((step, i) => (
           <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#599200]/10 text-[#C0991B] flex items-center justify-center font-black shrink-0 mt-0.5">
                {step.num}
              </div>
              <div>
                 <h4 className="font-bold text-gray-900 leading-tight">{step.title}</h4>
                 <p className="text-sm text-gray-500 mt-1 mb-2 leading-relaxed">{step.desc}</p>
                 <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold text-[#074504] bg-[#F4F7F6] px-2 py-1 rounded">
                   {step.badge}
                 </span>
              </div>
            </div>
         ))}
       </div>
       <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-3">
         <Link to="/registration" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#599200] text-white rounded-xl font-bold hover:bg-[#4d7d00] transition-all shadow-lg hover:shadow-[#599200]/20">
            Start Your Application
            <CheckCircle2 className="w-4 h-4" />
         </Link>
         <Link to="/request-callback" className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-[#074504] hover:bg-gray-100 border-2 border-[#C0991B] rounded-xl font-bold transition-all">
            Request a Call Back
         </Link>
       </div>
    </div>
  );
}
