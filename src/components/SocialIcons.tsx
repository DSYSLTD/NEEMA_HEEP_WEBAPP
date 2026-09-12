import React, { useState, useEffect } from 'react';
import { Facebook, Linkedin, Instagram, Youtube, MessageCircle, Send, Pin, AtSign } from 'lucide-react';
import { blogStore, SocialLinkItem } from '../lib/blogStore';

export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.52-1.36 2.53-.02.94.39 1.88 1.12 2.45.82.66 1.95.84 2.94.51.99-.31 1.78-1.14 2.01-2.16.14-.62.13-1.27.13-1.91.01-4.78 0-9.56.01-14.34z" />
    </svg>
  );
}

export function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.762-.168.712-.43 1.025-.683 1.049-.553.051-.973-.365-1.508-.716-.838-.549-1.312-.89-2.126-1.426-.941-.62-.331-.96.205-1.517.14-.145 2.574-2.359 2.622-2.562.006-.025.011-.12-.045-.17-.056-.05-.138-.033-.198-.02-.084.018-1.428.908-4.032 2.667-.381.262-.727.391-1.037.384-.342-.008-1.001-.194-1.49-.353-.601-.195-1.08-.298-1.038-.63.022-.173.261-.35.717-.531 2.808-1.223 4.682-2.031 5.621-2.424 2.677-1.116 3.235-1.31 3.596-1.316.08 0 .258.02.373.114.097.08.125.188.137.264.012.077.027.251.015.388z" />
    </svg>
  );
}

export function ThreadsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12.186 24c-3.195 0-5.83-1.032-7.832-3.067C2.28 18.825 1.258 15.938 1.3 12.333c.046-3.834 1.153-6.903 3.29-9.12C6.732.99 9.59 0 13.062 0c3.553 0 6.47 1.01 8.67 3.003 2.155 1.95 3.195 4.707 3.09 8.196-.062 2.05-.596 3.863-1.587 5.387-1.1 1.69-2.678 2.894-4.562 3.481-1.062.331-2.181.428-3.328.288-1.341-.163-2.483-.697-3.393-1.588-.71-.696-1.196-1.554-1.446-2.553a5.53 5.53 0 0 1-.225-1.597c0-1.178.291-2.191.865-3.01.574-.82 1.385-1.411 2.41-1.758a8.87 8.87 0 0 1 2.852-.361c.642.023 1.253.09 1.83.2.062-.572.03-1.082-.095-1.53-.223-.799-.683-1.42-1.37-1.848-.687-.428-1.523-.623-2.507-.584-1.013.039-1.884.354-2.589.946-.705.592-1.109 1.385-1.21 2.38H5.801c.148-2.146 1.002-3.87 2.56-5.172C10.02.83 12.072.2 14.718.2c2.428 0 4.417.654 5.918 1.962 1.501 1.308 2.227 3.082 2.158 5.322l-.121 4.542c-.035 1.32.228 2.378.789 3.174.561.796 1.343 1.22 2.346 1.27h.181v3.29h-.181c-1.888-.088-3.376-.807-4.464-2.158-.727.818-1.616 1.442-2.668 1.872-1.052.43-2.227.604-3.525.522z" />
    </svg>
  );
}

export function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026l.032-.026z" />
    </svg>
  );
}

export function renderPlatformIcon(platform: string, className = "w-3.5 h-3.5") {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className={className} />;
    case 'x':
    case 'twitter':
      return <XIcon className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'tiktok':
      return <TikTokIcon className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'whatsapp':
      return <WhatsAppIcon className={className} />;
    case 'telegram':
      return <TelegramIcon className={className} />;
    case 'threads':
      return <ThreadsIcon className={className} />;
    case 'pinterest':
      return <PinterestIcon className={className} />;
    default:
      return <Facebook className={className} />;
  }
}

export function HeaderSocialIcons() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);

  useEffect(() => {
    setLinks(blogStore.getSocialLinks());

    const handleUpdate = () => {
      setLinks(blogStore.getSocialLinks());
    };

    window.addEventListener('neema_cms_social_links_updated', handleUpdate);
    return () => window.removeEventListener('neema_cms_social_links_updated', handleUpdate);
  }, []);

  const EXCLUDED = ['telegram', 'threads', 'pinterest'];
  const activeLinks = links.filter((l) => {
    if (!l.enabled || !l.url.trim()) return false;
    const p = (l.platform || '').toLowerCase();
    const u = (l.url || '').toLowerCase();
    return !EXCLUDED.includes(p) && !u.includes('t.me') && !u.includes('threads.net') && !u.includes('pinterest.com');
  });

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {activeLinks.map((item) => (
        <a 
          key={item.id}
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#C0991B] flex items-center justify-center transition-all text-white hover:text-[#074504] hover:scale-110"
          title={item.name}
          aria-label={item.name}
        >
          {renderPlatformIcon(item.platform, "w-2.5 h-2.5")}
        </a>
      ))}
    </div>
  );
}

export function FooterSocialIcons() {
  const [links, setLinks] = useState<SocialLinkItem[]>([]);

  useEffect(() => {
    setLinks(blogStore.getSocialLinks());

    const handleUpdate = () => {
      setLinks(blogStore.getSocialLinks());
    };

    window.addEventListener('neema_cms_social_links_updated', handleUpdate);
    return () => window.removeEventListener('neema_cms_social_links_updated', handleUpdate);
  }, []);

  const EXCLUDED = ['telegram', 'threads', 'pinterest'];
  const activeLinks = links.filter((l) => {
    if (!l.enabled || !l.url.trim()) return false;
    const p = (l.platform || '').toLowerCase();
    const u = (l.url || '').toLowerCase();
    return !EXCLUDED.includes(p) && !u.includes('t.me') && !u.includes('threads.net') && !u.includes('pinterest.com');
  });

  return (
    <div className="flex items-center gap-2 xl:gap-3 flex-wrap">
      {activeLinks.map((item) => (
        <a 
          key={item.id}
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#599200] hover:border-transparent transition-all shadow-xs group hover:-translate-y-1"
          title={item.name}
          aria-label={item.name}
        >
          <span className="text-white/80 group-hover:text-white transition-colors">
            {renderPlatformIcon(item.platform, "w-3.5 h-3.5")}
          </span>
        </a>
      ))}
    </div>
  );
}

export default function SocialIcons() {
  return <HeaderSocialIcons />;
}
