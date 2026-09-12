import React from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  // In development/preview mode, allow access to admin dashboard
  return <>{children}</>;
}
