export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'archive';

export type ViewMode = 'grid' | 'list' | 'compact' | 'gallery' | 'timeline';

export type FolderColor = 'emerald' | 'gold' | 'blue' | 'purple' | 'amber' | 'rose' | 'gray';

export interface FolderPermission {
  role: 'Site Admin' | 'Editor' | 'Author' | 'Moderator' | 'Webmaster';
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  colorLabel: FolderColor;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  totalSize: number; // in bytes
  isSystemFolder?: boolean;
  permissions?: FolderPermission[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  mediaIds: string[];
  isSystemCollection?: boolean;
  createdAt: string;
  updatedAt: string;
  shareUrl?: string;
}

export interface MediaUsageLocation {
  id: string;
  title: string;
  type: 'Article' | 'Category' | 'Profile' | 'Beneficiary' | 'Vacancy' | 'Comment' | 'SEO' | 'Marketing';
  url: string;
  updatedAt: string;
}

export interface ResponsiveSizes {
  thumbnailSmall: string;  // 150x150
  thumbnailMedium: string; // 300x300
  thumbnailLarge: string;  // 600x600
  featured: string;        // 1200x630
  socialOg: string;        // 1200x630
  twitterCard: string;     // 800x418
}

export interface AIMetadata {
  generatedAltText?: string;
  generatedCaption?: string;
  generatedDescription?: string;
  suggestedFileName?: string;
  suggestedKeywords?: string[];
  qualityScore?: number; // 0-100
  seoScore?: number;     // 0-100
  moderationStatus?: 'Pass' | 'Flagged' | 'Review Required';
  accessibilityStatus?: 'Compliant' | 'Missing Alt Text' | 'Low Contrast';
  isDuplicate?: boolean;
  similarMediaIds?: string[];
}

export interface DetailedMetadata {
  filename: string;
  displayName: string;
  altText: string;
  caption: string;
  description: string;
  keywords: string[];
  copyright: string;
  photographer: string;
  author: string;
  license: 'CC-BY-4.0' | 'Proprietary - Neema HEEP' | 'Public Domain' | 'All Rights Reserved';
  expiryDate?: string;
  source?: string;
  version: number;
  colorPalette?: string[];
  orientation?: 'landscape' | 'portrait' | 'square';
}

export interface MediaItem {
  id: string;
  filename: string;
  displayName: string;
  fileType: MediaType;
  mimeType: string;
  extension: string;
  size: number; // bytes
  formattedSize: string;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio?: string;
  };
  duration?: number; // for audio/video in seconds
  src: string;
  thumbnailUrl: string;
  webpUrl?: string;
  avifUrl?: string;
  responsiveSizes?: ResponsiveSizes;
  uploadDate: string;
  uploadedBy: string;
  folderId: string;
  folderName: string;
  collectionIds: string[];
  tags: string[];
  status: 'Optimized' | 'Needs Alt Text' | 'Unused' | 'Duplicate' | 'Processing';
  usageCount: number;
  usageLocations: MediaUsageLocation[];
  metadata: DetailedMetadata;
  aiMetadata: AIMetadata;
  isDeleted?: boolean;
  deletedAt?: string;
  checksum?: string;
  downloadsCount: number;
  viewsCount: number;
  compressedSize?: number; // bytes
  compressionRatio?: number; // e.g. 42%
}

export interface MediaAnalytics {
  totalFiles: number;
  totalSize: number; // bytes
  sizeByType: Record<MediaType, number>;
  countByType: Record<MediaType, number>;
  optimizedCount: number;
  needsAltCount: number;
  unusedCount: number;
  duplicatesCount: number;
  totalSavingsBytes: number;
  topDownloaded: MediaItem[];
  topViewed: MediaItem[];
  recentActivities: {
    id: string;
    action: string;
    mediaName: string;
    timestamp: string;
    user: string;
  }[];
}

export interface ImageEditOptions {
  crop?: { x: number; y: number; width: number; height: number; aspectRatio?: string };
  resize?: { width: number; height: number };
  rotate?: number; // degrees
  flipH?: boolean;
  flipV?: boolean;
  brightness?: number; // 0-200%
  contrast?: number;   // 0-200%
  saturation?: number; // 0-200%
  sharpen?: number;    // 0-100%
  blur?: number;       // 0-100%
  watermark?: {
    text: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'center';
    opacity: number;
  };
}

export type DAMSubModule = 
  | 'library' 
  | 'folders' 
  | 'collections' 
  | 'uploads' 
  | 'recently_added' 
  | 'trash' 
  | 'dashboard';
