import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Award, BookOpen, ArrowLeft, ArrowUpRight, 
  CheckCircle2, ShieldCheck, Briefcase, GraduationCap, Globe 
} from 'lucide-react';
import { BLOG_POSTS } from '../lib/blogData';

interface AuthorData {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  photo: string;
  coverPhoto: string;
  bio: string;
  education: string;
  experience: string;
  expertise: string[];
  articles: Array<{
    title: string;
    slug: string;
    category: string;
    date: string;
    excerpt: string;
  }>;
}

const AUTHORS_DATA: Record<string, AuthorData> = {
  'patrick-munene': {
    id: 'patrick-munene',
    name: 'Patrick Munene',
    jobTitle: 'Managing Director & Founder',
    department: 'Executive Leadership',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=70&w=400&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    bio: 'Pioneer in Kenyan microfinance and rural economic development. Leading Neema Heep expansion and agricultural credit accessibility across Mount Kenya counties since 2010.',
    education: 'Master of Science in Finance (M.Sc. Finance)',
    experience: '14+ Years Experience in Microfinance & SME Credit Risk',
    expertise: ['Micro-Financing Innovation', 'SME Credit Analysis', 'Agribusiness Loans', 'Financial Inclusion Policy'],
    articles: BLOG_POSTS.filter((p) => p.authorName.toLowerCase().includes('patrick') || p.authorInitials === 'PM').map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      date: p.date,
      excerpt: p.excerpt,
    })),
  },
  'dr-jane-muturi': {
    id: 'dr-jane-muturi',
    name: 'Dr. Jane Muturi',
    jobTitle: 'Head of Community Health & Welfare',
    department: 'Welfare & Public Health',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=70&w=400&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Public health strategist overseeing WASH and medical micro-credit programs in Mount Kenya counties. Passionate about marrying financial stability with health outcome improvements.',
    education: 'Doctor of Medicine (M.D.) & Master of Public Health (MPH)',
    experience: '10+ Years in Community Medicine & Social Impact Livelihoods',
    expertise: ['WASH Micro-Lending', 'Health Livelihoods', 'Community Development', 'Preventive Health Care'],
    articles: BLOG_POSTS.filter((p) => p.authorName.toLowerCase().includes('jane') || p.authorInitials === 'JM').map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      date: p.date,
      excerpt: p.excerpt,
    })),
  },
  'samuel-ochieng': {
    id: 'samuel-ochieng',
    name: 'Samuel Ochieng',
    jobTitle: 'Senior Credit Risk Manager',
    department: 'Credit Operations',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=70&w=400&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Expert in agricultural group-guaranteed lending, Chama credit models, and M-PESA automated risk analysis.',
    education: 'Bachelor of Commerce (Finance) & CPA (K)',
    experience: '11+ Years in Micro-Credit Underwriting & Risk Analysis',
    expertise: ['Portfolio Risk Control', 'Group Lending Guarantee Systems', 'Fintech Credit Scoring', 'Agri-Value Chains'],
    articles: BLOG_POSTS.filter((p) => p.authorName.toLowerCase().includes('samuel') || p.authorInitials === 'SO').map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      date: p.date,
      excerpt: p.excerpt,
    })),
  },
};

export default function AuthorProfile() {
  const { authorId } = useParams<{ authorId: string }>();

  // Normalize author lookup
  const normalizedId = (authorId || 'patrick-munene').toLowerCase().replace(/\s+/g, '-');
  const author = AUTHORS_DATA[normalizedId] || AUTHORS_DATA['patrick-munene'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div>
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#074504] hover:underline">
          <ArrowLeft className="w-4 h-4 text-[#C0991B]" /> Back to Neema Heep Journal & Articles
        </Link>
      </div>

      {/* Author Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="h-44 md:h-56 bg-cover bg-center relative" style={{ backgroundImage: `url(${author.coverPhoto})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md text-[#C0991B] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#C0991B]/40 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Neema Heep Author
          </div>
        </div>

        <div className="p-6 md:p-8 pt-0 relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <img
              src={encodeURI(author.photo)}
              alt={author.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedFallback && author.photo.includes(' ')) {
                  target.dataset.triedFallback = 'true';
                  target.src = author.photo.replace(/ /g, '_');
                }
              }}
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-gray-100"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900">{author.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-[#074504]" />
              </div>
              <p className="text-xs font-bold text-[#074504]">{author.jobTitle}</p>
              <p className="text-xs text-gray-500 font-medium">{author.department} • Neema HEEP Microfinance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="px-4 py-2 bg-[#074504] text-white text-xs font-bold rounded-xl hover:bg-[#053203] shadow-sm transition-all"
            >
              Contact Author
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio & Credentials */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#074504] tracking-wider border-b pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#C0991B]" /> About the Author
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">{author.bio}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#074504] tracking-wider border-b pb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#C0991B]" /> Qualifications
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-gray-700">
                <GraduationCap className="w-4 h-4 text-[#074504] shrink-0 mt-0.5" />
                <span className="font-bold">{author.education}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-700">
                <Briefcase className="w-4 h-4 text-[#074504] shrink-0 mt-0.5" />
                <span className="font-medium">{author.experience}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#074504] tracking-wider border-b pb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C0991B]" /> Core Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {author.expertise.map((exp, i) => (
                <span key={i} className="px-2.5 py-1 bg-emerald-50 text-[#074504] rounded-lg text-xs font-bold border border-emerald-200">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Published Articles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-black uppercase text-[#074504] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C0991B]" /> Articles Authored by {author.name}
              </h2>
              <span className="text-xs font-bold text-[#826507] bg-amber-50 px-2.5 py-0.5 rounded-full border border-[#C0991B]/30">
                {author.articles.length} Published
              </span>
            </div>

            <div className="space-y-4">
              {author.articles.map((art, idx) => (
                <div key={idx} className="p-4 bg-gray-50 hover:bg-emerald-50/40 rounded-xl border border-gray-200 hover:border-[#074504]/30 transition-all space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#826507]">
                    <span>{art.category}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 hover:text-[#074504]">
                    <Link to={`/blog/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 font-medium">{art.excerpt}</p>
                  <div className="pt-1 flex items-center justify-end">
                    <Link to={`/blog/${art.slug}`} className="text-xs font-bold text-[#074504] hover:underline flex items-center gap-1">
                      Read Full Article <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
