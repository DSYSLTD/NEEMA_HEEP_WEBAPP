import React, { useState, useEffect } from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { blogStore, WhatsAppSettings } from '../lib/blogStore';

export default function StickyWhatsApp() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [shouldSettle, setShouldSettle] = useState(false);
  const [waSettings, setWaSettings] = useState<WhatsAppSettings>(() => blogStore.getWhatsAppSettings());

  const isDashboardOrPortal = location.pathname.startsWith('/admin') || 
                              location.pathname.startsWith('/staff-portal') || 
                              location.pathname === '/portal' ||
                              location.pathname.startsWith('/blog');

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  const isAboutPage = location.pathname === '/about-us' || location.pathname === '/about';

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setWaSettings(blogStore.getWhatsAppSettings());
    };

    window.addEventListener('neema_cms_whatsapp_settings_updated', handleSettingsUpdate);

    const handleScroll = () => {
      let visible = true;

      // 1. Check footer overlap
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight - 100) {
          visible = false;
        }
      }

      // 2. Check Who We Are section overlap on About Us page
      if (isAboutPage) {
        const whoWeAreEl = document.getElementById('who-we-are-section');
        if (whoWeAreEl) {
          const rect = whoWeAreEl.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const isInWhoWeAre = rect.top < windowHeight * 0.75 && rect.bottom > 120;
          if (isInWhoWeAre) {
            visible = false;
          }
        }
      }

      setIsVisible(visible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    const settleTimer = setTimeout(() => {
      setShouldSettle(true);
    }, 6000);

    return () => {
      window.removeEventListener('neema_cms_whatsapp_settings_updated', handleSettingsUpdate);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(settleTimer);
    };
  }, [location.pathname, isAboutPage]);

  if (isDashboardOrPortal || !waSettings.floatingButtonEnabled) return null;

  const getMessageContext = () => {
    if (waSettings.prefilledTextEnabled && waSettings.prefilledText.trim()) {
      return waSettings.prefilledText.trim();
    }

    const path = location.pathname;
    if (path.startsWith('/careers')) {
      return "Hi! I am interested in joining the NEEMA HEEP team. I would love to learn more about current job openings, placement requirements, and career opportunities.";
    }
    if (path.startsWith('/programs') || path === '/impact') {
      return "Hi! I'm interested in learning more about the NEEMA HEEP community programs (Arise & Shine Education Support, Community Health Care, or Economic Empowerment).";
    }
    if (path === '/donors') {
      return "Hi! I am interested in partnering with NEEMA HEEP as a donor, grant provider, or institutional partner to support your community initiatives.";
    }

    switch (path) {
      case '/calculator':
      case '/pre-qualification':
        return "Hi! I have a question about the repayment schedule and qualification threshold for loans from your pre-qualification calculator.";
      case '/checklists':
        return "Hi! I'd like some help preparing for my loan application using the application checklists.";
      case '/talk-to-us':
        return "Hi! I'm looking to consult with a loan specialist regarding my financial options.";
      default:
        return "Hi! I'm visiting your website and would like to learn more about NEEMA HEEP's loan products and community support programs.";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'generate_lead',
        category: 'WhatsApp',
        action: 'Click',
        label: location.pathname
      });
    }
  };

  const cleanPhone = (waSettings.phoneNumber || '254705759365').replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(getMessageContext())}`;

  const attentionAnim = {
    scale: [1, 1.12, 1, 1.12, 1, 1],
    rotate: [0, -8, 8, -8, 8, 0],
    boxShadow: [
      "0px 0px 20px rgba(37, 211, 102, 0.4)",
      "0px 0px 35px rgba(37, 211, 102, 0.8)",
      "0px 0px 20px rgba(37, 211, 102, 0.4)",
      "0px 0px 35px rgba(37, 211, 102, 0.8)",
      "0px 0px 20px rgba(37, 211, 102, 0.4)",
    ]
  };

  const positionClass = waSettings.position === 'bottom-left' 
    ? 'left-4 md:left-6' 
    : 'right-4 md:right-6';

  const bottomClass = isHomePage 
    ? 'bottom-20 sm:bottom-22' 
    : 'bottom-5 md:bottom-6';

  return (
    <motion.a
      href={whatsappUrl}
      id="sticky-whatsapp-btn"
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? (shouldSettle ? 1 : [0.7, 1.15, 1]) : 0,
        y: isVisible ? 0 : 40,
        ...(isVisible && !shouldSettle ? attentionAnim : {})
      }}
      transition={{
        duration: isVisible && !shouldSettle ? 2.5 : 0.3,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }}
      whileHover={{ scale: 1.08, translateY: -4 }}
      className={`fixed ${bottomClass} ${positionClass} z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full border-2 border-white shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:shadow-[0_0_35px_rgba(37,211,102,0.9)] flex items-center justify-center group transition-all duration-300`}
      aria-label="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full border border-white/60 animate-ping pointer-events-none opacity-40"></span>
      <WhatsAppIcon className="w-8 h-8 text-white drop-shadow-md" />
      
      <span className={`absolute ${waSettings.position === 'bottom-left' ? 'left-full ml-4' : 'right-full mr-4'} top-1/2 -translate-y-1/2 bg-[#074504] text-white text-xs font-extrabold py-2 px-3.5 rounded-xl shadow-xl border border-[#C0991B]/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap hidden sm:flex items-center gap-2`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
        <span>{waSettings.liveChatEnabled ? `${waSettings.agentName || 'Agent'}: ${waSettings.greetingText || 'Chat with us'}` : (waSettings.tooltipText || 'Chat on WhatsApp')}</span>
      </span>
    </motion.a>
  );
}
