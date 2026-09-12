import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../components/VerificationModal';

export default function NewsletterSubscribe() {
  const { submitLead } = useLeads();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Read email from URL query if it exists (e.g. redirected from footer)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please provide your email address.');
      return;
    }

    if (!consent) {
      setError('You must consent to data processing under Neema HEEP terms to subscribe.');
      return;
    }

    // Trigger Verification Modal
    setIsVerifying(true);
  };

  const handleVerifiedSubmit = async () => {
    setIsVerifying(false);
    try {
      await submitLead({
        type: 'Newsletter',
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        consentGiven: true,
        signupSource: 'Newsletter Subscribe Page',
        details: {
          subscribedToNewsletter: true,
          phoneEntered: !!formData.phone
        }
      });
      navigate(`/thank-you?verified=true&email=${encodeURIComponent(formData.email)}&type=newsletter`);
    } catch (err) {
      console.error(err);
      setError('An error occurred during submission. Please try again.');
    }
  };

  return (
    <main className="flex-grow pt-24 pb-24 bg-[#f8faf8] flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Value Prop Columns */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 lg:pr-8"
        >
          <span className="bg-[#074504]/10 text-[#074504] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full inline-block">
            Mailing List Integrity
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-[#074504] leading-tight uppercase tracking-tight">
            Stay Primed & <span className="text-[#C0991B]">Informed</span>
          </h1>
          <p className="text-gray-600 font-semibold text-base leading-relaxed">
            Subscribe to the official Neema HEEP quarterly newsletter to receive real-time program audits, scholarship enrollments, community health stories, and impact feedback.
          </p>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#C0991B]/10 text-[#074504]">
                <Shield className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h4 className="font-bold text-[#074504] text-sm uppercase tracking-tight">Certified Safe List</h4>
                <p className="text-xs text-gray-500 font-semibold">Every entry undergoes double-verification to eliminate bots and ensure clean delivery pipelines.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#074504]/10 text-[#C0991B]">
                <CheckCircle className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h4 className="font-bold text-[#074504] text-sm uppercase tracking-tight font-black">Spam-Free Delivery</h4>
                <p className="text-xs text-gray-500 font-semibold">We respect your time. Receive only certified high-value updates, program briefs, and annual transparency metrics.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#074504]/5 rounded-full blur-[80px]" />
          
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tight">Mailing Registration</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium z-10 relative">Consent-driven validation to receive updates.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-4 rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Patrick Munene"
                  className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#074504] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#074504] transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 pl-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. email@neemaheep.com"
                  className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#074504] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#074504] transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 pl-1 flex items-center justify-between">
                  <span>Phone Number <span className="font-normal text-gray-400 font-sans lowercase">(optional)</span></span>
                  {formData.phone && <span className="text-[9px] text-[#C0991B] font-bold tracking-widest">SMART SMS OTP VALIDATION ENFORCED</span>}
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0712345678"
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#074504] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#074504] transition-all font-semibold"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 pl-1 font-medium leading-relaxed">
                  Entering your phone enables WhatsApp and SMS program notices. A 6-digit SMS code gets dispatched instantly upon click.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 accent-[#074504] w-4 h-4 rounded border-gray-300 cursor-pointer" 
                />
                <span className="text-[10px] text-gray-500 leading-normal uppercase font-black tracking-wider group-hover:text-gray-700 transition-colors">
                  I explicitly consent to signing up for communication updates under the <a href="/privacy-policy" target="_blank" className="underline text-[#074504]">Privacy and Consent Guidelines</a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#074504] hover:bg-[#599200] text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Subscribe & Secure Mail</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>

      <VerificationModal 
        isOpen={isVerifying}
        email={formData.email}
        phone={formData.phone || undefined}
        onVerified={handleVerifiedSubmit}
        onClose={() => setIsVerifying(false)}
      />
    </main>
  );
}
