import { BLOG_POSTS } from './blogData';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  postCount?: number;
  color?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  date: string;
  status: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  type?: string;
  date?: string;
  uploadDate?: string;
  filename?: string;
  size?: string;
  alt?: string;
  altText?: string;
  description?: string;
  mediaType?: string;
  thumbnail?: string;
  dimensions?: string;
  optimized?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  enableComments: boolean;
  maintenanceMode: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'x' | 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'whatsapp' | 'telegram' | 'threads' | 'pinterest' | string;
  name: string;
  url: string;
  enabled: boolean;
}

export interface TrackingPixelItem {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'gtm' | 'tiktok' | 'linkedin' | 'twitter' | 'pinterest' | 'custom_head' | 'custom_body' | string;
  pixelId?: string;
  customScript?: string;
  enabled: boolean;
  status?: string;
}

export interface WhatsAppSettings {
  floatingButtonEnabled: boolean;
  phoneNumber: string;
  position: 'bottom-right' | 'bottom-left';
  tooltipText: string;
  liveChatEnabled: boolean;
  agentName: string;
  greetingText: string;
  prefilledTextEnabled: boolean;
  prefilledText: string;
  thirdPartyScriptEnabled: boolean;
  thirdPartyScript: string;
  metaPixelEnabled: boolean;
  metaPixelId: string;
  syncCatalog: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status?: string;
}

export interface BlogBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'quote' | 'headline' | 'text' | 'tip' | 'cta' | string;
  content: string;
  settings?: any;
}

export interface Beneficiary {
  id: string;
  name: string;
  story?: string;
  location: string;
  image?: string;
  loanType?: string;
  businessType?: string;
  status?: string;
  photoUrl?: string;
  impactStory?: string;
  amountDisbursed?: string;
  dateAdded?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  desc?: string;
  description?: string;
  salary?: string;
  status?: string;
  deadline?: string;
  requirements?: any;
  applicantsCount?: number;
}

export interface BlogPostItem {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  authorName: string;
  authorInitials: string;
  authorId?: string;
  authorRole?: string;
  authorAvatar?: string;
  image?: string;
  content?: string;
  blocks?: any[];
  status?: string;
  likes?: number;
  tags?: string[];
  views?: number;
  readTime?: string;
  isFeatured?: boolean;
  revisions?: any[];
  seo?: { metaTitle?: string; metaDescription?: string; focusKeywords?: string; focusKeyword?: string; ogTitle?: string; ogImage?: string; twitterCard?: string; canonicalUrl?: string; schemaType?: string };
}

export interface BlogComment {
  id: string;
  postSlug: string;
  name: string;
  email: string;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Spam' | string;
  authorName?: string;
  authorEmail?: string;
  content?: string;
  postTitle?: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
  initials?: string;
  bio?: string;
  status?: string;
  createdAt?: string;
  socials?: any;
}

// Reset initial data to empty array - only database rows will be displayed
let storedPosts: BlogPostItem[] = [];

const mockAuthors: BlogAuthor[] = [
  {
    id: 'auth_pm',
    name: 'Patrick Munene',
    role: 'Superadmin & Managing Director',
    email: 'ptrckmunene@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=70&w=200&auto=format&fit=crop',
    bio: 'Pioneer in Kenyan microfinance and rural economic development, leading Neema Heep expansion since 2010.',
  }
];

const mockComments: BlogComment[] = [];

let blacklistedEmails: string[] = [];
let mockUsers = [
  { id: 'u1', name: 'Patrick Munene', email: 'ptrckmunene@gmail.com', role: 'Superadmin' }
];

let storedCategoriesList: BlogCategory[] = [];
let storedTagsList: BlogTag[] = [];

let storedMedia: any[] = [];
let storedBeneficiaries: any[] = [];
let storedVacancies: any[] = [];

