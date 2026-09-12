import React, { useState } from 'react';
import { PhoneCall, CheckCircle2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';

export default function RequestCallBack() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        type: 'Callback',
        name: 'Callback Request',
        phone,
        signupSource: 'Request Call Back Page',
        details: { phoneRequested: phone }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#074504] flex items-center justify-center mx-auto">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Request a Call Back</h1>
        <p className="text-xs text-gray-600">Leave your phone number and our loan officers will call you back within 15 minutes.</p>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#074504] mx-auto" />
          <h3 className="font-bold text-gray-900 text-sm">Request Received!</h3>
          <p className="text-xs text-gray-600">A customer representative is calling you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="e.g. 0722 000 000"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#074504] text-white font-bold text-xs rounded-xl hover:bg-[#053203] disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Call Me Back'}
          </button>
        </form>
      )}
    </div>
  );
}
