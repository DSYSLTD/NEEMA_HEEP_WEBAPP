import React from 'react';

export interface HelmetProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  children?: React.ReactNode;
}

function setMetaTag(selector: string, attr: 'name' | 'property', value: string, content: string) {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalUrl(url: string) {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function Helmet({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  publishedTime,
  modifiedTime,
  author,
  children
}: HelmetProps) {
  React.useEffect(() => {
    // 1. Page Title
    if (title) {
      if (title.includes('Neema') || title.includes('NEEMA')) {
        document.title = title;
      } else {
        document.title = `${title} | Neema HEEP Microfinance`;
      }
    }

    // 2. Standard Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', 'name', 'description', description);
    }

    // 3. Canonical URL
    if (canonicalUrl) {
      setCanonicalUrl(canonicalUrl);
    }

    // 4. OpenGraph Tags
    if (ogTitle || title) {
      setMetaTag('meta[property="og:title"]', 'property', 'og:title', ogTitle || title || '');
    }
    if (ogDescription || description) {
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', ogDescription || description || '');
    }
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    }
    if (canonicalUrl) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    }
    if (publishedTime) {
      setMetaTag('meta[property="article:published_time"]', 'property', 'article:published_time', publishedTime);
    }
    if (modifiedTime) {
      setMetaTag('meta[property="article:modified_time"]', 'property', 'article:modified_time', modifiedTime);
    }
    if (author) {
      setMetaTag('meta[property="article:author"]', 'property', 'article:author', author);
    }

    // 5. Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    if (ogTitle || title) {
      setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', ogTitle || title || '');
    }
    if (ogDescription || description) {
      setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', ogDescription || description || '');
    }
    if (ogImage) {
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    }
  }, [title, description, canonicalUrl, ogTitle, ogDescription, ogImage, publishedTime, modifiedTime, author]);

  return <>{children}</>;
}

export default Helmet;
