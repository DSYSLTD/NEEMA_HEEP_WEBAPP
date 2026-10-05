import { supabase } from '../lib/supabase';
import { BlogPostItem, blogStore } from '../lib/blogStore';

export const BLOG_STORAGE_BUCKET = 'blog-images';

/**
 * Normalizes raw Supabase database row or API response into application BlogPostItem model
 */
export function normalizeArticleRow(row: any): BlogPostItem {
  const seoData = typeof row.seo === 'object' && row.seo !== null ? row.seo : {};
  const blocksData = Array.isArray(row.blocks) ? row.blocks : [];
  const tagsData = Array.isArray(row.tags) ? row.tags : [];

  const rawDate = row.published_at || row.created_at || new Date().toISOString();
  let formattedDate = rawDate;
  try {
    formattedDate = new Date(rawDate).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    formattedDate = rawDate;
  }

  const finalContent = row.content || (blocksData.length > 0 ? blocksData.map((b: any) => b.content).join(' ') : row.excerpt || '');
  const readMinutes = Math.max(2, Math.ceil(finalContent.split(/\s+/).length / 180));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title || 'Untitled Article',
    excerpt: row.excerpt || row.title || '',
    category: row.category || 'Financial Literacy',
    tags: tagsData,
    date: formattedDate,
    authorId: row.author_id || 'auth_pm',
    authorName: row.author_name || row.author || 'Patrick Munene',
    authorInitials: (row.author_name || row.author || 'Patrick Munene')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    authorRole: row.author_role || 'Author',
    authorAvatar: row.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: row.image || row.featured_image_url || '/imara_loan.jpg',
    readTime: row.read_time || `${readMinutes} min read`,
    views: Number(row.views) || 0,
    likes: Number(row.likes) || 0,
    status: (row.status || 'Published') as any,
    isFeatured: Boolean(row.is_featured),
    blocks: blocksData,
    content: finalContent,
    seo: {
      metaTitle: row.seo_title || seoData.metaTitle || `${row.title} | Neema HEEP Journal`,
      metaDescription: row.seo_description || seoData.metaDescription || row.excerpt,
      ogTitle: seoData.ogTitle || row.title,
      ogImage: seoData.ogImage || row.image || row.featured_image_url,
      twitterCard: seoData.twitterCard || 'summary_large_image',
      canonicalUrl: seoData.canonicalUrl || `https://www.neemaheep.com/blog/${row.slug}`,
      focusKeyword: seoData.focusKeyword || '',
      schemaType: seoData.schemaType || 'BlogPosting'
    }
  };
}

