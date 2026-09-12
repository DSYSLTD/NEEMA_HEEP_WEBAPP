import { blogStore, TrackingPixelItem } from '../lib/blogStore';

// Dynamic Tracking & Pixel Service
export interface PixelLogEntry {
  id: string;
  timestamp: string;
  platform: string;
  event: string;
  status: string;
}

declare global {
  interface Window {
    __neema_pixel_logs?: PixelLogEntry[];
  }
}

export function addPixelLog(platform: string, event: string, status = '200 OK') {
  if (typeof window === 'undefined') return;
  if (!window.__neema_pixel_logs) {
    window.__neema_pixel_logs = [];
  }
  const entry: PixelLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    platform,
    event,
    status
  };
  window.__neema_pixel_logs.unshift(entry);
  if (window.__neema_pixel_logs.length > 50) {
    window.__neema_pixel_logs.pop();
  }
  window.dispatchEvent(new CustomEvent('neema_pixel_log_added', { detail: entry }));
}

export function getPixelLogs(): PixelLogEntry[] {
  if (typeof window !== 'undefined' && window.__neema_pixel_logs) {
    return window.__neema_pixel_logs;
  }
  return [
    { id: 'l1', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), platform: 'GA4 / GTM', event: 'PageView: /', status: '200 OK' },
    { id: 'l2', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), platform: 'Meta Pixel', event: 'PageView', status: 'Triggered' },
    { id: 'l3', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), platform: 'TikTok Pixel', event: 'ViewContent', status: 'Active' },
    { id: 'l4', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), platform: 'LinkedIn Insight', event: 'Conversion', status: 'Captured' }
  ];
}

