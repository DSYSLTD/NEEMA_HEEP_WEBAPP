import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface PageTarget {
  path: string;
  label: string;
}

interface NavMapping {
  prev: PageTarget;
  next: PageTarget;
}

function getNavForPath(pathname: string): NavMapping {
  // Normalize path (strip trailing slashes if present, except root)
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // 1. Home
  if (cleanPath === '' || cleanPath === '/') {
    return {
      prev: { path: '/contact', label: 'Contact Us' },
      next: { path: '/about-us', label: 'About Us' }
    };
  }

  // 2. About Us
  if (cleanPath === '/about-us') {
    return {
      prev: { path: '/', label: 'Home' },
      next: { path: '/loans', label: 'Loan Products' }
    };
  }

  // 3. Loans Index
  if (cleanPath === '/loans') {
    return {
      prev: { path: '/about-us', label: 'About Us' },
      next: { path: '/pre-qualification', label: 'Check Loan Eligibility' }
    };
  }

  // 4. Loan Detail (/loans/:loanId)
  if (cleanPath.startsWith('/loans/')) {
    return {
      prev: { path: '/loans', label: 'All Loan Products' },
      next: { path: '/pre-qualification', label: 'Check Loan Eligibility' }
    };
  }

  // 5. Pre-Qualification
  if (cleanPath === '/pre-qualification' || cleanPath === '/calculator' || cleanPath === '/mortgage-calculator') {
    return {
      prev: { path: '/loans', label: 'Loan Products' },
      next: { path: '/requirements', label: 'Loan Requirements' }
    };
  }

  // 6. Requirements
  if (cleanPath === '/requirements') {
    return {
      prev: { path: '/pre-qualification', label: 'Check Eligibility' },
      next: { path: '/checklists', label: 'Application Checklists' }
    };
  }

  // 7. Checklists
  if (cleanPath === '/checklists') {
    return {
      prev: { path: '/requirements', label: 'Loan Requirements' },
      next: { path: '/current-rates', label: 'Current Rates' }
    };
  }

  // 8. Current Rates
  if (cleanPath === '/current-rates') {
    return {
      prev: { path: '/checklists', label: 'Application Checklists' },
      next: { path: '/process-and-compliance', label: 'Process & Compliance' }
    };
  }

  // 9. Process & Compliance
  if (cleanPath === '/process-and-compliance') {
    return {
      prev: { path: '/current-rates', label: 'Current Rates' },
      next: { path: '/client-testimonials', label: 'Client Testimonials' }
    };
  }

  // 10. Testimonials
  if (cleanPath === '/client-testimonials') {
    return {
      prev: { path: '/process-and-compliance', label: 'Process & Compliance' },
      next: { path: '/programs', label: 'Our Programmes' }
    };
  }

  // 11. Programs Index / Impact
  if (cleanPath === '/programs' || cleanPath === '/impact') {
    return {
      prev: { path: '/client-testimonials', label: 'Client Testimonials' },
      next: { path: '/programs/education-support', label: 'Education Support' }
    };
  }

  // 12. Education Support Program
  if (cleanPath === '/programs/education-support') {
    return {
      prev: { path: '/programs', label: 'Our Programmes' },
      next: { path: '/programs/community-health', label: 'Community Health' }
    };
  }

  // 13. Community Health Program
  if (cleanPath === '/programs/community-health') {
    return {
      prev: { path: '/programs/education-support', label: 'Education Support' },
      next: { path: '/programs/economic-empowerment', label: 'Economic Empowerment' }
    };
  }

  // 14. Economic Empowerment Program
  if (cleanPath === '/programs/economic-empowerment') {
    return {
      prev: { path: '/programs/community-health', label: 'Community Health' },
      next: { path: '/beneficiaries', label: 'Program Beneficiaries' }
    };
  }

  // 15. Beneficiaries
  if (cleanPath === '/beneficiaries') {
    return {
      prev: { path: '/programs', label: 'Our Programmes' },
      next: { path: '/sponsorship', label: 'Sponsorship Request' }
    };
  }

  // 16. Sponsorship Request
  if (cleanPath === '/sponsorship') {
    return {
      prev: { path: '/beneficiaries', label: 'Program Beneficiaries' },
      next: { path: '/partnership', label: 'Partnership & Donors' }
    };
  }

  // 17. Partnership / Donors
  if (cleanPath === '/partnership' || cleanPath === '/donors' || cleanPath === '/partners' || cleanPath === '/request-partnership') {
    return {
      prev: { path: '/sponsorship', label: 'Sponsorship Request' },
      next: { path: '/join', label: 'Join Us' }
    };
  }

  // 18. Join Us / Registration / Portal Activation
  if (cleanPath === '/join' || cleanPath === '/registration' || cleanPath === '/portal-activation') {
    return {
      prev: { path: '/partnership', label: 'Partnership & Donors' },
      next: { path: '/volunteer', label: 'Volunteer' }
    };
  }

  // 19. Volunteer
  if (cleanPath === '/volunteer' || cleanPath === '/volunteers') {
    return {
      prev: { path: '/join', label: 'Join Us' },
      next: { path: '/careers', label: 'Careers' }
    };
  }

  // 20. Careers
  if (cleanPath === '/careers') {
    return {
      prev: { path: '/volunteer', label: 'Volunteer' },
      next: { path: '/blog', label: 'Blog & News' }
    };
  }

  // 21. Job Application
  if (cleanPath === '/careers/apply' || cleanPath === '/job-application') {
    return {
      prev: { path: '/careers', label: 'Careers' },
      next: { path: '/contact', label: 'Contact Us' }
    };
  }

  // 22. Blog Index
  if (cleanPath === '/blog') {
    return {
      prev: { path: '/careers', label: 'Careers' },
      next: { path: '/faq', label: 'Frequently Asked Questions' }
    };
  }

  // 23. Blog Article
  if (cleanPath.startsWith('/blog/')) {
    return {
      prev: { path: '/blog', label: 'All Blog Articles' },
      next: { path: '/faq', label: 'Frequently Asked Questions' }
    };
  }

  // 24. Author Profile
  if (cleanPath.startsWith('/author')) {
    return {
      prev: { path: '/blog', label: 'Blog & Articles' },
      next: { path: '/faq', label: 'Frequently Asked Questions' }
    };
  }

  // 25. FAQ
  if (cleanPath === '/faq') {
    return {
      prev: { path: '/blog', label: 'Blog & Articles' },
      next: { path: '/contact', label: 'Contact Us' }
    };
  }

  // 26. Contact Us / Talk To Us / Request Callback
  if (cleanPath === '/contact' || cleanPath === '/talk-to-us' || cleanPath === '/request-callback') {
    return {
      prev: { path: '/faq', label: 'Frequently Asked Questions' },
      next: { path: '/blog', label: 'Blog & Articles' }
    };
  }

  // 27. Portal
  if (cleanPath === '/portal' || cleanPath === '/staff-portal') {
    return {
      prev: { path: '/contact', label: 'Contact Us' },
      next: { path: '/', label: 'Home' }
    };
  }

  // 28. Legal pages
  if (cleanPath === '/privacy-policy' || cleanPath === '/terms-conditions' || cleanPath === '/regulatory-disclosures') {
    return {
      prev: { path: '/', label: 'Home' },
      next: { path: '/contact', label: 'Contact Us' }
    };
  }

  // 29. Newsletter / Thank You
  if (cleanPath === '/newsletter-subscribe' || cleanPath === '/thank-you') {
    return {
      prev: { path: '/', label: 'Home' },
      next: { path: '/loans', label: 'Loan Products' }
    };
  }

  // Default fallback
  return {
    prev: { path: '/', label: 'Home' },
    next: { path: '/loans', label: 'Explore Loan Products' }
  };
}

