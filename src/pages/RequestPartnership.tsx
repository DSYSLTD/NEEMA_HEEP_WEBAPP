import SmartLeadForm from '../components/SmartLeadForm';
import { Handshake, Users, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function RequestPartnership() {
  return (
    <main className="flex-grow bg-[#f8faf8] py-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Value Proposition */}
        <div>
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">STRATEGIC ALLIANCES</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#074504] mb-8 leading-tight tracking-tighter uppercase">
            Partner with <span className="text-[#C0991B]">Neema HEEP</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 font-medium leading-relaxed">
            We believe in the power of collective impact. Join our network of donors, NGOs, and corporate partners to scale financial inclusion and community development across Kenya.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-[#599200]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#074504] mb-2 lowercase first-letter:uppercase">community reach</h3>
                <p className="text-gray-500 text-sm">Access deeply rooted networks in Mt. Kenya region, serving over 10,000 active members.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#C0991B]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#074504] mb-2 lowercase first-letter:uppercase">operational transparency</h3>
                <p className="text-gray-500 text-sm">Benefit from our rigorous compliance standards and impact-first reporting systems.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-[#074504]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#074504] mb-2 lowercase first-letter:uppercase">shared vision</h3>
                <p className="text-gray-500 text-sm">Align with a mission-driven partner focused on sustainable, long-term economic independence.</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Form */}
        <div className="bg-white p-2 rounded-[3.5rem] shadow-2xl">
          <SmartLeadForm 
            type="Partnership"
            title="Partnership Request"
            description="Tell us about your organization and how you'd like to collaborate with us."
            fields={[
              { name: 'orgName', label: 'Organization Name', type: 'text', placeholder: 'e.g. Global Impact NGO', required: true },
              { name: 'contactPerson', label: 'Contact Person', type: 'text', placeholder: 'Full Name', required: true },
              { name: 'email', label: 'Official Email Address', type: 'email', placeholder: 'name@organization.com', required: true },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254 7XX...', required: true },
              { 
                name: 'partnershipType', 
                label: 'Partnership Type', 
                type: 'select', 
                required: true,
                options: ['Donor / Grant Funding', 'Corporate Sponsorship', 'NGO Collaboration', 'Strategic Affiliate', 'Other']
              },
              { name: 'message', label: 'Brief Collaboration Concept', type: 'textarea', placeholder: 'Tell us your vision...', required: true }
            ]}
            ctaText="Submit Partnership Interest"
          />
        </div>
      </div>
    </main>
  );
}
