import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Award, BookOpen, ArrowLeft, ArrowUpRight, 
  CheckCircle2, ShieldCheck, Briefcase, GraduationCap, Globe 
} from 'lucide-react';
import { BlogPostItem } from '../lib/blogStore';
import { articleService } from '../services/articleService';

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
    expertise: ['Micro-Financing Innovation', 'SME Credit Analysis', 'Agribusiness Loans', 'Financial Inclusion Policy']
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
    expertise: ['WASH Micro-Lending', 'Health Livelihoods', 'Community Development', 'Preventive Health Care']
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
    expertise: ['Portfolio Risk Control', 'Group Lending Guarantee Systems', 'Fintech Credit Scoring', 'Agri-Value Chains']
  }
};

export default function AuthorProfile() {
  const { authorId } = useParams<{ authorId: string }>();
  const [authorArticles, setAuthorArticles] = useState<BlogPostItem[]>([]);

  // Normalize author lookup
  const normalizedId = (authorId || 'patrick-munene').toLowerCase().replace(/\s+/g, '-');
  const author = AUTHORS_DATA[normalizedId] || AUTHORS_DATA['patrick-munene'];

  useEffect(() => {
    let isMounted = true;
    const loadArticles = async () => {
      try {
        const posts = await articleService.fetchPublishedArticles();
        if (isMounted) {
          const authorFirstWord = author.name.toLowerCase().split(' ')[0];
          const filtered = posts.filter(p => 
            p.authorName?.toLowerCase().includes(authorFirstWord) ||
            p.authorId === author.id
          );
          setAuthorArticles(filtered);
        }
      } catch (e) {
        console.error('Error loading author articles:', e);
      }
    };
    loadArticles();
    return () => { isMounted = false; };
  }, [author.name, author.id]);

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
              <h1 className="text-2xl font-black text-gray-900">{author.name}</h1>
              <p className="text-xs font-bold text-[#826507]">{author.jobTitle} • {author.department}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 pt-1 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Mount Kenya Region</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-gray-400" /> {author.education}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Bio & Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Credentials */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-black uppercase text-[#074504] flex items-center gap-2">
              <User className="w-4 h-4 text-[#C0991B]" /> About the Author
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">{author.bio}</p>
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>{author.experience}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase text-gray-900 flex items-center gap-2">
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
                {authorArticles.length} Published
              </span>
            </div>

            {authorArticles.length > 0 ? (
              <div className="space-y-4">
                {authorArticles.map((art) => (
                  <div key={art.id || art.slug} className="p-4 bg-gray-50 hover:bg-emerald-50/40 rounded-xl border border-gray-200 hover:border-[#074504]/30 transition-all space-y-2">
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
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No articles published by this author yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
