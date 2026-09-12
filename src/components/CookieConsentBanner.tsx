import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, Settings, Minimize2, Maximize2, Check, Lock, X } from 'lucide-react';
import { setConsentPreferences, initializeTrackingScripts } from '../services/trackingService';
import CookiePreferencesModal from './CookiePreferencesModal';
import { popupManager } from '../lib/popupManager';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('neema_cookie_consent');
    if (!consent) {
      // Check if popup manager allows showing
      const timer = setTimeout(() => {
        if (popupManager.registerOpen('cookie_consent')) {
          setIsVisible(true);
        }
      }, 600);
      return () => clearTimeout(timer);
    } else {
      initializeTrackingScripts();
    }
  }, []);

  const handleAcceptAll = () => {
    setConsentPreferences({ essential: true, analytics: true, marketing: true });
    setIsVisible(false);
    popupManager.registerClose('cookie_consent');
  };

  const handleDeclineOptional = () => {
    setConsentPreferences({ essential: true, analytics: false, marketing: false });
    setIsVisible(false);
    popupManager.registerClose('cookie_consent');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    popupManager.registerClose('cookie_consent');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (localStorage.getItem('neema_cookie_consent')) {
      setIsVisible(false);
      popupManager.registerClose('cookie_consent');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="full-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 max-w-6xl mx-auto z-[75] bg-white border border-gray-200/90 rounded-2xl sm:rounded-3xl p-4 sm:px-6 sm:py-4 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          {/* Left Cookie Icon & Notice Text */}
          <div className="flex items-start sm:items-center gap-3.5 flex-1">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#074504] border border-emerald-200 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-[#074504]" />
            </div>
            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyse site traffic, and serve personalised ads. By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our{' '}
              <button
                type="button"
                onClick={handleOpenModal}
                className="underline font-semibold text-[#074504] hover:text-[#C0991B] transition-colors inline-block"
              >
                Privacy Policy
              </button>{' '}
              for more information.
            </p>
          </div>

          {/* Right Side CTAs & Close Button */}
          <div className="flex items-center justify-end gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
            <button
              type="button"
              onClick={handleDeclineOptional}
              className="border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="bg-[#074504] hover:bg-[#053203] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all shadow-xs"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors ml-1"
              title="Close Cookie Banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <CookiePreferencesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
