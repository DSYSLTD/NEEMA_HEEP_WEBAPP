import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ArrowRight, Search, Tag, Filter, X } from 'lucide-react';
import { blogStore, BlogPostItem, BlogAuthor } from '../lib/blogStore';

export default function Blog() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);

  const [createdCategories, setCreatedCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadData = () => {
      const allPosts = blogStore.getPosts();
      setPosts(allPosts.filter(p => p.status !== 'Draft' && p.status !== 'Trash'));
      setAuthors(blogStore.getAuthors());
      const cats = blogStore.getCategories();
      setCreatedCategories(cats.map(c => c.name));
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('neema_cms_posts_updated', handleUpdate);
    window.addEventListener('neema_cms_categories_updated', handleUpdate);
    return () => {
      window.removeEventListener('neema_cms_posts_updated', handleUpdate);
      window.removeEventListener('neema_cms_categories_updated', handleUpdate);
    };
  }, []);

  // Categories automatically sync with CMS created/deleted categories
  const categories = ['All', ...createdCategories];

  // If currently selected category was deleted in CMS, fallback to 'All'
  useEffect(() => {
    if (selectedCategory !== 'All' && createdCategories.length > 0 && !createdCategories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [createdCategories, selectedCategory]);

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return posts.length;
    return posts.filter((p) => p.category === cat).length;
  };

  const filteredArticles = posts.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      !search ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (article.authorName && article.authorName.toLowerCase().includes(search.toLowerCase())) ||
      (article.category && article.category.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getAuthorDetails = (article: BlogPostItem) => {
    const matched = authors.find(
      (a) => a.id === article.authorId || a.name === article.authorName
    );
    return {
      name: article.authorName || 'Neema HEEP Team',
      role: matched?.role || article.authorRole || 'Contributor',
      avatar: matched?.avatar || article.authorAvatar,
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Header */}
      <div className="bg-[#074504] text-white p-8 md:p-12 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C0991B]/10 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-black uppercase tracking-widest text-[#C0991B] bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-[#C0991B]/40 inline-block shadow-xs">
          Insights & Financial Education
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight">
          Neema Heep Journal
        </h1>
        <p className="text-[#C0991B] text-sm md:text-base max-w-2xl font-bold leading-relaxed">
          Expert analysis, financial literacy guides, micro-lending case studies, and stories of community transformation from Mount Kenya and beyond.
        </p>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, authors, topics..."
              className="w-full pl-10 pr-8 py-2.5 text-xs font-medium border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074504] focus:outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 w-full md:w-auto justify-between md:justify-end">
            <span className="flex items-center gap-1.5 text-gray-700">
              <Filter className="w-3.5 h-3.5 text-[#074504]" />
              Showing <span className="text-[#074504] font-black">{filteredArticles.length}</span> of {posts.length} articles
            </span>
          </div>
        </div>

        {/* Category Tabs directly derived from article categories */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#074504] text-white border-[#074504] shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#C0991B] text-[#074504]'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const authorInfo = getAuthorDetails(article);
            return (
              <article
                key={article.id || article.slug}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Article Image Header */}
                {article.image && (
                  <div className="h-44 w-full overflow-hidden relative bg-gray-100">
                    <img
                      src={encodeURI(article.image)}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback && article.image.includes(' ')) {
                          target.dataset.triedFallback = 'true';
                          target.src = article.image.replace(/ /g, '_');
                        } else if (!target.dataset.triedUnsplash) {
                          target.dataset.triedUnsplash = 'true';
                          target.src = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[#074504] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black border border-[#074504]/20 shadow-xs flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#C0991B]" /> {article.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    {!article.image && (
                      <div className="flex items-center justify-between text-xs font-bold mb-3">
                        <span className="text-[#826507] bg-amber-50 px-2.5 py-0.5 rounded-full border border-[#C0991B]/30 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#C0991B]" /> {article.category}
                        </span>
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {article.date}
                        </span>
                      </div>
                    )}

                    {article.image && (
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span className="text-gray-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {article.date}
                        </span>
                        {article.readTime && (
                          <span className="text-gray-400 font-medium text-[11px]">
                            {article.readTime}
                          </span>
                        )}
                      </div>
                    )}

                    <h2 className="text-base font-black text-gray-900 leading-snug line-clamp-2 group-hover:text-[#074504] transition-colors mb-2">
                      <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="text-xs text-gray-600 line-clamp-3 font-medium leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Author Section */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      {authorInfo.avatar ? (
                        <img
                          src={encodeURI(authorInfo.avatar)}
                          alt={authorInfo.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.triedFallback && authorInfo.avatar.includes(' ')) {
                              target.dataset.triedFallback = 'true';
                              target.src = authorInfo.avatar.replace(/ /g, '_');
                            }
                          }}
                          className="w-7 h-7 rounded-full object-cover border border-[#074504]"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#074504]/10 text-[#074504] flex items-center justify-center font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 leading-tight">
                          {authorInfo.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {authorInfo.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    to={`/blog/${article.slug}`}
                    className="w-full py-2.5 bg-[#074504] hover:bg-[#053203] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-[#C0991B]/40 shadow-xs group/btn"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C0991B] group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C0991B] flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Articles Found</h3>
          <p className="text-xs text-gray-600 font-medium">
            There are no articles matching category "<span className="font-bold text-gray-900">{selectedCategory}</span>"
            {search && <> and search query "<span className="font-bold text-gray-900">{search}</span>"</>}.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearch('');
            }}
            className="px-5 py-2.5 bg-[#074504] text-white font-extrabold text-xs rounded-xl hover:bg-[#053203] transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
