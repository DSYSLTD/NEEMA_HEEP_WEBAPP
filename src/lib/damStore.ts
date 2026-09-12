import { 
  MediaItem, Folder, Collection, DAMSubModule, MediaAnalytics, 
  ImageEditOptions, FolderColor 
} from '../types/dam';

// Initial Folders Seed
const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder_root',
    name: 'Root Assets',
    parentId: null,
    path: '/',
    colorLabel: 'emerald',
    icon: 'Folder',
    createdAt: '2026-01-01',
    updatedAt: '2026-02-20',
    itemCount: 14,
    totalSize: 48500000,
    isSystemFolder: true
  },
  {
    id: 'folder_blog',
    name: 'Blog & Articles',
    parentId: 'folder_root',
    path: '/Blog & Articles',
    colorLabel: 'emerald',
    icon: 'FileText',
    createdAt: '2026-01-10',
    updatedAt: '2026-02-22',
    itemCount: 6,
    totalSize: 18400000,
    isSystemFolder: false
  },
  {
    id: 'folder_beneficiaries',
    name: 'Beneficiary Stories',
    parentId: 'folder_root',
    path: '/Beneficiary Stories',
    colorLabel: 'gold',
    icon: 'Users',
    createdAt: '2026-01-12',
    updatedAt: '2026-02-18',
    itemCount: 4,
    totalSize: 12100000,
    isSystemFolder: false
  },
  {
    id: 'folder_loans',
    name: 'Loan Product Materials',
    parentId: 'folder_root',
    path: '/Loan Product Materials',
    colorLabel: 'amber',
    icon: 'Building2',
    createdAt: '2026-01-15',
    updatedAt: '2026-02-19',
    itemCount: 3,
    totalSize: 9200000,
    isSystemFolder: false
  },
  {
    id: 'folder_documents',
    name: 'Corporate & Compliance Docs',
    parentId: 'folder_root',
    path: '/Corporate & Compliance Docs',
    colorLabel: 'blue',
    icon: 'ShieldCheck',
    createdAt: '2026-01-05',
    updatedAt: '2026-02-24',
    itemCount: 3,
    totalSize: 6800000,
    isSystemFolder: false
  },
  {
    id: 'folder_marketing',
    name: 'Marketing & Banners',
    parentId: 'folder_root',
    path: '/Marketing & Banners',
    colorLabel: 'purple',
    icon: 'Award',
    createdAt: '2026-01-20',
    updatedAt: '2026-02-25',
    itemCount: 2,
    totalSize: 14200000,
    isSystemFolder: false
  }
];

// Initial Collections Seed
const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col_blog',
    name: 'Blog Images',
    description: 'High-definition editorial imagery used across news and journal posts.',
    icon: 'FileText',
    color: '#074504',
    mediaIds: ['media_1', 'media_2', 'media_3', 'media_4'],
    isSystemCollection: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-02-20'
  },
  {
    id: 'col_featured',
    name: 'Featured Images',
    description: 'Primary visual cards displayed on hero sections and homepage sliders.',
    icon: 'Award',
    color: '#C0991B',
    mediaIds: ['media_1', 'media_5'],
    isSystemCollection: true,
    createdAt: '2026-01-12',
    updatedAt: '2026-02-21'
  },
  {
    id: 'col_vacancies',
    name: 'Vacancies',
    description: 'Banners and materials for career postings and branch recruitment.',
    icon: 'Briefcase',
    color: '#599200',
    mediaIds: ['media_6'],
    isSystemCollection: false,
    createdAt: '2026-01-15',
    updatedAt: '2026-02-19'
  },
  {
    id: 'col_beneficiaries',
    name: 'Beneficiaries',
    description: 'Verified photographs of Chama loan recipients, farmers, and youth entrepreneurs.',
    icon: 'Users',
    color: '#033B18',
    mediaIds: ['media_2', 'media_3'],
    isSystemCollection: false,
    createdAt: '2026-01-18',
    updatedAt: '2026-02-22'
  },
  {
    id: 'col_documents',
    name: 'Documents',
    description: 'PDF checklists, annual reports, terms, and regulatory disclosure files.',
    icon: 'FileCheck',
    color: '#1e40af',
    mediaIds: ['media_7', 'media_8'],
    isSystemCollection: true,
    createdAt: '2026-01-05',
    updatedAt: '2026-02-24'
  },
  {
    id: 'col_marketing',
    name: 'Marketing Assets',
    description: 'Vector SVG logos, brand guidelines, and M-PESA integration badges.',
    icon: 'Briefcase',
    color: '#7c3aed',
    mediaIds: ['media_9', 'media_10'],
    isSystemCollection: false,
    createdAt: '2026-01-20',
    updatedAt: '2026-02-25'
  }
];

