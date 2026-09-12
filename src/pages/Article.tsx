import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Quote, Info, CheckCircle2, Share2, MessageSquare, 
  ThumbsUp, Clock, Calendar, User, Eye, Send, Check, Copy, Heart
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { blogStore, BlogPostItem, BlogComment, BlogAuthor } from '../lib/blogStore';
import { communityStore, EnterpriseComment } from '../lib/communityStore';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [currentPost, setCurrentPost] = useState<BlogPostItem | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [author, setAuthor] = useState<BlogAuthor | null>(null);
  const [otherPosts, setOtherPosts] = useState<BlogPostItem[]>([]);

  // Comment form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Sharing state
  const [copiedLink, setCopiedLink] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    const loadPost = () => {
      const allPosts = blogStore.getPosts();
      const found = allPosts.find(p => p.slug === slug);

      if (found && found.status !== 'Trash') {
        setCurrentPost(found);
        setPostLikes(found.likes || 12);

        // Fetch comments for this post from enterprise community store
        const commComments = communityStore.getComments();
        const approvedForPost = commComments.filter(c => (c.postSlug === slug || c.postTitle === found.title) && c.status === 'Approved');
        
        // Map to BlogComment compatibility format
        setComments(approvedForPost.map(c => ({
          id: c.id,
          postSlug: c.postSlug,
          postTitle: c.postTitle,
          name: c.authorName,
          email: c.authorEmail,
          comment: c.content,
          authorName: c.authorName,
          authorEmail: c.authorEmail,
          content: c.content,
          status: c.status as any,
          date: c.postedDate
        })));

        // Fetch author details
        const authors = blogStore.getAuthors();
        const matchedAuthor = authors.find(a => a.id === found.authorId || a.name === found.authorName);
        setAuthor(matchedAuthor || null);

        // Related posts
        const related = allPosts.filter(p => p.slug !== slug && p.status === 'Published').slice(0, 3);
        setOtherPosts(related);
      } else {
        setCurrentPost(null);
      }
    };

    loadPost();

    const handleUpdate = () => loadPost();
    window.addEventListener('neema_cms_posts_updated', handleUpdate);
    return () => window.removeEventListener('neema_cms_posts_updated', handleUpdate);
  }, [slug]);

  if (!currentPost) {
    return (
      <div className="flex-grow flex items-center justify-center py-32 bg-[#f8faf8]">
        <div className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-xl max-w-md">
          <h2 className="text-3xl font-black text-[#074504] uppercase mb-4 tracking-tight">Article Not Found</h2>
          <p className="text-gray-600 text-sm mb-6">The article you are looking for may have been moved or removed.</p>
          <Link to="/blog" className="px-6 py-3 bg-[#074504] text-white font-extrabold uppercase text-xs tracking-wider rounded-xl shadow-md inline-block">
            Return to Blog Journal
          </Link>
        </div>
      </div>
    );
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentEmail || !commentText || !currentPost) return;

    const newComm = communityStore.addComment({
      postSlug: currentPost.slug,
      postTitle: currentPost.title,
      authorName: commentName,
      authorEmail: commentEmail,
      content: commentText
    });

    if (newComm.status === 'Approved') {
      setComments(prev => [{
        id: newComm.id,
        postSlug: newComm.postSlug,
        postTitle: newComm.postTitle,
        name: newComm.authorName,
        email: newComm.authorEmail,
        comment: newComm.content,
        authorName: newComm.authorName,
        authorEmail: newComm.authorEmail,
        content: newComm.content,
        status: 'Approved',
        date: newComm.postedDate
      }, ...prev]);
    }

    setCommentName('');
    setCommentEmail('');
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLikePost = () => {
    if (hasLiked) return;
    const newLikes = postLikes + 1;
    setPostLikes(newLikes);
    setHasLiked(true);

    const allPosts = blogStore.getPosts();
    const p = allPosts.find(item => item.id === currentPost.id);
    if (p) {
      p.likes = newLikes;
      blogStore.savePosts(allPosts);
    }
  };

  return (
    <main className="flex-grow bg-[#f8faf8] pb-0">
      <article>
        {/* Hero Section */}
        <div className="relative h-[65vh] min-h-[500px] bg-[#074504] flex flex-col justify-end overflow-hidden">
          <img 
            src={encodeURI(currentPost.image)} 
            alt={currentPost.title} 
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedFallback && currentPost.image.includes(' ')) {
                target.dataset.triedFallback = 'true';
                target.src = currentPost.image.replace(/ /g, '_');
              } else if (!target.dataset.triedUnsplash) {
                target.dataset.triedUnsplash = 'true';
                target.src = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800';
              }
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#074504] via-[#074504]/60 to-transparent" />
          
          <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-12 lg:pb-16 text-center">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-white/70 mb-6">
              <Link to="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-white">Blog</Link>
              <span>/</span>
              <span className="text-[#C0991B]">{currentPost.category}</span>
            </nav>

            <div className="mb-4 flex justify-center items-center gap-3 text-xs font-bold text-[#C0991B]">
              <span className="px-3 py-1 bg-[#C0991B]/20 rounded-full border border-[#C0991B]/30">{currentPost.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white/90"><Calendar className="w-3.5 h-3.5" /> {currentPost.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white/90"><Clock className="w-3.5 h-3.5" /> {currentPost.readTime}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-white/90"><Eye className="w-3.5 h-3.5" /> {currentPost.views} views</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 uppercase">
              {currentPost.title}
            </h1>

            <p className="text-base md:text-lg text-white/90 leading-relaxed font-medium max-w-2xl mx-auto mb-8">
              {currentPost.excerpt}
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#C0991B] text-[#074504] flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                {currentPost.authorInitials}
              </div>
              <div className="text-left">
                <p className="text-white font-black text-sm uppercase">{currentPost.authorName}</p>
                <p className="text-[#C0991B] text-xs font-bold">{currentPost.authorRole || 'Author & Contributor'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Social Sharing Bar */}
        <div className="sticky top-[80px] z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 px-6 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-[#074504] hover:text-[#599200]">
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 hidden sm:inline">Share:</span>
              
              {/* WhatsApp Share */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(currentPost.title + ' ' + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>WhatsApp</span>
              </a>

              {/* Twitter / X Share */}
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentPost.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-sky-100 text-sky-800 rounded-xl hover:bg-sky-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>X / Twitter</span>
              </a>

              {/* Copy Link */}
              <button 
                onClick={handleCopyShareLink}
                className="p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Like Button */}
              <button 
                onClick={handleLikePost}
                className={`p-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                  hasLiked ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{postLikes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-10">
            {currentPost.blocks && currentPost.blocks.length > 0 ? (
              currentPost.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {block.type === 'text' && (
                    <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-4 font-normal">
                      {block.content.split('\n\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
                    </div>
                  )}

                  {block.type === 'headline' && (
                    <h2 className="text-2xl md:text-4xl font-black text-[#074504] uppercase tracking-tight mt-8 mb-4">
                      {block.content}
                    </h2>
                  )}

                  {block.type === 'tip' && (
                    <div className="bg-[#599200]/10 border-l-6 border-[#599200] p-6 md:p-8 rounded-r-2xl my-6">
                      <div className="flex items-center gap-2 mb-2 text-[#074504] font-black text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-[#599200]" /> Pro Financial Tip
                      </div>
                      <p className="text-base md:text-lg font-bold text-[#074504] italic">
                        "{block.content}"
                      </p>
                    </div>
                  )}

                  {block.type === 'cta' && (
                    <div className="bg-[#074504] p-8 md:p-12 rounded-3xl text-center text-white my-8 shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-black uppercase mb-4">{block.content}</h3>
                        <p className="text-white/80 text-sm font-medium mb-6 max-w-lg mx-auto">
                          Take the next step in empowering your business or farming venture today with Neema Heep.
                        </p>
                        <Link 
                          to={block.settings?.link || '/loans'} 
                          className="inline-flex items-center gap-2 bg-[#C0991B] text-[#074504] px-8 py-4 rounded-xl font-black uppercase text-xs tracking-wider shadow-lg hover:scale-105 transition-all"
                        >
                          Apply For Loan <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {block.type === 'image' && (
                    <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                      <img 
                        src={encodeURI(block.content)} 
                        alt={block.settings?.caption || 'Article graphic'} 
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback && block.content.includes(' ')) {
                            target.dataset.triedFallback = 'true';
                            target.src = block.content.replace(/ /g, '_');
                          }
                        }}
                        className="w-full h-auto object-cover max-h-[500px]" 
                      />
                      {block.settings?.caption && (
                        <p className="p-3 bg-gray-100 text-center text-xs font-medium text-gray-600">{block.settings.caption}</p>
                      )}
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div className="my-8 rounded-2xl overflow-hidden shadow-xl aspect-video bg-black">
                      <iframe 
                        src={block.content.includes('embed') ? block.content : `https://www.youtube.com/embed/${block.content.split('v=')[1] || block.content}`}
                        title="Video embed"
                        className="w-full h-full border-none"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <div className="my-8 bg-gray-50 border-l-4 border-[#C0991B] p-6 rounded-r-2xl italic font-serif text-lg md:text-xl text-gray-800">
                      <Quote className="w-6 h-6 text-[#C0991B] mb-2" />
                      "{block.content}"
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-6">
                {currentPost.content?.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Tags cloud */}
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="pt-8 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Tags:</span>
                {currentPost.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-extrabold text-[#074504]">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Author Profile Card */}
            {(() => {
              const authorName = author?.name || currentPost.authorName || 'Patrick Munene';
              const authorSlug = authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <div className="mt-12 p-8 bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:border-[#074504]/30 transition-all">
                  <Link to={`/author/${authorSlug}`} className="w-20 h-20 rounded-2xl bg-[#074504] text-[#C0991B] flex items-center justify-center font-black text-2xl shrink-0 overflow-hidden shadow-md hover:scale-105 transition-transform">
                    {author?.avatar ? (
                      <img src={author.avatar} alt={authorName} className="w-full h-full object-cover" />
                    ) : (
                      currentPost.authorInitials
                    )}
                  </Link>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <span className="text-[10px] font-black uppercase text-[#C0991B] tracking-wider">About the Author</span>
                    <h3 className="text-xl font-black text-[#074504] uppercase hover:underline">
                      <Link to={`/author/${authorSlug}`}>{authorName}</Link>
                    </h3>
                    <p className="text-xs font-bold text-gray-500">{author?.role || currentPost.authorRole}</p>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed pt-1">
                      {author?.bio || 'Financial inclusion specialist at Neema Heep Microfinance, dedicated to empowering SMEs across Mount Kenya.'}
                    </p>
                    <div className="pt-2">
                      <Link
                        to={`/author/${authorSlug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#074504] hover:text-[#C0991B] transition-colors"
                      >
                        <span>View {authorName}'s Public Profile & Authored Articles</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Comments Section */}
            <div className="mt-16 pt-12 border-t border-gray-200 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#074504] uppercase tracking-tight flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-[#599200]" /> Comments ({comments.length})
                </h3>
              </div>

              {/* Add Comment Form */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
                <h4 className="text-sm font-black text-[#074504] uppercase">Leave a Comment</h4>
                
                {commentSuccess && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your comment has been submitted and published!</span>
                  </div>
                )}

                <form onSubmit={handleAddComment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name *</label>
                      <input 
                        type="text"
                        required
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="e.g. Samuel Maina"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#C0991B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Email *</label>
                      <input 
                        type="email"
                        required
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        placeholder="e.g. samuel@example.com"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#C0991B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Comment *</label>
                    <textarea 
                      rows={3}
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts or ask a question about this article..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#C0991B]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#074504] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#053203] transition-colors shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Comment
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No comments yet. Be the first to share your feedback!</p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#074504]/10 text-[#074504] font-black text-xs flex items-center justify-center">
                            {comm.authorName[0]}
                          </div>
                          <div>
                            <span className="font-black text-xs text-[#074504] uppercase">{comm.authorName}</span>
                            <span className="text-[10px] text-gray-400 font-bold block">{comm.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 font-medium leading-relaxed pl-10">
                        {comm.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      {otherPosts.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6">
            <h2 className="text-2xl font-black text-[#074504] uppercase tracking-tight mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {otherPosts.map((rel) => (
                <Link 
                  key={rel.id} 
                  to={`/blog/${rel.slug}`} 
                  className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200/80 p-4 hover:shadow-lg transition-all"
                >
                  <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={encodeURI(rel.image)} 
                      alt={rel.title} 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback && rel.image.includes(' ')) {
                          target.dataset.triedFallback = 'true';
                          target.src = rel.image.replace(/ /g, '_');
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <h3 className="text-sm font-black text-[#074504] uppercase leading-snug group-hover:text-[#599200] line-clamp-2 mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 font-medium mb-4">{rel.excerpt}</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 pt-2 border-t border-gray-200">
                    <span>{rel.authorName}</span>
                    <span>{rel.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
