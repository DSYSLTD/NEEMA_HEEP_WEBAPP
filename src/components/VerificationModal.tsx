import { useEffect } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  email?: string;
  phone?: string;
  onVerified: () => void;
  onClose: () => void;
}

export default function VerificationModal({
  isOpen,
  onVerified,
}: VerificationModalProps) {
  useEffect(() => {
    if (isOpen) {
      onVerified();
    }
  }, [isOpen, onVerified]);

  return null;
}
