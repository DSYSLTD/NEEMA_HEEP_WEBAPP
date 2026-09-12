import { BellRing } from "lucide-react";
import { Link } from "react-router-dom";

export default function CurrentRates() {
  return (
    <main className="flex-grow bg-[#f8faf8] py-24 px-6 lg:px-12 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-[#F4F7F6] p-12 rounded-[2rem] shadow-lg max-w-2xl w-full text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold text-[#074504] mb-6">View Today's Rates</h1>
        <p className="text-gray-600 mb-10 font-medium">Stay ahead of the market. Our interest rates are highly competitive and adjust dynamically.</p>
        
        {/* Alert Me Popup Placeholder */}
        <div className="bg-white border border-[#599200]/30 p-8 rounded-2xl mb-8">
           <BellRing className="w-12 h-12 text-[#C0991B] mx-auto mb-4" />
           <h3 className="text-xl font-bold text-[#074504] mb-2">Market Timing Alert</h3>
           <p className="text-sm text-gray-500 mb-6">Get instantly notified when our business loan rates drop to your target range.</p>
           
           <input type="email" placeholder="Enter your email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#599200]" />
           <button className="w-full bg-[#074504] text-white font-bold py-3 rounded-xl hover:bg-[#003830] transition-colors">Alert Me</button>
        </div>
        
        <Link to="/" className="text-[#074504] font-bold hover:underline">Return Home</Link>
      </div>
    </main>
  );
}
