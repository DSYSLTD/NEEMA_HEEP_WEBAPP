import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Building2, ChevronRight, FileText, Activity, ShieldCheck, Check, ArrowRight, BookOpen } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SmartLeadForm from '../components/SmartLeadForm';

const branches = [
  { county: 'EMBU COUNTY', name: 'Embu Branch (Main Office)', badge: 'Head Office', location: 'Neema Plaza, 3rd Floor, Mama Ngina Street, Embu Town', phone: '+254 705 759 365', email: 'info@neemaheep.com', coords: '-0.53882, 37.45477' },
  { county: 'MERU COUNTY', name: 'Meru Branch', badge: 'Branch', location: 'Sarah Plaza, Bus Stage Road, Meru Town', phone: '+254 705 759 365', email: 'info@neemaheep.com', coords: '0.0514, 37.6491' },
  { county: 'EMBU COUNTY', name: 'Kiritiri Branch', badge: 'Branch', location: 'Embu-Kiritiri Road, Kiritiri', phone: '+254 705 759 365', email: 'info@neemaheep.com', coords: '-0.7100, 37.6480' },
  { county: 'MURANG\'A COUNTY', name: 'Murang\'a Branch', badge: 'Branch', location: 'Kahuro Market, along Mukuyu-Githambo Road', phone: '+254 705 759 365', email: 'info@neemaheep.com', coords: '-0.745669, 36.9122' },
  { county: 'EMBU COUNTY', name: 'Siakago Branch', badge: 'Branch', location: 'Near PEMA Building, Siakago', phone: '+254 705 759 365', email: 'info@neemaheep.com', coords: '-0.5828, 37.6367' },
  { county: 'THARAKA NITHI', name: 'Chuka Branch', badge: 'Branch', location: 'Near Kenya Power Office, Chuka Town', phone: '+254 705 759 365', email: 'info@neemaheep.com', coords: '-0.3325, 37.6472' }
];