export const articleService = {
  /**
   * Fetch all published articles for public blog display
   * Queries Supabase / server API with status='Published'
   */
  async fetchPublishedArticles(): Promise<BlogPostItem[]> {
    try {
      // 1. Fetch from server API which combines Supabase + persistent store
      const res = await fetch('/api/articles');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.articles)) {
          const mapped = json.articles.map(normalizeArticleRow);
          blogStore.savePosts(mapped);
          return mapped;
        }
      }

      // 2. Direct Supabase query fallback
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .in('status', ['Published', 'published', 'Active'])
        .order('published_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(normalizeArticleRow);
        blogStore.savePosts(mapped);
        return mapped;
      }

      return [];
    } catch (err) {
      console.error('[articleService.fetchPublishedArticles error]:', err);
      return [];
    }
  },

  /**
   * Fetch all articles (including Drafts, Scheduled, Trash) for Admin Dashboard
   */
  async fetchAllArticlesForAdmin(): Promise<BlogPostItem[]> {
    try {
      // 1. Fetch from server API
      const res = await fetch('/api/articles?all=true');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.articles)) {
          const mapped = json.articles.map(normalizeArticleRow);
          blogStore.savePosts(mapped);
          return mapped;
        }
      }

      // 2. Direct Supabase query fallback
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(normalizeArticleRow);
        blogStore.savePosts(mapped);
        return mapped;
      }

      return [];
    } catch (err) {
      console.error('[articleService.fetchAllArticlesForAdmin error]:', err);
      return [];
    }
  },

  /**
   * Retrieve single article by slug
   */
  async getArticleBySlug(slug: string): Promise<BlogPostItem | null> {
    const cleanSlug = slug.trim().toLowerCase();

    // 1. Query server API route
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(cleanSlug)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.article) {
          return normalizeArticleRow(json.article);
        }
      }
    } catch {
      // continue to direct supabase
    }

    // 2. Direct Supabase query
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();

      if (!error && data) {
        return normalizeArticleRow(data);
      }
    } catch (err) {
      console.warn('[Supabase Article By Slug Notice]:', err);
    }

    // 3. Check memory store
    const localMatches = blogStore.getPosts().find(p => p.slug === cleanSlug);
    if (localMatches) return localMatches;

    return null;
  },

  /**
   * Upload featured image to Supabase Storage bucket 'blog-images' (with server static fallback)
   */
  async uploadFeaturedImage(file: File, slugHint?: string): Promise<{ path: string; url: string }> {
    // 1. Validate file
    if (!file) {
      throw new Error('No image file selected.');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file format. Please upload a JPG, PNG, or WebP image.');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File is too large (${Math.round(file.size / (1024 * 1024))}MB). Maximum allowed size is 10MB.`);
    }

    // 2. Convert to Base64 for resilient multi-destination upload
    const base64Promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const fileBase64 = await base64Promise;

    // 3. Post to /api/upload
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          filename: file.name,
          contentType: file.type
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return {
            path: json.path || `uploads/blog/${file.name}`,
            url: json.url
          };
        }
      }
    } catch (apiErr) {
      console.warn('[Server upload notice, attempting direct Supabase Storage]:', apiErr);
    }

    // 4. Direct Supabase Storage fallback
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const safeSlug = (slugHint || 'article')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 32);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const storagePath = `${year}/${month}/${safeSlug}-${uniqueId}.${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BLOG_STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.warn('[Direct Supabase Storage upload error]:', uploadError.message);
      // If all else fails, use object URL for session
      const blobUrl = URL.createObjectURL(file);
      return { path: storagePath, url: blobUrl };
    }

    const { data: publicData } = supabase.storage
      .from(BLOG_STORAGE_BUCKET)
      .getPublicUrl(uploadData.path || storagePath);

    return {
      path: uploadData.path || storagePath,
      url: publicData.publicUrl
    };
  },

  /**
   * Save (create or update) article in Supabase
   */
  async saveArticle(
    articleData: Partial<BlogPostItem>,
    imageFile?: File | null
  ): Promise<{ success: boolean; article: BlogPostItem; error?: string }> {
    // 1. Validation
    if (!articleData.title || !articleData.title.trim()) {
      throw new Error('Article title is required.');
    }

    const cleanTitle = articleData.title.trim();
    const cleanSlug = (articleData.slug || cleanTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `article-${Date.now()}`;

    // 2. Handle featured image upload if a file was selected
    let finalImageUrl = articleData.image || '/imara_loan.jpg';
    let finalImagePath: string | undefined = undefined;

    if (imageFile) {
      try {
        const uploadResult = await this.uploadFeaturedImage(imageFile, cleanSlug);
        finalImageUrl = uploadResult.url;
        finalImagePath = uploadResult.path;
      } catch (uploadErr: any) {
        console.warn('[Image upload warning]:', uploadErr.message);
      }
    }

    // 3. Prepare payload matching Supabase blog_articles schema
    const targetStatus = articleData.status || 'Published';
    const isPublished = targetStatus === 'Published';
    const publishedAt = isPublished
      ? (articleData.date && !articleData.date.includes('ago') ? new Date().toISOString() : new Date().toISOString())
      : null;

    const payload: any = {
      title: cleanTitle,
      slug: cleanSlug,
      excerpt: articleData.excerpt || cleanTitle,
      content: articleData.content || (articleData.blocks?.map(b => b.content).join('\n\n')) || articleData.excerpt || cleanTitle,
      image: finalImageUrl,
      category: articleData.category || 'Financial Literacy',
      author_name: articleData.authorName || 'Patrick Munene',
      author_id: articleData.authorId || 'auth_pm',
      author_role: articleData.authorRole || 'Author',
      author_avatar: articleData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: targetStatus,
      published_at: publishedAt,
      tags: articleData.tags || ['Microfinance', 'Kenya'],
      blocks: articleData.blocks || [],
      seo: {
        metaTitle: articleData.seo?.metaTitle || `${cleanTitle} | Neema HEEP Journal`,
        metaDescription: articleData.seo?.metaDescription || articleData.excerpt || cleanTitle,
        ogTitle: cleanTitle,
        ogImage: finalImageUrl,
        twitterCard: 'summary_large_image',
        canonicalUrl: `https://www.neemaheep.com/blog/${cleanSlug}`,
        focusKeyword: articleData.seo?.focusKeyword || '',
        schemaType: 'BlogPosting'
      },
      views: articleData.views || 0,
      likes: articleData.likes || 0,
      updated_at: new Date().toISOString()
    };

    if (finalImagePath) {
      payload.featured_image_path = finalImagePath;
    }

    let savedRow: any = null;

    // 4. Save via Server API
    try {
      const serverRes = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (serverRes.ok) {
        const json = await serverRes.json();
        if (json.success && json.article) {
          savedRow = json.article;
        }
      }
    } catch (srvErr) {
      console.warn('[Server API save warning, trying direct Supabase]:', srvErr);
    }

    // 5. Also attempt direct Supabase upsert
    try {
      const { data } = await supabase
        .from('blog_articles')
        .upsert([payload], { onConflict: 'slug' })
        .select()
        .maybeSingle();

      if (data) {
        savedRow = data;
      }
    } catch {
      // ignore
    }

    const normalized = savedRow ? normalizeArticleRow(savedRow) : normalizeArticleRow(payload);

    // Update in-memory store & broadcast update
    const existing = blogStore.getPosts();
    const index = existing.findIndex(p => p.slug === normalized.slug || (normalized.id && p.id === normalized.id));
    let updatedList: BlogPostItem[];
    if (index >= 0) {
      updatedList = existing.map((p, i) => i === index ? normalized : p);
    } else {
      updatedList = [normalized, ...existing];
    }
    blogStore.savePosts(updatedList);

    return {
      success: true,
      article: normalized
    };
  },

  /**
   * Change status of an article (e.g. Published <-> Draft <-> Trash)
   */
  async updateArticleStatus(slug: string, newStatus: 'Published' | 'Draft' | 'Trash' | 'Archived'): Promise<boolean> {
    try {
      // 1. Call server API
      await fetch(`/api/articles/${encodeURIComponent(slug)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(() => {});

      // 2. Call direct Supabase
      await supabase
        .from('blog_articles')
        .update({
          status: newStatus,
          published_at: newStatus === 'Published' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug);

      // Update store
      const current = blogStore.getPosts();
      const updated = current.map(p => p.slug === slug ? { ...p, status: newStatus as any } : p);
      blogStore.savePosts(updated);
      return true;
    } catch (err) {
      console.error('[updateArticleStatus error]:', err);
      return false;
    }
  },

  /**
   * Delete article permanently from Supabase
   */
  async deleteArticle(slug: string): Promise<boolean> {
    try {
      const current = blogStore.getPosts().find(p => p.slug === slug);

      // 1. Call server API
      await fetch(`/api/articles/${encodeURIComponent(slug)}`, {
        method: 'DELETE'
      }).catch(() => {});

      // 2. Direct Supabase delete
      await supabase
        .from('blog_articles')
        .delete()
        .eq('slug', slug);

      // Safe image cleanup
      if (current?.image && current.image.includes(BLOG_STORAGE_BUCKET)) {
        try {
          const urlParts = current.image.split(`${BLOG_STORAGE_BUCKET}/`);
          if (urlParts[1]) {
            const storagePath = decodeURIComponent(urlParts[1].split('?')[0]);
            const otherUses = blogStore.getPosts().some(p => p.slug !== slug && p.image?.includes(storagePath));
            if (!otherUses) {
              await supabase.storage.from(BLOG_STORAGE_BUCKET).remove([storagePath]);
            }
          }
        } catch {
          // ignore
        }
      }

      // Update store
      const remaining = blogStore.getPosts().filter(p => p.slug !== slug);
      blogStore.savePosts(remaining);
      return true;
    } catch (err) {
      console.error('[deleteArticle error]:', err);
      return false;
    }
  }
};
