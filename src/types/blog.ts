export type ArticleType = 'Financial Literacy' | 'News';

export type BlockType = 'text' | 'image' | 'list' | 'loan-product' | 'cta' | 'testimonial' | 'tip' | 'step' | 'headline' | 'highlights' | 'announcement';

export interface BlogBlock {
  id: string;
  type: BlockType;
  content: any;
  settings?: Record<string, any>;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  type: ArticleType;
  featuredImage?: string;
  status: 'Draft' | 'Published' | 'Scheduled';
  publishDate: string;
  categories: string[];
  tags: string[];
  discussion: 'Open' | 'Closed';
  author: string;
  blocks: BlogBlock[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}
