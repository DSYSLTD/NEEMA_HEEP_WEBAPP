import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { blogStore } from '../lib/blogStore';

export default function FloatingCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inWhoWeAreSection, setInWhoWeAreSection] = useState(false);
  const [waPosition, setWaPosition] = useState(() => blogStore.getWhatsAppSettings().position);

  const isDashboardOrPortal = location.pathname.startsWith('/admin') || 
                              location.pathname.startsWith('/staff-portal') || 
                              location.pathname === '/portal' ||
                              location.pathname.startsWith('/blog');

  const isQuizPage = location.pathname === '/pre-qualification' || location.pathname === '/calculator';
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isAboutPage = location.pathname === '/about-us' || location.pathname === '/about';

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setWaPosition(blogStore.getWhatsAppSettings().position);
    };
    window.addEventListener('neema_cms_whatsapp_settings_updated', handleSettingsUpdate);

    if (!isAboutPage) {
      setInWhoWeAreSection(false);
      return () => window.removeEventListener('neema_cms_whatsapp_settings_updated', handleSettingsUpdate);
    }

    const checkWhoWeAre = () => {
      const el = document.getElementById('who-we-are-section');
      if (!el) {
        setInWhoWeAreSection(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isInView = rect.top < windowHeight * 0.75 && rect.bottom > 120;
      setInWhoWeAreSection(isInView);
    };

    window.addEventListener('scroll', checkWhoWeAre, { passive: true });
    window.addEventListener('resize', checkWhoWeAre, { passive: true });
    checkWhoWeAre();

    return () => {
      window.removeEventListener('neema_cms_whatsapp_settings_updated', handleSettingsUpdate);
      window.removeEventListener('scroll', checkWhoWeAre);
      window.removeEventListener('resize', checkWhoWeAre);
    };
  }, [location.pathname, isAboutPage]);

  if (isDashboardOrPortal) return null;

  const positionClass = waPosition === 'bottom-left' 
    ? 'left-3 sm:left-6' 
    : 'right-3 sm:right-6';

  return (
    <>
      {/* Floating Take a Quiz Button (Hidden on Home Page and Quiz Page) */}
      {!isQuizPage && !isHomePage && (
        <div className={`fixed z-40 bottom-22 md:bottom-24 ${positionClass} pointer-events-auto`}>
          <motion.button
            key="floating-quiz-button"
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 220, damping: 20 }}
            onClick={() => navigate('/pre-qualification')}
            className="flex items-center justify-center bg-[#C0991B] hover:bg-[#a38217] text-[#074504] py-2.5 px-4 sm:py-3 sm:px-5 rounded-full shadow-[0_8px_25px_rgba(192,153,27,0.45)] border-2 border-white cursor-pointer group"
            aria-label="Take a Quiz to check eligibility"
          >
            <span className="font-black text-xs sm:text-xs uppercase tracking-wider whitespace-nowrap">
              Take a Quiz
            </span>
          </motion.button>
        </div>
      )}

      {/* Floating Request a Call Back (Placed above Take a Quiz when active) */}
      <div className={`fixed z-40 bottom-36 md:bottom-38 ${positionClass} pointer-events-none max-w-[calc(100vw-1.5rem)] transition-all duration-300`}>
        <AnimatePresence>
          {!isHomePage && !inWhoWeAreSection && (
            <motion.button
              key="request-callback-floating"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.25, type: "spring", stiffness: 220, damping: 22 }}
              onClick={() => navigate('/request-callback')}
              className="pointer-events-auto flex items-center justify-center gap-2 bg-[#074504] hover:bg-[#053303] text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-full shadow-[0_8px_25px_rgba(0,77,64,0.4)] transition-transform hover:-translate-y-0.5 group border border-white/20 cursor-pointer"
              aria-label="Request a Call Back"
            >
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#599200] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs shrink-0">
                <PhoneCall className="w-3.5 h-3.5 text-[#FFFFFF]" />
              </span>
              <span className="font-extrabold text-[11px] sm:text-xs tracking-tight uppercase whitespace-nowrap">
                Request a Call Back
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
