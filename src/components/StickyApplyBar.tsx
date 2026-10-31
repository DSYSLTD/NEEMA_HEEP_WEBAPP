import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';

export default function StickyApplyBar() {
  const [isOnFooter, setIsOnFooter] = useState(false);

  useEffect(() => {
    const checkFooter = () => {
      const footer = document.getElementById('site-footer') || document.querySelector('footer');
      if (!footer) {
        setIsOnFooter(false);
        return;
      }
      const rect = footer.getBoundingClientRect();
      // If the top of the footer enters the viewport (with a 40px buffer)
      const buffer = 40;
      const isOverlapping = rect.top <= window.innerHeight - buffer;
      setIsOnFooter(isOverlapping);
    };

    // Use IntersectionObserver when available for performance
    const footer = document.getElementById('site-footer') || document.querySelector('footer');
    let observer: IntersectionObserver | null = null;

    if (footer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsOnFooter(true);
            } else {
              checkFooter();
            }
          });
        },
        {
          rootMargin: '0px 0px 0px 0px',
          threshold: [0, 0.05, 0.1]
        }
      );
      observer.observe(footer);
    }

    window.addEventListener('scroll', checkFooter, { passive: true });
    window.addEventListener('resize', checkFooter, { passive: true });
    checkFooter();

    return () => {
      if (observer && footer) observer.unobserve(footer);
      window.removeEventListener('scroll', checkFooter);
      window.removeEventListener('resize', checkFooter);
    };
  }, []);

  return (
    <div
      aria-hidden={isOnFooter}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 shadow-lg flex items-center justify-between max-w-7xl mx-auto rounded-t-2xl transition-all duration-300 ease-in-out ${
        isOnFooter
          ? 'opacity-0 translate-y-full pointer-events-none'
          : 'opacity-100 translate-y-0 pointer-events-auto'
      }`}
    >
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-[#C0991B]" />
        <span className="text-xs font-bold text-gray-800 hidden sm:inline">
          Check your loan eligibility in 2 minutes
        </span>
      </div>
      <Link
        to="/pre-qualification"
        className="px-4 py-2 bg-[#074504] hover:bg-[#053203] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
      >
        <span>Apply for Loan</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

