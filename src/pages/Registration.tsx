import React, { useState } from 'react';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';

export default function Registration() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitLead } = useLeads();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        type: 'Registration',
        name: fullName,
        phone,
        signupSource: 'Registration Page',
        details: { fullName, phone }
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
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Member Portal Activation</h1>
        <p className="text-xs text-gray-600">Register or activate your Neema Heep online member portal account.</p>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#074504] mx-auto" />
          <h3 className="font-bold text-gray-900 text-sm">Activation Requested</h3>
          <p className="text-xs text-gray-600">Our customer team will verify your membership and send login credentials via SMS.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g. Grace Wanjiku"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone (M-PESA)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="e.g. 0712 345 678"
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#074504] text-white font-bold text-xs rounded-xl hover:bg-[#053203] disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Activation'}
          </button>
        </form>
      )}
    </div>
  );
}