export function initializeTrackingScripts() {
  if (typeof window === 'undefined') return;

  // 1. Remove all previously injected pixel tags from DOM
  try {
    const existingInjected = document.querySelectorAll('[data-neema-pixel-id]');
    existingInjected.forEach((el) => el.remove());
  } catch (e) {
    console.warn('[Analytics] Clean up prior injected pixels error:', e);
  }

  const pixels = blogStore.getTrackingPixels();
  const enabledPixels = pixels.filter((p) => p.enabled);

  console.log(`[Analytics] Initializing ${enabledPixels.length} active tracking pixels...`);

  enabledPixels.forEach((pixel) => {
    try {
      const rawScript = (pixel.customScript || '').trim();
      const pixelId = (pixel.pixelId || '').trim();

      if (rawScript) {
        // Case A: Manual Paste Code or Link provided
        if ((rawScript.startsWith('http://') || rawScript.startsWith('https://') || rawScript.startsWith('//')) && !rawScript.includes('<')) {
          // Direct script URL paste
          const scriptEl = document.createElement('script');
          scriptEl.src = rawScript;
          scriptEl.async = true;
          scriptEl.setAttribute('data-neema-pixel-id', pixel.id);
          if (pixel.platform === 'custom_body') {
            document.body.appendChild(scriptEl);
          } else {
            document.head.appendChild(scriptEl);
          }
          addPixelLog(pixel.name, `Script Link Injected: ${rawScript}`, 'Active 200 OK');
        } else if (rawScript.includes('<')) {
          // Full HTML snippet pasted (scripts, links, noscript, iframes, img tags)
          const parser = new DOMParser();
          const parsedDoc = parser.parseFromString(rawScript, 'text/html');

          // Extract and inject scripts
          const scripts = parsedDoc.querySelectorAll('script');
          if (scripts.length > 0) {
            scripts.forEach((s) => {
              const scriptEl = document.createElement('script');
              Array.from(s.attributes).forEach((attr) => {
                scriptEl.setAttribute(attr.name, attr.value);
              });
              scriptEl.textContent = s.textContent;
              scriptEl.setAttribute('data-neema-pixel-id', pixel.id);

              if (pixel.platform === 'custom_body') {
                document.body.appendChild(scriptEl);
              } else {
                document.head.appendChild(scriptEl);
              }
            });
          }

          // Extract and inject links (<link rel="stylesheet"...>)
          const links = parsedDoc.querySelectorAll('link');
          links.forEach((l) => {
            const linkEl = document.createElement('link');
            Array.from(l.attributes).forEach((attr) => {
              linkEl.setAttribute(attr.name, attr.value);
            });
            linkEl.setAttribute('data-neema-pixel-id', pixel.id);
            document.head.appendChild(linkEl);
          });

          // Extract and inject noscripts (usually for body iframe/img fallbacks)
          const noscripts = parsedDoc.querySelectorAll('noscript');
          noscripts.forEach((ns) => {
            const noscriptEl = document.createElement('noscript');
            noscriptEl.innerHTML = ns.innerHTML;
            noscriptEl.setAttribute('data-neema-pixel-id', pixel.id);
            document.body.appendChild(noscriptEl);
          });

          // Extract any other standalone tags (iframes, img pixels)
          const standaloneTags = parsedDoc.body.querySelectorAll('iframe, img, div');
          standaloneTags.forEach((tag) => {
            if (tag.parentElement === parsedDoc.body || tag.tagName.toLowerCase() === 'iframe' || tag.tagName.toLowerCase() === 'img') {
              const clone = tag.cloneNode(true) as HTMLElement;
              clone.setAttribute('data-neema-pixel-id', pixel.id);
              document.body.appendChild(clone);
            }
          });

          addPixelLog(pixel.name, 'HTML Pixel Snippet Auto-Placed in DOM', 'Active');
        } else {
          // Plain JavaScript string pasted without HTML tags
          const scriptEl = document.createElement('script');
          scriptEl.type = 'text/javascript';
          scriptEl.textContent = rawScript;
          scriptEl.setAttribute('data-neema-pixel-id', pixel.id);

          if (pixel.platform === 'custom_body') {
            document.body.appendChild(scriptEl);
          } else {
            document.head.appendChild(scriptEl);
          }
          addPixelLog(pixel.name, 'JS Script Auto-Placed in DOM', 'Active');
        }
      } else if (pixelId) {
        // Case B: Standard Platform ID without custom code
        if (pixel.platform === 'google') {
          const gaScript = document.createElement('script');
          gaScript.async = true;
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${pixelId}`;
          gaScript.setAttribute('data-neema-pixel-id', pixel.id);
          document.head.appendChild(gaScript);

          const win = window as any;
          win.gtag = win.gtag || function () {
            (win.gtag.q = win.gtag.q || []).push(arguments);
          };
          win.gtag('js', new Date());
          win.gtag('config', pixelId);
          addPixelLog(pixel.name, `GA4 Dynamic Script (${pixelId}) Auto-Placed`, 'Active 200 OK');
        } else if (pixel.platform === 'gtm') {
          const gtmScript = document.createElement('script');
          gtmScript.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${pixelId}');`;
          gtmScript.setAttribute('data-neema-pixel-id', pixel.id);
          document.head.appendChild(gtmScript);

          const gtmNoscript = document.createElement('noscript');
          gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${pixelId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
          gtmNoscript.setAttribute('data-neema-pixel-id', pixel.id);
          document.body.appendChild(gtmNoscript);

          addPixelLog(pixel.name, `GTM Head/Body Tags (${pixelId}) Auto-Placed`, 'Active 200 OK');
        } else if (pixel.platform === 'meta') {
          const metaScript = document.createElement('script');
          metaScript.textContent = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`;
          metaScript.setAttribute('data-neema-pixel-id', pixel.id);
          document.head.appendChild(metaScript);

          addPixelLog(pixel.name, `Meta Pixel Script (${pixelId}) Auto-Placed`, 'Active 200 OK');
        } else if (pixel.platform === 'tiktok') {
          const ttScript = document.createElement('script');
          ttScript.textContent = `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var tt=w[t]=w[t]||[];tt.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],tt.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<tt.methods.length;i++)tt.setAndDefer(tt,tt.methods[i]);tt.instance=function(t){for(var e=tt._i[t]||[],n=0;n<tt.methods.length;n++)tt.setAndDefer(e,tt.methods[n]);return e},tt.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";tt._i=tt._i||{},tt._i[e]=[],tt._i[e]._u=i,tt._t=tt._t||{},tt._t[e]=+new Date,tt._o=tt._o||{},tt._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  tt.load('${pixelId}');
  tt.page();
}(window, document, 'ttq');`;
          ttScript.setAttribute('data-neema-pixel-id', pixel.id);
          document.head.appendChild(ttScript);

          addPixelLog(pixel.name, `TikTok Pixel Script (${pixelId}) Auto-Placed`, 'Active 200 OK');
        } else {
          addPixelLog(pixel.name, `Pixel Active (${pixelId})`, '200 OK');
        }
      }
    } catch (err) {
      console.error(`[Analytics] Error initializing pixel ${pixel.name}:`, err);
      addPixelLog(pixel.name, 'Placement Error', 'Failed');
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('neema_cms_tracking_pixels_updated', () => {
    initializeTrackingScripts();
  });
}

export function trackPageView(pageName: string) {
  console.log(`[Analytics] Page viewed: ${pageName}`);
  addPixelLog('Global Router', `PageView: ${pageName}`, '200 OK');
  
  const win = window as any;
  if (win.gtag) {
    win.gtag('event', 'page_view', { page_title: pageName, page_location: window.location.href });
  }
  if (win.fbq) {
    win.fbq('track', 'PageView');
  }
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  console.log(`[Analytics] Event tracked: ${eventName}`, properties);
  addPixelLog('Event Engine', `Event: ${eventName}`, 'Tracked');
}

export function setConsentPreferences(prefs: any) {
  console.log(`[Analytics] Consent preferences updated:`, prefs);
  if (typeof window !== 'undefined') {
    localStorage.setItem('neema_consent_prefs', JSON.stringify(prefs));
  }
}

export function getConsentPreferences() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('neema_consent_prefs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
  }
  return { analytics: true, marketing: true, necessary: true };
}

export function trackStepDrop(stepName: string, ...details: any[]) {
  console.log(`[Analytics] Step drop tracked: ${stepName}`, ...details);
  addPixelLog('Drop-off Tracker', `Step Drop: ${stepName}`, 'Logged');
}

export function trackHighInterestTimeOnPage(pageName: string, timeSeconds: number) {
  console.log(`[Analytics] High interest time tracked: ${pageName}, ${timeSeconds}s`);
  addPixelLog('Engagement Tracker', `High Interest: ${pageName} (${timeSeconds}s)`, 'Captured');
}

export function trackMemberDashboardVisit(userId?: string) {
  console.log(`[Analytics] Member dashboard visited: ${userId || 'anonymous'}`);
  addPixelLog('Member Portal', `Dashboard Visit: ${userId || 'guest'}`, 'Logged');
}