export default function PageNavigation() {
  const { pathname } = useLocation();

  // Hide page navigation only on admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const { prev, next } = getNavForPath(pathname);

  return (
    <nav 
      aria-label="Page sequence navigation" 
      className="w-full bg-gradient-to-b from-white via-gray-50/50 to-gray-100/60 border-t border-gray-200/80 py-8 px-6 lg:px-12 relative z-10 shadow-inner"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Previous Page Button */}
        <Link 
          to={prev.path}
          className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white hover:bg-[#074504]/5 text-gray-800 hover:text-[#074504] transition-all duration-200 border border-gray-200 hover:border-[#074504]/20 shadow-sm hover:shadow-md w-full sm:w-1/2 md:w-auto"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#074504]/10 flex items-center justify-center text-[#C0991B] shrink-0 transition-colors">
            {prev.path === '/' ? (
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            )}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#C0991B] transition-colors">
              Previous Page
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#074504] group-hover:text-[#053203] truncate">
              {prev.label}
            </span>
          </div>
        </Link>

        {/* Quick Home Center Badge (hidden on small screens, nice subtle anchor) */}
        {pathname !== '/' && (
          <Link 
            to="/" 
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gray-100 hover:bg-[#074504] text-gray-600 hover:text-white font-bold text-[11px] uppercase tracking-wider transition-all border border-gray-200 hover:border-[#074504] shrink-0"
            title="Return to Home Page"
          >
            <Home className="w-3.5 h-3.5 text-[#C0991B]" />
            <span>Home</span>
          </Link>
        )}

        {/* Next Page Button */}
        <Link 
          to={next.path}
          className="group flex items-center justify-between sm:justify-end gap-3 px-5 py-4 rounded-2xl bg-[#074504] hover:bg-[#052903] text-white transition-all duration-200 border border-[#074504] shadow-md hover:shadow-lg w-full sm:w-1/2 md:w-auto"
        >
          <div className="flex flex-col text-left sm:text-right overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C0991B]">
              Next Page
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-white truncate">
              {next.label}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-[#C0991B] shrink-0 transition-colors">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>
    </nav>
  );
}
