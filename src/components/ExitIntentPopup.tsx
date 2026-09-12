import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { X, FileText, AlertCircle, ArrowRight, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { trackEvent } from '../services/trackingService';
import CaptchaField from './CaptchaField';
import { popupManager } from '../lib/popupManager';

export default function ExitIntentPopup() {
  return null;
}