export default function ContactUs() {
  const [contactMethod, setContactMethod] = useState<'phone' | 'whatsapp' | 'email' | 'visit'>('phone');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');

  return (
    <main className="flex-grow bg-[#f8faf8] font-sans">
      {/* Top Banner Section */}
      <section className="bg-[#074504] text-white pt-28 pb-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-[#599200] rounded-full blur-[200px] opacity-10 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">Get in Touch</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-extrabold leading-[0.95] mb-8 tracking-tight uppercase">
              Let's <span className="text-[#C0991B]">Get in Touch.</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-12 font-medium leading-relaxed">
              Have a question or ready to start your financial journey? Our team is standing by to provide the support you need.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-white/70">
                <Phone className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-bold">Call Us</span>
              </div>
              <p className="font-bold xl:text-lg tracking-tight mb-1">+254 705 759 365</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-white/70">
                <Mail className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-bold">Email Us</span>
              </div>
              <p className="font-bold text-lg tracking-tight mb-1">info@neemaheep.com</p>
              <p className="text-white/60 text-sm">Reply within 24hrs</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-white/70">
                <WhatsAppIcon className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-bold">WhatsApp</span>
              </div>
              <p className="font-bold text-lg tracking-tight mb-1">+254 705 759 365</p>
              <p className="text-white/60 text-sm">Instant response</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-white/70">
                <MapPin className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-bold">Visit Us</span>
              </div>
              <p className="font-bold text-lg tracking-tight mb-1">6 Active Branches</p>
              <p className="text-white/60 text-sm">Covering Central Kenya</p>
            </div>
        </div>
      </div>
</section>

      {/* Middle Section: Form and Info */}
      <section className="bg-white rounded-t-[3rem] -mt-8 relative z-20 py-20 px-6 lg:px-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.5fr_1fr] gap-16">
          
          {/* Smart Form */}
          <div className="space-y-16">
            <div>
              <SmartLeadForm 
                type="Contact"
                title="Send a Message"
                description="Tell us about your business, what you need the loan for, or how we can help you."
                fields={[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Wanjiru Muthoni', required: true },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+254 7XX XXX XXX', required: true },
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'yourname@email.com', required: true },
                  { 
                    name: 'interest', 
                    label: 'Interested In', 
                    type: 'select', 
                    required: true,
                    options: ['Microfinance Loan', 'Business Loan', 'Asset Financing', 'Emergency Loan', 'Group Loan']
                  },
                  { 
                    name: 'urgency', 
                    label: 'Urgency Level', 
                    type: 'select', 
                    required: true,
                    options: ['Normal: Response shortly', 'Urgent: Need quick response']
                  },
                  { name: 'message', label: 'Your Message', type: 'textarea', placeholder: 'Tell us more...', required: true }
                ]}
                ctaText="Send Message"
              />
            </div>

            {/* Request a Call Back Form */}
            <div className="bg-[#074504] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#599200] rounded-full blur-[100px] opacity-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[100px] opacity-15 pointer-events-none" />
              
              <div className="relative z-10 bg-white text-gray-900 p-8 md:p-10 rounded-[2rem] shadow-lg">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#074504]/10 rounded-full text-[#074504] mb-4">
                  <Phone className="w-3.5 h-3.5 text-[#C0991B]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Phone Callback Service</span>
                </div>
                <SmartLeadForm 
                  type="Callback"
                  title="Request a Call Back"
                  description="Prefer to speak directly with an officer? Leave your phone number and preferred time slot, and our loan specialist will reach out to you."
                  fields={[
                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Wanjiru Muthoni', required: true },
                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '07XX XXX XXX', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'yourname@email.com', required: true },
                    { 
                      name: 'interest', 
                      label: 'I want to talk about', 
                      type: 'select', 
                      required: true,
                      options: ['General Loan Inquiry', 'Mali Plus Loan', 'Jijenge Facility', 'Microfinance Credit Solutions', 'Arise & Shine Program', 'Careers']
                    },
                    { 
                       name: 'preferredTime', 
                       label: 'Preferred Callback Time', 
                       type: 'select', 
                       required: true,
                       options: ['Morning (8am - 12pm)', 'Afternoon (1pm - 5pm)', 'Late Evening (5pm - 7pm)']
                    }
                  ]}
                  ctaText="Confirm Callback Request"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Info Panels */}
          <div className="space-y-6 lg:mt-32">
            <div className="bg-white border text-gray-900 border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow cursor-default">
              <h3 className="font-extrabold text-lg mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link to="/registration" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group">
                  <div className="w-10 h-10 bg-[#f4f7f6] group-hover:bg-white rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#C0991B]" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900 leading-tight">Apply for a Loan</p>
                    <p className="text-xs text-gray-500 mt-0.5">Start your application in 5 minutes</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </Link>
                <Link to="/loans" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group">
                  <div className="w-10 h-10 bg-[#f4f7f6] group-hover:bg-[#F0FDF4] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <Activity className="w-5 h-5 text-[#C0991B]" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900 leading-tight">View Loan Products</p>
                    <p className="text-xs text-gray-500 mt-0.5">Compare rates and eligibility</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </Link>
                <Link to="/blog" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group">
                  <div className="w-10 h-10 bg-[#f4f7f6] group-hover:bg-[#F0FDF4] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                    <BookOpen className="w-5 h-5 text-[#C0991B]" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900 leading-tight">Read Our Blog</p>
                    <p className="text-xs text-gray-500 mt-0.5">Financial insights, tips & stories</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </Link>
              </div>
            </div>

            <div className="bg-white border text-gray-900 border-gray-200 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#f4f7f6] rounded-full flex items-center justify-center text-[#074504]">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-lg">Operating Hours</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Monday - Friday</span>
                  <span className="font-bold text-gray-900">8:00 AM - 6:00 PM</span>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Saturday</span>
                  <span className="font-bold text-gray-900">9:00 AM - 2:00 PM</span>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Sunday and Public Holidays</span>
                  <span className="font-bold text-gray-900">Closed</span>
                </div>
              </div>
            </div>

            <a href="https://wa.me/254705759365" target="_blank" rel="noopener noreferrer" className="block bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-[1.25rem] p-8 shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.4)] transition-all group hover:-translate-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <WhatsAppIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg leading-tight">Chat on WhatsApp</p>
                    <p className="text-sm text-white/80 mt-0.5">Get instant answers from our team</p>
                  </div>
                <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors group-hover:translate-x-1" />
              </div>
            </div>
</a>

            <div className="bg-[#f4f7f6] rounded-[2rem] p-6 border border-gray-200 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">Fully Regulated</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Neema HEEP is an AMFI Kenya member, and adheres to the Data Protection Act 2019. Your information is secure.
                </p>
              </div>
            </div>

            {/* CTA Banner to fill space below Fully Regulated */}
            <div className="bg-[#074504] text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#599200] rounded-full blur-[80px] opacity-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C0991B] rounded-full blur-[80px] opacity-15 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <span className="bg-[#C0991B] text-[#074504] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block shadow-sm">
                  ⚡ Insights & Stories
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-snug">
                  Explore Our <span className="text-[#C0991B]">Latest Blog</span>
                </h3>
                <p className="text-white/80 text-xs font-medium leading-relaxed">
                  Discover financial literacy guides, success stories, and impact updates from Neema HEEP.
                </p>

                <div className="pt-2 space-y-3">
                  <Link 
                    to="/blog" 
                    className="w-full bg-[#C0991B] hover:bg-[#a38217] text-[#074504] font-black py-3.5 px-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-center"
                  >
                    <span>Read Blog Articles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <Link 
                    to="/registration" 
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-center"
                  >
                    <span>Register to Join</span>
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>

      {/* Offices Section */}
      <section className="bg-[#F9FAFB] py-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">Our Offices</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#074504] leading-tight mb-12 tracking-tight uppercase">
            OUR <span className="text-[#C0991B]">OFFICES</span>
          </h2>

          <div className="bg-[#eef2f0] rounded-[3rem] p-4 text-center mb-12 flex flex-col justify-center items-center h-[400px] relative overflow-hidden border border-gray-200">
             <iframe 
               src="https://maps.google.com/maps?q=-0.53882,37.45477&hl=en&z=8&output=embed" 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               style={{ border: 0, borderRadius: '2rem' }} 
               allowFullScreen 
               aria-hidden="false" 
               tabIndex={0} 
             />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map(branch => (
              <div key={branch.name} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 bg-[#f4f7f6] rounded-xl flex items-center justify-center text-[#074504]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${branch.badge === 'Head Office' ? 'bg-[#FFF9C4] text-[#F57F17]' : 'bg-[#eef2f0] text-[#074504]'}`}>
                    {branch.badge}
                  </span>
                </div>
                <p className="text-[10px] font-extrabold text-[#C0991B] tracking-widest uppercase mb-1.5">{branch.county}</p>
                <h4 className="text-lg font-bold text-gray-900 mb-4 leading-tight">{branch.name}</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600 font-medium">{branch.location}</p>
                      <a href={`https://maps.google.com/?q=${branch.coords}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C0991B] font-semibold mt-1.5 hover:text-[#28a428] flex items-center gap-1 transition-colors">
                        View Map <ChevronRight className="w-3 h-3"/>
                      </a>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gray-100"></div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                    <a href={`tel:${branch.phone.split(' ')[0]}`} className="text-sm text-gray-600 font-medium hover:text-[#074504] transition-colors">{branch.phone}</a>
                  </div>
                  <div className="w-full h-px bg-gray-100"></div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <a href={`mailto:${branch.email}`} className="text-sm text-gray-600 font-medium hover:text-[#074504] transition-colors">{branch.email}</a>
                  </div>
                  <div className="w-full h-32 mt-4 rounded-xl overflow-hidden border border-gray-100">
                     <iframe 
                       src={`https://maps.google.com/maps?q=${branch.coords}&hl=en&z=14&output=embed`} 
                       width="100%" 
                       height="100%" 
                       frameBorder="0" 
                       style={{ border: 0 }} 
                       allowFullScreen 
                       aria-hidden="false" 
                       tabIndex={0} 
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="mt-16 bg-[#074504] rounded-[3rem] p-10 lg:p-16 text-center relative overflow-hidden border-2 border-[#C0991B]/30 shadow-2xl">
             {/* Background decorative glows in brand green & gold */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-[#599200] rounded-full blur-[100px] opacity-25 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C0991B] rounded-full blur-[100px] opacity-20 pointer-events-none" />

             <div className="relative z-10 max-w-3xl mx-auto">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-[#C0991B]/40 mb-6">
                 <Phone className="w-3.5 h-3.5 text-[#C0991B]" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C0991B]">Remote Services & M-PESA Support</span>
               </div>

               <h3 className="text-3xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
                 CAN'T VISIT <span className="text-[#C0991B]">IN PERSON?</span>
               </h3>

               <p className="text-white/90 max-w-xl mx-auto mb-10 font-medium text-base leading-relaxed">
                 You don't need to travel to our physical branches! Our loan officers can manage your inquiry, application, and loan processing directly over the phone or via M-PESA.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                 <a 
                   href="https://wa.me/254705759365" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all w-full sm:w-auto shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:scale-105 flex items-center justify-center gap-2.5"
                 >
                   <WhatsAppIcon className="w-5 h-5" /> 
                   <span>WhatsApp Us Now</span>
                 </a>

                 <a 
                   href="tel:+254705759365" 
                   className="bg-[#C0991B] hover:bg-[#a38217] text-[#074504] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all w-full sm:w-auto shadow-lg hover:scale-105 flex items-center justify-center gap-2.5"
                 >
                   <Phone className="w-4 h-4 text-[#074504]" /> 
                   <span>Call Officer Direct</span>
                 </a>
               </div>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