// Initial Media Items Seed
const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media_1',
    filename: 'mount_kenya_farmer_microfinance.jpg',
    displayName: 'Mount Kenya Smallholder Farmer Micro-Credit',
    fileType: 'image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    size: 2450000,
    formattedSize: '2.45 MB',
    compressedSize: 1280000,
    compressionRatio: 47.7,
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    src: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=70',
    webpUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&fm=webp',
    avifUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&fm=avif',
    responsiveSizes: {
      thumbnailSmall: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&h=150&fit=crop',
      thumbnailMedium: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&h=300&fit=crop',
      thumbnailLarge: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&h=600&fit=crop',
      featured: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1200&h=630&fit=crop',
      socialOg: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1200&h=630&fit=crop',
      twitterCard: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=800&h=418&fit=crop'
    },
    uploadDate: '2026-02-15',
    uploadedBy: 'Patrick Munene',
    folderId: 'folder_blog',
    folderName: 'Blog & Articles',
    collectionIds: ['col_blog', 'col_featured'],
    tags: ['Agriculture', 'MountKenya', 'Microfinance', 'AgriLoan'],
    status: 'Optimized',
    usageCount: 4,
    usageLocations: [
      { id: 'u1', title: 'Why We Lend Without Collateral', type: 'Article', url: '/blog/lending-without-collateral', updatedAt: '2026-02-18' },
      { id: 'u2', title: 'Agribusiness Financing Guidelines', type: 'SEO', url: '/loans/agri-loan', updatedAt: '2026-02-19' }
    ],
    metadata: {
      filename: 'mount_kenya_farmer_microfinance.jpg',
      displayName: 'Mount Kenya Smallholder Farmer Micro-Credit',
      altText: 'Kenyan agricultural entrepreneur tending crops financed by Neema HEEP micro-loans.',
      caption: 'Neema HEEP flexible agricultural loans empowering tea and coffee farmers across Embu and Meru.',
      description: 'High-resolution photo showcasing agricultural micro-lending impact in rural Mount Kenya region.',
      keywords: ['AgriLoan', 'Embu', 'Meru', 'Microfinance', 'Neema HEEP'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Samuel Ochieng',
      author: 'Patrick Munene',
      license: 'Proprietary - Neema HEEP',
      version: 1,
      colorPalette: ['#074504', '#C0991B', '#ffffff'],
      orientation: 'landscape'
    },
    aiMetadata: {
      generatedAltText: 'Kenyan agricultural entrepreneur tending crops financed by Neema HEEP micro-loans.',
      generatedCaption: 'Neema HEEP flexible agricultural loans empowering tea and coffee farmers across Embu and Meru.',
      generatedDescription: 'Verified photo demonstrating agribusiness growth capital in rural Mount Kenya.',
      suggestedFileName: 'neema_heep_agri_loan_farmer.jpg',
      suggestedKeywords: ['AgriLoan', 'Embu', 'Meru', 'Microfinance', 'Neema HEEP'],
      qualityScore: 96,
      seoScore: 98,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant',
      isDuplicate: false
    },
    downloadsCount: 142,
    viewsCount: 1850
  },
  {
    id: 'media_2',
    filename: 'women_chama_group_meeting.jpg',
    displayName: 'Embu Women Chama Group Meeting',
    fileType: 'image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    size: 1850000,
    formattedSize: '1.85 MB',
    compressedSize: 920000,
    compressionRatio: 50.2,
    dimensions: { width: 1600, height: 1066, aspectRatio: '3:2' },
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=70',
    webpUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&fm=webp',
    avifUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&fm=avif',
    uploadDate: '2026-02-10',
    uploadedBy: 'Dr. Jane Muturi',
    folderId: 'folder_beneficiaries',
    folderName: 'Beneficiary Stories',
    collectionIds: ['col_blog', 'col_beneficiaries'],
    tags: ['Chama', 'WomenEmpowerment', 'GroupLending', 'Embu'],
    status: 'Optimized',
    usageCount: 3,
    usageLocations: [
      { id: 'u3', title: 'The HEEP Model: Financial & Physical Health', type: 'Article', url: '/blog/heep-model-physical-health', updatedAt: '2026-02-12' }
    ],
    metadata: {
      filename: 'women_chama_group_meeting.jpg',
      displayName: 'Embu Women Chama Group Meeting',
      altText: 'Neema HEEP women chama group leader conducting weekly financial literacy session.',
      caption: 'Women group-guaranteed micro-loans expanding retail businesses in Embu town.',
      description: 'Chama group members holding group record books during field officer appraisal.',
      keywords: ['Chama', 'Women', 'Embu', 'Financial Literacy'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Dr. Jane Muturi',
      author: 'Dr. Jane Muturi',
      license: 'Proprietary - Neema HEEP',
      version: 1,
      orientation: 'landscape'
    },
    aiMetadata: {
      generatedAltText: 'Neema HEEP women chama group leader conducting weekly financial literacy session.',
      qualityScore: 94,
      seoScore: 92,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 98,
    viewsCount: 1240
  },
  {
    id: 'media_3',
    filename: 'youth_mobile_mpesa_disbursement.jpg',
    displayName: 'Instant M-PESA Mobile Micro-Loan Transfer',
    fileType: 'image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    size: 1420000,
    formattedSize: '1.42 MB',
    compressedSize: 680000,
    compressionRatio: 52.1,
    dimensions: { width: 1200, height: 800, aspectRatio: '3:2' },
    src: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=300&q=70',
    uploadDate: '2026-02-12',
    uploadedBy: 'Samuel Ochieng',
    folderId: 'folder_loans',
    folderName: 'Loan Product Materials',
    collectionIds: ['col_blog', 'col_beneficiaries'],
    tags: ['MPESA', 'MobileDisbursement', 'FinTech', 'YouthLoan'],
    status: 'Optimized',
    usageCount: 2,
    usageLocations: [
      { id: 'u4', title: 'How to Get the Best Microfinance Loans in 2026', type: 'Article', url: '/blog/get-best-microfinance-loans-2026', updatedAt: '2026-02-14' }
    ],
    metadata: {
      filename: 'youth_mobile_mpesa_disbursement.jpg',
      displayName: 'Instant M-PESA Mobile Micro-Loan Transfer',
      altText: 'Kenyan entrepreneur receiving direct M-PESA business loan notification on mobile phone.',
      caption: 'Neema HEEP rapid 24-hour M-PESA loan disbursement for youth micro-enterprises.',
      description: 'Fintech mobile loan processing interface showcasing seamless B2C disbursement.',
      keywords: ['M-PESA', 'Mobile Loan', 'Disbursement', 'Kenyan FinTech'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Samuel Ochieng',
      author: 'Samuel Ochieng',
      license: 'Proprietary - Neema HEEP',
      version: 1,
      orientation: 'landscape'
    },
    aiMetadata: {
      generatedAltText: 'Kenyan entrepreneur receiving direct M-PESA business loan notification on mobile phone.',
      qualityScore: 92,
      seoScore: 95,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 210,
    viewsCount: 2400
  },
  {
    id: 'media_4',
    filename: 'neema_heep_annual_impact_report_2026.pdf',
    displayName: 'Neema HEEP Annual Impact Report 2026',
    fileType: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    size: 4850000,
    formattedSize: '4.85 MB',
    src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=300&q=70',
    uploadDate: '2026-02-01',
    uploadedBy: 'Patrick Munene',
    folderId: 'folder_documents',
    folderName: 'Corporate & Compliance Docs',
    collectionIds: ['col_documents'],
    tags: ['PDF', 'Report', 'Impact', 'Audit', 'Governance'],
    status: 'Optimized',
    usageCount: 5,
    usageLocations: [
      { id: 'u5', title: 'About Us Governance Page', type: 'SEO', url: '/about-us', updatedAt: '2026-02-05' }
    ],
    metadata: {
      filename: 'neema_heep_annual_impact_report_2026.pdf',
      displayName: 'Neema HEEP Annual Impact Report 2026',
      altText: 'PDF document cover for Neema HEEP 2026 Annual Impact and Financial Audit Report.',
      caption: 'Full financial breakdown and social return on investment (SROI) analysis across 7 counties.',
      description: 'Comprehensive 42-page corporate document detailing KES 1.2B loan portfolio performance.',
      keywords: ['PDF', 'Annual Report', 'Impact', 'Neema HEEP'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'N/A',
      author: 'Patrick Munene',
      license: 'Proprietary - Neema HEEP',
      version: 2
    },
    aiMetadata: {
      generatedAltText: 'PDF document cover for Neema HEEP 2026 Annual Impact and Financial Audit Report.',
      qualityScore: 98,
      seoScore: 90,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 540,
    viewsCount: 3800
  },
  {
    id: 'media_5',
    filename: 'microfinance_training_workshop_video.mp4',
    displayName: 'Financial Literacy Workshop Video Highlights',
    fileType: 'video',
    mimeType: 'video/mp4',
    extension: 'mp4',
    size: 18400000,
    formattedSize: '18.4 MB',
    dimensions: { width: 1920, height: 1080, aspectRatio: '16:9' },
    duration: 145, // seconds
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=70',
    uploadDate: '2026-02-18',
    uploadedBy: 'Editorial Staff',
    folderId: 'folder_marketing',
    folderName: 'Marketing & Banners',
    collectionIds: ['col_featured'],
    tags: ['Video', 'Workshop', 'FinancialLiteracy', 'Meru'],
    status: 'Optimized',
    usageCount: 2,
    usageLocations: [
      { id: 'u6', title: 'Meru Branch Opening Journal', type: 'Article', url: '/blog/neema-heep-meru-branch-opening', updatedAt: '2026-02-19' }
    ],
    metadata: {
      filename: 'microfinance_training_workshop_video.mp4',
      displayName: 'Financial Literacy Workshop Video Highlights',
      altText: 'Video thumbnail showing Neema HEEP credit officers teaching business record keeping in Meru.',
      caption: 'Interactive budgeting and loan repayment workshop video for small merchants.',
      description: 'HD 1080p video recap of Meru Town financial empowerment clinic.',
      keywords: ['Video', 'Meru', 'Training', 'SME'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Media Team',
      author: 'Editorial Staff',
      license: 'Proprietary - Neema HEEP',
      version: 1,
      orientation: 'landscape'
    },
    aiMetadata: {
      generatedAltText: 'Video thumbnail showing Neema HEEP credit officers teaching business record keeping in Meru.',
      qualityScore: 95,
      seoScore: 94,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 88,
    viewsCount: 950
  },
  {
    id: 'media_6',
    filename: 'neema_heep_brand_logo_highres.svg',
    displayName: 'Neema HEEP Official Brand Logo (SVG)',
    fileType: 'image',
    mimeType: 'image/svg+xml',
    extension: 'svg',
    size: 48000,
    formattedSize: '48 KB',
    dimensions: { width: 800, height: 600, aspectRatio: '4:3' },
    src: 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/shield-check.svg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=70',
    uploadDate: '2026-01-02',
    uploadedBy: 'Patrick Munene',
    folderId: 'folder_marketing',
    folderName: 'Marketing & Banners',
    collectionIds: ['col_marketing', 'col_vacancies'],
    tags: ['Logo', 'SVG', 'Vector', 'Branding'],
    status: 'Optimized',
    usageCount: 12,
    usageLocations: [
      { id: 'u7', title: 'Header Navbar Logo', type: 'Marketing', url: '/', updatedAt: '2026-02-20' },
      { id: 'u8', title: 'Footer Brand Badge', type: 'Marketing', url: '/', updatedAt: '2026-02-20' }
    ],
    metadata: {
      filename: 'neema_heep_brand_logo_highres.svg',
      displayName: 'Neema HEEP Official Brand Logo (SVG)',
      altText: 'Official Neema HEEP Microfinance emblem featuring green shield and golden growth arc.',
      caption: 'Scalable vector logo for print, web banners, and official documentation.',
      description: 'Master SVG vector file for corporate identity and partner collaterals.',
      keywords: ['Logo', 'SVG', 'Neema HEEP', 'Vector'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Design Team',
      author: 'Patrick Munene',
      license: 'Proprietary - Neema HEEP',
      version: 3
    },
    aiMetadata: {
      generatedAltText: 'Official Neema HEEP Microfinance emblem featuring green shield and golden growth arc.',
      qualityScore: 99,
      seoScore: 99,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 1200,
    viewsCount: 8900
  },
  {
    id: 'media_7',
    filename: 'loan_application_requirements_checklist.pdf',
    displayName: 'Microfinance Loan Application Checklist 2026',
    fileType: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    size: 1120000,
    formattedSize: '1.12 MB',
    src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=300&q=70',
    uploadDate: '2026-02-08',
    uploadedBy: 'Samuel Ochieng',
    folderId: 'folder_documents',
    folderName: 'Corporate & Compliance Docs',
    collectionIds: ['col_documents'],
    tags: ['PDF', 'Checklist', 'LoanRequirements', 'Embu'],
    status: 'Optimized',
    usageCount: 8,
    usageLocations: [
      { id: 'u9', title: 'Checklists Page Download', type: 'SEO', url: '/checklists', updatedAt: '2026-02-15' }
    ],
    metadata: {
      filename: 'loan_application_requirements_checklist.pdf',
      displayName: 'Microfinance Loan Application Checklist 2026',
      altText: 'Downloadable PDF checklist outlining National ID, M-PESA statement, and guarantor criteria.',
      caption: 'Official 1-page guide for first-time microfinance loan applicants in Kenya.',
      description: 'Printable application checklist available across all 6 branch offices.',
      keywords: ['Checklist', 'PDF', 'Requirements', 'Neema HEEP'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Credit Desk',
      author: 'Samuel Ochieng',
      license: 'Proprietary - Neema HEEP',
      version: 1
    },
    aiMetadata: {
      generatedAltText: 'Downloadable PDF checklist outlining National ID, M-PESA statement, and guarantor criteria.',
      qualityScore: 95,
      seoScore: 96,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 890,
    viewsCount: 4200
  },
  {
    id: 'media_8',
    filename: 'chama_financial_literacy_podcast.mp3',
    displayName: 'Chama Growth & Development Podcast Episode 04',
    fileType: 'audio',
    mimeType: 'audio/mpeg',
    extension: 'mp3',
    size: 9400000,
    formattedSize: '9.4 MB',
    duration: 620, // 10m 20s
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=70',
    uploadDate: '2026-02-14',
    uploadedBy: 'Dr. Jane Muturi',
    folderId: 'folder_blog',
    folderName: 'Blog & Articles',
    collectionIds: ['col_blog'],
    tags: ['Audio', 'Podcast', 'Chama', 'Swahili'],
    status: 'Optimized',
    usageCount: 1,
    usageLocations: [
      { id: 'u10', title: 'Financial Empowerment Audio Series', type: 'Article', url: '/blog/heep-model-physical-health', updatedAt: '2026-02-16' }
    ],
    metadata: {
      filename: 'chama_financial_literacy_podcast.mp3',
      displayName: 'Chama Growth & Development Podcast Episode 04',
      altText: 'Audio recording icon for Swahili podcast episode discussing revolving loan funds.',
      caption: '10-minute audio guide in English & Swahili on avoiding M-PESA over-indebtedness.',
      description: 'Educational audio resource broadcast across regional radio partners in Mount Kenya.',
      keywords: ['Podcast', 'Audio', 'Chama', 'Swahili'],
      copyright: '© 2026 Neema HEEP Microfinance Ltd.',
      photographer: 'Radio Studio',
      author: 'Dr. Jane Muturi',
      license: 'Proprietary - Neema HEEP',
      version: 1
    },
    aiMetadata: {
      generatedAltText: 'Audio recording icon for Swahili podcast episode discussing revolving loan funds.',
      qualityScore: 91,
      seoScore: 88,
      moderationStatus: 'Pass',
      accessibilityStatus: 'Compliant'
    },
    downloadsCount: 165,
    viewsCount: 820
  }
];

// Local Storage Key
const DAM_MEDIA_KEY = 'neema_dam_media_v1';
const DAM_FOLDERS_KEY = 'neema_dam_folders_v1';
const DAM_COLLECTIONS_KEY = 'neema_dam_collections_v1';
const DAM_TRASH_KEY = 'neema_dam_trash_v1';

// In-Memory Fallbacks
let mediaItemsStore: MediaItem[] = [];
let foldersStore: Folder[] = [];
let collectionsStore: Collection[] = [];
let trashStore: MediaItem[] = [];

// Initialize Store
function initStore() {
  if (typeof window === 'undefined') return;

  try {
    const savedMedia = localStorage.getItem(DAM_MEDIA_KEY);
    if (savedMedia) {
      mediaItemsStore = JSON.parse(savedMedia);
    } else {
      mediaItemsStore = INITIAL_MEDIA_ITEMS;
      localStorage.setItem(DAM_MEDIA_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
    }

    const savedFolders = localStorage.getItem(DAM_FOLDERS_KEY);
    if (savedFolders) {
      foldersStore = JSON.parse(savedFolders);
    } else {
      foldersStore = INITIAL_FOLDERS;
      localStorage.setItem(DAM_FOLDERS_KEY, JSON.stringify(INITIAL_FOLDERS));
    }

    const savedCols = localStorage.getItem(DAM_COLLECTIONS_KEY);
    if (savedCols) {
      collectionsStore = JSON.parse(savedCols);
    } else {
      collectionsStore = INITIAL_COLLECTIONS;
      localStorage.setItem(DAM_COLLECTIONS_KEY, JSON.stringify(INITIAL_COLLECTIONS));
    }

    const savedTrash = localStorage.getItem(DAM_TRASH_KEY);
    if (savedTrash) {
      trashStore = JSON.parse(savedTrash);
    } else {
      trashStore = [];
      localStorage.setItem(DAM_TRASH_KEY, JSON.stringify([]));
    }
  } catch (e) {
    mediaItemsStore = INITIAL_MEDIA_ITEMS;
    foldersStore = INITIAL_FOLDERS;
    collectionsStore = INITIAL_COLLECTIONS;
    trashStore = [];
  }
}

// Fire Global Event
function triggerUpdateEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('neema_cms_media_updated'));
  }
}

initStore();

export const damStore = {
  // Getters
  getMedia(includeDeleted = false): MediaItem[] {
    if (!mediaItemsStore.length) initStore();
    if (includeDeleted) return mediaItemsStore;
    return mediaItemsStore.filter((m) => !m.isDeleted);
  },

  getTrash(): MediaItem[] {
    if (!trashStore.length) initStore();
    return trashStore;
  },

  getFolders(): Folder[] {
    if (!foldersStore.length) initStore();
    return foldersStore;
  },

  getCollections(): Collection[] {
    if (!collectionsStore.length) initStore();
    return collectionsStore;
  },

  // Save State
  saveMedia(items: MediaItem[]) {
    mediaItemsStore = items;
    if (typeof window !== 'undefined') {
      localStorage.setItem(DAM_MEDIA_KEY, JSON.stringify(items));
    }
    triggerUpdateEvent();
  },

  saveTrash(items: MediaItem[]) {
    trashStore = items;
    if (typeof window !== 'undefined') {
      localStorage.setItem(DAM_TRASH_KEY, JSON.stringify(items));
    }
    triggerUpdateEvent();
  },

  saveFolders(folders: Folder[]) {
    foldersStore = folders;
    if (typeof window !== 'undefined') {
      localStorage.setItem(DAM_FOLDERS_KEY, JSON.stringify(folders));
    }
    triggerUpdateEvent();
  },

  saveCollections(cols: Collection[]) {
    collectionsStore = cols;
    if (typeof window !== 'undefined') {
      localStorage.setItem(DAM_COLLECTIONS_KEY, JSON.stringify(cols));
    }
    triggerUpdateEvent();
  },

  // Asset Actions
  addMediaItem(item: Partial<MediaItem>): MediaItem {
    const all = this.getMedia(true);
    const id = item.id || `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const size = item.size || 1500000;
    const formattedSize = (size / (1024 * 1024)).toFixed(2) + ' MB';
    const compressed = Math.round(size * 0.52);

    const newItem: MediaItem = {
      id,
      filename: item.filename || 'uploaded_media.jpg',
      displayName: item.displayName || item.filename || 'Uploaded Asset',
      fileType: item.fileType || 'image',
      mimeType: item.mimeType || 'image/jpeg',
      extension: item.extension || 'jpg',
      size,
      formattedSize,
      compressedSize: compressed,
      compressionRatio: 48,
      dimensions: item.dimensions || { width: 1200, height: 800, aspectRatio: '3:2' },
      src: item.src || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: item.thumbnailUrl || item.src || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=300&q=70',
      webpUrl: item.webpUrl || item.src,
      avifUrl: item.avifUrl || item.src,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: item.uploadedBy || 'Neema Staff',
      folderId: item.folderId || 'folder_root',
      folderName: item.folderName || 'Root Assets',
      collectionIds: item.collectionIds || ['col_blog'],
      tags: item.tags || ['NewUpload', 'NeemaHEEP'],
      status: 'Optimized',
      usageCount: 0,
      usageLocations: [],
      metadata: {
        filename: item.filename || 'uploaded_media.jpg',
        displayName: item.displayName || 'Uploaded Asset',
        altText: item.metadata?.altText || 'Neema HEEP corporate media asset.',
        caption: item.metadata?.caption || 'Official uploaded asset.',
        description: item.metadata?.description || 'Media asset for Neema HEEP portal.',
        keywords: item.metadata?.keywords || ['NeemaHEEP', 'Asset'],
        copyright: '© 2026 Neema HEEP Microfinance Ltd.',
        photographer: item.uploadedBy || 'Staff',
        author: item.uploadedBy || 'Staff',
        license: 'Proprietary - Neema HEEP',
        version: 1
      },
      aiMetadata: {
        generatedAltText: item.aiMetadata?.generatedAltText || 'Neema HEEP corporate media asset.',
        qualityScore: 95,
        seoScore: 92,
        moderationStatus: 'Pass',
        accessibilityStatus: 'Compliant'
      },
      downloadsCount: 0,
      viewsCount: 1,
      ...item
    };

    all.unshift(newItem);
    this.saveMedia(all);
    return newItem;
  },

  updateMediaItem(id: string, updates: Partial<MediaItem>): MediaItem | null {
    const all = this.getMedia(true);
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    all[idx] = {
      ...all[idx],
      ...updates,
      metadata: {
        ...all[idx].metadata,
        ...(updates.metadata || {})
      },
      aiMetadata: {
        ...all[idx].aiMetadata,
        ...(updates.aiMetadata || {})
      }
    };

    this.saveMedia(all);
    return all[idx];
  },

  softDeleteMedia(id: string) {
    const all = this.getMedia(true);
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return false;

    const item = all[idx];
    item.isDeleted = true;
    item.deletedAt = new Date().toISOString();

    const trash = this.getTrash();
    trash.unshift(item);

    all.splice(idx, 1);
    this.saveMedia(all);
    this.saveTrash(trash);
    return true;
  },

  restoreFromTrash(id: string) {
    const trash = this.getTrash();
    const idx = trash.findIndex((m) => m.id === id);
    if (idx === -1) return false;

    const restored = trash[idx];
    restored.isDeleted = false;
    delete restored.deletedAt;

    trash.splice(idx, 1);

    const all = this.getMedia(true);
    all.unshift(restored);

    this.saveMedia(all);
    this.saveTrash(trash);
    return true;
  },

  permanentlyDelete(id: string) {
    const trash = this.getTrash();
    const updated = trash.filter((m) => m.id !== id);
    this.saveTrash(updated);
    return true;
  },

  emptyTrash() {
    this.saveTrash([]);
    return true;
  },

  // Folder Actions
  createFolder(name: string, parentId: string | null = 'folder_root', colorLabel: FolderColor = 'emerald'): Folder {
    const folders = this.getFolders();
    const parent = folders.find((f) => f.id === parentId);
    const path = parent ? `${parent.path}/${name}` : `/${name}`;

    const newFolder: Folder = {
      id: `folder_${Date.now()}`,
      name,
      parentId,
      path,
      colorLabel,
      icon: 'Folder',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      itemCount: 0,
      totalSize: 0,
      isSystemFolder: false
    };

    folders.push(newFolder);
    this.saveFolders(folders);
    return newFolder;
  },

  updateFolder(id: string, updates: Partial<Folder>): Folder | null {
    const folders = this.getFolders();
    const idx = folders.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    folders[idx] = { ...folders[idx], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
    this.saveFolders(folders);
    return folders[idx];
  },

  deleteFolder(id: string) {
    const folders = this.getFolders();
    const updated = folders.filter((f) => f.id !== id && f.parentId !== id);
    this.saveFolders(updated);
    return true;
  },

  // Collection Actions
  createCollection(name: string, description: string, color = '#074504', icon = 'FolderHeart'): Collection {
    const cols = this.getCollections();
    const newCol: Collection = {
      id: `col_${Date.now()}`,
      name,
      description,
      color,
      icon,
      mediaIds: [],
      isSystemCollection: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      shareUrl: `${window.location.origin}/admin/media/collections?col=col_${Date.now()}`
    };

    cols.push(newCol);
    this.saveCollections(cols);
    return newCol;
  },

  toggleMediaInCollection(collectionId: string, mediaId: string) {
    const cols = this.getCollections();
    const col = cols.find((c) => c.id === collectionId);
    if (!col) return false;

    if (col.mediaIds.includes(mediaId)) {
      col.mediaIds = col.mediaIds.filter((id) => id !== mediaId);
    } else {
      col.mediaIds.push(mediaId);
    }

    col.updatedAt = new Date().toISOString().split('T')[0];
    this.saveCollections(cols);
    return true;
  },

  addMediaToCollection(collectionId: string, mediaId: string) {
    const cols = this.getCollections();
    const col = cols.find((c) => c.id === collectionId);
    if (!col) return false;

    if (!col.mediaIds.includes(mediaId)) {
      col.mediaIds.push(mediaId);
      col.updatedAt = new Date().toISOString().split('T')[0];
      this.saveCollections(cols);
    }
    return true;
  },

  // Analytics Computation
  getAnalytics(): MediaAnalytics {
    const media = this.getMedia();

    let totalSize = 0;
    const sizeByType: Record<string, number> = { image: 0, video: 0, audio: 0, document: 0, archive: 0 };
    const countByType: Record<string, number> = { image: 0, video: 0, audio: 0, document: 0, archive: 0 };

    let optimizedCount = 0;
    let needsAltCount = 0;
    let unusedCount = 0;
    let duplicatesCount = 0;
    let totalSavingsBytes = 0;

    media.forEach((item) => {
      totalSize += item.size;
      sizeByType[item.fileType] = (sizeByType[item.fileType] || 0) + item.size;
      countByType[item.fileType] = (countByType[item.fileType] || 0) + 1;

      if (item.status === 'Optimized') optimizedCount++;
      if (!item.metadata.altText || item.status === 'Needs Alt Text') needsAltCount++;
      if (item.usageCount === 0 || item.status === 'Unused') unusedCount++;
      if (item.aiMetadata?.isDuplicate) duplicatesCount++;

      if (item.compressedSize && item.compressedSize < item.size) {
        totalSavingsBytes += item.size - item.compressedSize;
      }
    });

    const topDownloaded = [...media].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 5);
    const topViewed = [...media].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 5);

    return {
      totalFiles: media.length,
      totalSize,
      sizeByType: sizeByType as any,
      countByType: countByType as any,
      optimizedCount,
      needsAltCount,
      unusedCount,
      duplicatesCount,
      totalSavingsBytes,
      topDownloaded,
      topViewed,
      recentActivities: [
        { id: 'act_1', action: 'Uploaded Asset', mediaName: 'mount_kenya_farmer_microfinance.jpg', timestamp: '10 mins ago', user: 'Patrick Munene' },
        { id: 'act_2', action: 'Generated AI Alt Text', mediaName: 'women_chama_group_meeting.jpg', timestamp: '25 mins ago', user: 'AI Assistant' },
        { id: 'act_3', action: 'Converted to WebP & AVIF', mediaName: 'youth_mobile_mpesa_disbursement.jpg', timestamp: '1 hour ago', user: 'Auto Optimizer' },
        { id: 'act_4', action: 'Downloaded Document', mediaName: 'neema_heep_annual_impact_report_2026.pdf', timestamp: '2 hours ago', user: 'Samuel Ochieng' }
      ]
    };
  }
};