let storedSocialLinks: SocialLinkItem[] = [
  { id: 's-fb', platform: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/NeemaHeepOrganization', enabled: true },
  { id: 's-x', platform: 'x', name: 'X (Twitter)', url: 'https://x.com/NeemaHeepLtd', enabled: true },
  { id: 's-ig', platform: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/neemaheep', enabled: true },
  { id: 's-li', platform: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/neema-heep-ltd', enabled: true },
  { id: 's-tt', platform: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@neema.heep.ltd', enabled: true },
  { id: 's-yt', platform: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@neemaheep', enabled: true },
  { id: 's-wa', platform: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/254705759365', enabled: true },
];

let storedTrackingPixels: TrackingPixelItem[] = [
  { id: 'px-ga4', name: 'Google Analytics 4 (GA4)', platform: 'google', pixelId: 'G-NEEMAHEEP01', enabled: true, status: 'Active' },
  { id: 'px-gtm', name: 'Google Tag Manager', platform: 'gtm', pixelId: 'GTM-NMH8899', enabled: true, status: 'Active' },
  { id: 'px-meta', name: 'Meta / Facebook Pixel & CAPI', platform: 'meta', pixelId: '9876543210123', customScript: '<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,\'script\',\n\'https://connect.facebook.net/en_US/fbevents.js\');\nfbq(\'init\', \'9876543210123\');\nfbq(\'track\', \'PageView\');\n</script>', enabled: true, status: 'Active' },
  { id: 'px-tiktok', name: 'TikTok Pixel', platform: 'tiktok', pixelId: 'TT-NEEMA-8899', customScript: '<script>\n!function (w, d, t) {\n  w.TiktokAnalyticsObject=t;var tt=w[t]=w[t]||[];tt.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],tt.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<tt.methods.length;i++)tt.setAndDefer(tt,tt.methods[i]);tt.instance=function(t){for(var e=tt._i[t]||[],n=0;n<tt.methods.length;n++)tt.setAndDefer(e,tt.methods[n]);return e},tt.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";tt._i=tt._i||{},tt._i[e]=[],tt._i[e]._u=i,tt._t=tt._t||{},tt._t[e]=+new Date,tt._o=tt._o||{},tt._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};\n  tt.load(\'TT-NEEMA-8899\');\n  tt.page();\n}(window, document, \'ttq\');\n</script>', enabled: true, status: 'Active' },
  { id: 'px-linkedin', name: 'LinkedIn Insight Tag', platform: 'linkedin', pixelId: 'LI-774411', enabled: true, status: 'Active' },
  { id: 'px-twitter', name: 'Twitter / X Pixel', platform: 'twitter', pixelId: 'o1234', enabled: false, status: 'Inactive' },
  { id: 'px-pinterest', name: 'Pinterest Tag', platform: 'pinterest', pixelId: '26123456789', enabled: false, status: 'Inactive' },
  { id: 'px-custom-head', name: 'Custom Header Pixel Snippet', platform: 'custom_head', customScript: '<!-- Custom Header Tracking Script -->\n<script>\n  console.log("[Neema Tracking] Custom Header Script Executed");\n</script>', enabled: true, status: 'Active' },
  { id: 'px-custom-body', name: 'Custom Body / Footer Pixel Snippet', platform: 'custom_body', customScript: '<!-- Custom Body NoScript / Tracking -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NMH8899" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>', enabled: true, status: 'Active' },
];

export const blogStore = {
  getPosts(): BlogPostItem[] {
    return storedPosts;
  },

  savePosts(posts: BlogPostItem[]) {
    storedPosts = posts;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neema_cms_posts_updated'));
    }
    return storedPosts;
  },

  getComments(): BlogComment[] {
    return mockComments;
  },

  saveComments(comments: BlogComment[]) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neema_cms_comments_updated'));
    }
    return comments;
  },

  getAuthors(): BlogAuthor[] {
    return mockAuthors;
  },

  saveAuthors(authors: BlogAuthor[]) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neema_cms_authors_updated'));
    }
    return authors;
  },

  updateAuthor(author: BlogAuthor) {
    return author;
  },

  approveAuthor(id: string) {
    return true;
  },

  rejectAuthor(id: string) {
    return true;
  },

  deleteAuthor(id: string) {
    return true;
  },

  getCategories(): BlogCategory[] {
    return storedCategoriesList.map((cat) => ({
      ...cat,
      postCount: storedPosts.filter((p) => p.category === cat.name).length
    }));
  },

  getTags(): BlogTag[] {
    return storedTagsList.map((tag) => ({
      ...tag,
      postCount: storedPosts.filter((p) => p.tags && p.tags.includes(tag.name)).length
    }));
  },

  getSubscribers() {
    return [
      { id: 's1', email: 'subscriber@example.com', date: '2026-02-20', status: 'Active' }
    ];
  },

  getSettings(): SiteSettings {
    return {
      siteName: 'Neema HEEP Microfinance',
      tagline: 'Empowering Communities, Transforming Lives',
      contactEmail: 'info@neemaheep.com',
      contactPhone: '0705 759 365',
      enableComments: true,
      maintenanceMode: false
    };
  },

  getBeneficiaries() {
    return storedBeneficiaries;
  },

  getVacancies() {
    if ((!storedVacancies || storedVacancies.length === 0) && typeof window !== 'undefined') {
      const saved = localStorage.getItem('neema_vacancies_data');
      if (saved) {
        try {
          storedVacancies = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return storedVacancies;
  },

  saveCategories(cats: any[]) {
    storedCategoriesList = cats.map((c, i) => {
      if (typeof c === 'string') {
        return {
          id: `cat_${i}_${Date.now()}`,
          name: c,
          slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          color: '#074504'
        };
      }
      return c;
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neema_cms_categories_updated'));
    }
  },

  saveTags(tags: any[]) {
    storedTagsList = tags.map((t, i) => {
      if (typeof t === 'string') {
        return {
          id: `tag_${i}_${Date.now()}`,
          name: t,
          slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        };
      }
      return t;
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('neema_cms_tags_updated'));
    }
  },

  getMedia() {
    return storedMedia;
  },

  saveMedia(media: any[]) {
    storedMedia = media;
  },

  updateMediaItem(item: any) {
    return item;
  },

  deleteMediaItem(id: string) {
    storedMedia = storedMedia.filter(m => m.id !== id);
  },

  saveBeneficiaries(b: any[]) {
    storedBeneficiaries = b;
  },

  saveVacancies(v: any[]) {
    storedVacancies = v;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('neema_vacancies_data', JSON.stringify(v));
      } catch (e) {
        console.error(e);
      }
      window.dispatchEvent(new CustomEvent('neema_cms_vacancies_updated'));
      window.dispatchEvent(new CustomEvent('neema_vacancies_updated'));
    }
  },

  addComment(comment: any) {
    const newComment: BlogComment = {
      id: `c_${Date.now()}`,
      postSlug: comment.postSlug || '',
      name: comment.name || comment.authorName || 'Anonymous',
      email: comment.email || comment.authorEmail || '',
      comment: comment.comment || comment.content || '',
      authorName: comment.name || comment.authorName || 'Anonymous',
      authorEmail: comment.email || comment.authorEmail || '',
      content: comment.comment || comment.content || '',
      postTitle: comment.postTitle || '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Approved',
    };
    mockComments.push(newComment);
    return newComment;
  },

  unblacklistCommenter(email: string) {
    blacklistedEmails = blacklistedEmails.filter(e => e !== email);
  },

  blacklistCommenter(email: string) {
    if (!blacklistedEmails.includes(email)) blacklistedEmails.push(email);
  },

  getBlacklistedEmails(): string[] {
    return blacklistedEmails;
  },

  updateUserRole(userId: string, role: string) {
    mockUsers = mockUsers.map(u => u.id === userId ? { ...u, role } : u);
  },

  getUsers() {
    return mockUsers;
  },

  saveUsers(users: any[]) {
    mockUsers = users;
  },

  exportBackupJSON() {
    return JSON.stringify({ posts: storedPosts, comments: mockComments, authors: mockAuthors });
  },

  importBackupJSON(jsonStr: string) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.posts) storedPosts = data.posts;
      return true;
    } catch (e) {
      return false;
    }
  },

  calculateSeoScore(post: any) {
    const score = Math.min(100, Math.max(50, (post?.title?.length || 0) * 2 + (post?.excerpt?.length || 0)));
    return { score, grade: score > 80 ? 'Good' : 'Needs Improvement' };
  },

  getSocialLinks(): SocialLinkItem[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neema_cms_social_links');
      if (saved) {
        try {
          storedSocialLinks = JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    const EXCLUDED = ['telegram', 'threads', 'pinterest'];
    return storedSocialLinks.filter((item) => {
      const p = (item.platform || '').toLowerCase();
      const u = (item.url || '').toLowerCase();
      return !EXCLUDED.includes(p) && !u.includes('t.me') && !u.includes('threads.net') && !u.includes('pinterest.com');
    });
  },

  saveSocialLinks(links: SocialLinkItem[]) {
    storedSocialLinks = links;
    if (typeof window !== 'undefined') {
      localStorage.setItem('neema_cms_social_links', JSON.stringify(links));
      window.dispatchEvent(new CustomEvent('neema_cms_social_links_updated', { detail: links }));
    }
    return storedSocialLinks;
  },

  getTrackingPixels(): TrackingPixelItem[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neema_cms_tracking_pixels');
      if (saved) {
        try {
          storedTrackingPixels = JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return storedTrackingPixels;
  },

  saveTrackingPixels(pixels: TrackingPixelItem[]) {
    storedTrackingPixels = pixels;
    if (typeof window !== 'undefined') {
      localStorage.setItem('neema_cms_tracking_pixels', JSON.stringify(pixels));
      window.dispatchEvent(new CustomEvent('neema_cms_tracking_pixels_updated', { detail: pixels }));
    }
    return storedTrackingPixels;
  },

  getWhatsAppSettings(): WhatsAppSettings {
    const defaultSettings: WhatsAppSettings = {
      floatingButtonEnabled: true,
      phoneNumber: '+254705759365',
      position: 'bottom-right',
      tooltipText: 'Chat with NEEMA HEEP Support',
      liveChatEnabled: true,
      agentName: 'NEEMA HEEP Loan Specialist',
      greetingText: 'Jambo! How can we assist with your loan application or community program today?',
      prefilledTextEnabled: true,
      prefilledText: "Hi! I'm visiting your website and would like to learn more about your loan products and pre-qualification checklist.",
      thirdPartyScriptEnabled: true,
      thirdPartyScript: '<script src="https://static.whatsapp.com/widget/v2.js" data-chat-id="neema-heep-001"></script>',
      metaPixelEnabled: true,
      metaPixelId: '128492049102941',
      syncCatalog: true,
    };

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neema_cms_whatsapp_settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (e) {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  },

  saveWhatsAppSettings(settings: WhatsAppSettings) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('neema_cms_whatsapp_settings', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('neema_cms_whatsapp_settings_updated', { detail: settings }));
    }
    return settings;
  },
};

