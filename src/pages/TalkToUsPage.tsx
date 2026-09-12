import React from 'react';
import { PhoneCall, Clock } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { motion } from 'motion/react';
import SmartLeadForm from '../components/SmartLeadForm';

export default function TalkToUsPage() {
  const whatsappUrl = `https://wa.me/254705759365?text=${encodeURIComponent("Hi! I'm looking to consult with a loan specialist regarding my options.")}`;

  return (
    <main className="flex-grow pt-20 pb-20 bg-[#f8faf8] flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Value Prop */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 bg-[#F4A300]/10 text-[#0B6B3A] rounded-2xl flex items-center justify-center mb-6">
            <PhoneCall className="w-8 h-8" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#074504] leading-tight">
            Talk to a <span className="text-[#F4A300]">Loan Specialist</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Navigating financial options shouldn't be confusing. Let our experts provide clarity tailored to your unique goals.
          </p>
          
          <div className="pt-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B6B3A]/5 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[#0B6B3A]" />
              </div>
              <div>
                <h4 className="font-bold text-[#074504] text-lg">Fast Callbacks</h4>
                <p className="text-gray-500 text-sm">We'll call you back within 15 minutes during business hours.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              </div>
              <div>
                <h4 className="font-bold text-[#074504] text-lg">Direct WhatsApp Access</h4>
                <p className="text-gray-500 text-sm mb-3">Prefer texting? Connect directly with our team.</p>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" /> Message Specialist
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden"
        >
          <SmartLeadForm 
            type="Callback"
            title="Request a Consultation"
            description="Our experts will guide you through the best loan options for your needs."
            ctaText="Schedule Callback"
            fields={[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
              { name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '07XX...', required: true },
              { name: 'purpose', label: 'Preferred Time', type: 'text', placeholder: 'e.g. Afternoon' }
            ]}
          />
        </motion.div>
      </div>
    </main>
  );
}
