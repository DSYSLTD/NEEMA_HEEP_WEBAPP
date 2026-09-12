import React from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function Helmet({ title, children }: HelmetProps) {
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | Neema Heep Microfinance`;
    }
  }, [title]);

  return <>{children}</>;
}

export default Helmet;
