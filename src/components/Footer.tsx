import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { PRODUCT_LINKS } from "../lib/loanData";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Products", path: "/loans" },
  { label: "Contact Us", path: "/contact" },
];

const programsMap = [
  { label: "Arise & Shine Education", path: "/programs/education-support" },
  { label: "Mosquito Net Distribution", path: "/programs#mosquito-net-programme" },
  { label: "Community Health", path: "/programs/community-health" },
  { label: "Economic Empowerment", path: "/programs/economic-empowerment" },
];

const memberLinks = [
  { label: "Portal Login (CMS)", path: "/portal" },
  { label: "Check Loan Eligibility", path: "/pre-qualification" },
  { label: "Join Neema Heep", path: "/join" },
  { label: "Frequently Asked Questions", path: "/faq" },
];

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setError('Email address is required.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Redirect to subscription page to complete safe verification & consent under HEEP guidelines
    navigate(`/newsletter-subscribe?email=${encodeURIComponent(email)}`);
  };

  return (
    <footer className="bg-[#074504] text-white font-sans w-full flex flex-col overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#599200]/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      {/* Newsletter Section */}
      <div className="border-b border-[#0a5c05] relative z-10 w-full px-6 lg:px-12">
        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Stay Updated</h3>
            <p className="text-white/70 text-sm">
              Subscribe to our newsletter for impact stories and product news.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-auto min-w-[320px]">
            <form className="flex w-full relative" onSubmit={handleSubscribe}>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                placeholder="Your email address"
                className={`px-5 py-4 w-full md:w-80 text-[#074504] bg-white/95 rounded-l-xl outline-none transition-all placeholder:text-gray-400 font-medium ${
                  error ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-2 focus:ring-[#599200]'
                }`}
              />
              <button
                type="submit"
                className="bg-[#599200] text-white px-8 py-4 rounded-r-xl font-bold hover:bg-[#28A428] transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_4px_14px_rgba(50,205,50,0.3)]"
              >
                SUBSCRIBE <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-3 text-left animate-in fade-in slide-in-from-top-1 font-medium">{error}</p>}
            {success && <p className="text-[#C0991B] text-sm mt-3 text-left animate-in fade-in slide-in-from-top-1 font-bold">Successfully subscribed!</p>}
            
            <p className="text-[10px] text-white/50 leading-tight uppercase font-black tracking-widest mt-4">
              Consent-based double-verification active.
            </p>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Section */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-4 xl:gap-8">
          
          {/* Column 1: Brand Block */}
          <div className="sm:col-span-2 lg:col-span-1 pb-6 lg:pb-0 flex flex-col">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-32 h-32 flex items-center justify-center group cursor-pointer select-none">
                {/* SVG for curved text path */}
                <svg viewBox="0 0 160 160" className="w-full h-full absolute top-0 left-0">
                  <defs>
                    <path
                      id="footer-logo-curve"
                      d="M 20,90 A 60,60 0 0,1 140,90"
                      fill="none"
                    />
                  </defs>
                  <text className="fill-[#C0991B] font-extrabold tracking-[0.16em] text-[10.5px] uppercase">
                    <textPath href="#footer-logo-curve" startOffset="50%" textAnchor="middle">
                      NEEMA HEEP MICROFINANCE
                    </textPath>
                  </text>
                </svg>

                {/* Centered Logo under the curved text */}
                <div className="w-20 h-20 rounded-full bg-[#074504] p-1.5 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-105 shadow-lg border border-[#074504]/30 mt-2 overflow-hidden">
                  <img 
                    src="/footer_logo.png" 
                    alt="Neema HEEP Logo Footer" 
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = "https://lh3.googleusercontent.com/d/1bPRJnJJC81yosnURAbl06al3HFlKNu5L";
                      }
                    }}
                    className="h-full w-full object-cover rounded-full" 
                  />
                </div>
              </div>
            </div>
            <p className="text-white/80 text-xs italic leading-snug mt-1 text-center lg:text-left font-medium max-w-[200px]">
              "Your shelter for health and prosperity"
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#C0991B]">Quick Links</h4>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-[#C0991B]/40 group-hover:bg-[#C0991B] transition-colors" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 3: Loan Products (Top 4 Impactful Products) */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#C0991B]">Products</h4>
            {PRODUCT_LINKS.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/loans/${product.id}`}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-[#C0991B]/40 group-hover:bg-[#C0991B] transition-colors" />
                {product.label}
              </Link>
            ))}
          </div>

          {/* Column 4: Programs */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#C0991B]">Programs</h4>
            {programsMap.map((program) => (
              <Link
                key={program.label}
                to={program.path}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-[#C0991B]/40 group-hover:bg-[#C0991B] transition-colors" />
                {program.label}
              </Link>
            ))}
          </div>

          {/* Column 5: Members */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#C0991B]">Members</h4>
            {memberLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <span className="w-1 h-1 rounded-full bg-[#C0991B]/40 group-hover:bg-[#C0991B] transition-colors" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 6: Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-[#C0991B]">Contact Us</h4>
            <div className="flex items-start gap-2.5 group">
              <Phone className="w-4 h-4 text-[#C0991B] shrink-0 mt-0.5" />
              <p className="text-xs text-white/80 leading-relaxed font-mono font-medium group-hover:text-white transition-colors">
                <a href="tel:+254705759365">+254 705 759 365</a>
              </p>
            </div>
            <div className="flex items-center gap-2.5 group">
              <Mail className="w-4 h-4 text-[#C0991B] shrink-0" />
              <p className="text-xs text-white/80 font-medium group-hover:text-white transition-colors truncate">
                <a href="mailto:info@neemaheep.com">info@neemaheep.com</a>
              </p>
            </div>
            <div className="flex items-start gap-2.5 text-white/80">
              <MapPin className="w-4 h-4 text-[#C0991B] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight font-medium">
                Neema Plaza, 3rd Floor<br />
                Mama Ngina Street, Embu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-[#0c3d00] border-t border-white/20 relative z-10 text-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center text-xs font-medium gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-white/80 items-center">
            <Link to="/privacy-policy" className="text-white hover:text-[#C0991B] transition-colors">Privacy Policy</Link>
            <span className="text-white/20">•</span>
            <Link to="/terms-conditions" className="text-white hover:text-[#C0991B] transition-colors">Terms & Conditions</Link>
            <span className="text-white/20">•</span>
            <Link to="/regulatory-disclosures" className="text-white hover:text-[#C0991B] transition-colors">Regulatory Disclosures</Link>
          </div>

          <div className="text-white/60 uppercase tracking-widest text-center md:text-right font-semibold text-[11px]">
            &copy; {new Date().getFullYear()} NEEMA HEEP MICRO FINANCE <span className="mx-2 hidden sm:inline">|</span> All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
