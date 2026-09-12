import React, { useState, useEffect } from 'react';
import CookieConsentBanner from './CookieConsentBanner';
import CookiePreferencesModal from './CookiePreferencesModal';
import { initializeTrackingScripts } from '../services/trackingService';
import { popupManager } from '../lib/popupManager';

export default function TrackingManager() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  useEffect(() => {
    // Initialize tracking scripts based on existing consent
    initializeTrackingScripts();

    // Event listeners for global triggers
    const handleOpenCookieModal = () => {
      if (popupManager.registerOpen('cookie_modal')) {
        setIsCookieModalOpen(true);
      }
    };

    window.addEventListener('neema_open_cookie_modal', handleOpenCookieModal);

    return () => {
      window.removeEventListener('neema_open_cookie_modal', handleOpenCookieModal);
    };
  }, []);

  const handleCloseCookieModal = () => {
    setIsCookieModalOpen(false);
    popupManager.registerClose('cookie_modal');
  };

  return (
    <>
      <CookieConsentBanner />
      
      <CookiePreferencesModal
        isOpen={isCookieModalOpen}
        onClose={handleCloseCookieModal}
      />
    </>
  );
}
