import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // When the path changes, scroll to top so we don't start at the footer.
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);

  return null;
}

