import { useState, useEffect } from "react";
import { MessageSquare, Banknote, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const testimonials = [
  {
    name: "John Njoroge",
    location: "Meru",
    role: "Boda Boda Operator",
    quote: "My boda boda was financed through Neema HEEP's Mali loan. I repay in small daily installments via M-PESA. Now I own two bikes and employ one rider.",
    product: "Mali Asset Loan - KES 80,000",
    image: "/story_1.jpg",
    driveFallback: "https://lh3.googleusercontent.com/d/1QW-IyKDcNwzx_SEhT45c3HgKExQ5OL7n"
  },
  {
    name: "Jane Muthoni",
    location: "Embu",
    role: "Dairy Farmer",
    quote: "With the dairy cow loan, my milk production tripled. I can now comfortably pay my children's school fees without stress.",
    product: "Agribusiness Loan - KES 150,000",
    image: "/story_2.jpg",
    driveFallback: "https://lh3.googleusercontent.com/d/1WXQHhEV0lVjB2zGmekwCL1Pe-XPv2v1q"
  },
  {
    name: "Grace Wanjiku",
    location: "Murang'a",
    role: "Community Leader",
    quote: "The WASH loan allowed us to install clean water piping for our community group. It's more than money; it's improved health for everyone.",
    product: "WASH Loan - KES 200,000",
    image: "/story_3.jpg",
    driveFallback: "https://lh3.googleusercontent.com/d/1ofRLt6cr3gq3Aofna3-BtLkapNCAagOR"
  },
  {
    name: "Antony Kinyua",
    location: "Chuka",
    role: "Business man",
    quote: "The working capital I received helped me expand my hardware store significantly. NEEMA HEEP has been a true partner in my business growth.",
    product: "Working Capital Loan - KES 300,000",
    image: "/story_4.jpg",
    driveFallback: "https://lh3.googleusercontent.com/d/1Ju9yZKYldJ584q3ykPum_bToHB4s-KFu"
  }
];

const locations = ["Embu", "Chuka", "Meru", "Siakago", "Kiritiri", "Muranga"];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[activeIndex];

  return (
    <section className="w-full py-24 bg-[#F4F7F6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-3 justify-center mb-4">
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
              <span className="text-[#C0991B] font-black tracking-[0.2em] text-xs uppercase block">REAL STORIES</span>
              <span className="w-8 h-1 bg-[#599200] rounded-full"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#074504] tracking-tight leading-[1.05] mb-6 uppercase">
              <span className="text-[#C0991B]">Lives Changed</span><br />Across Kenya.
            </h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
              From small market stalls to growing enterprises - our borrowers tell their own stories.
            </p>

            {/* Slider Dots */}
            <div className="flex items-center gap-2 mb-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-10 bg-[#074504]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Location Pills */}
            <div className="flex flex-wrap gap-3">
              {locations.map((loc, i) => (
                <span 
                  key={i}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-semibold bg-transparent"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - The Card */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100"
              >
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-8 shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#C0991B]" />
                </div>

                <p className="text-2xl md:text-[28px] text-gray-800 font-medium leading-normal mb-8">
                  "{t.quote}"
                </p>

                {/* Product Pill */}
                <div className="inline-flex items-center gap-2 bg-[#F4F7F6] text-[#074504] px-4 py-2 rounded-lg font-bold text-sm mb-12">
                  <Banknote className="w-4 h-4 text-[#C0991B]" />
                  {t.product}
                </div>

                <hr className="border-gray-200 mb-8" />

                {/* Footer part */}
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={encodeURI(t.image)} 
                      alt={t.name} 
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback && t.driveFallback) {
                          target.dataset.triedFallback = 'true';
                          target.src = t.driveFallback;
                        } else if (!target.dataset.triedUnsplash) {
                          target.dataset.triedUnsplash = 'true';
                          target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                        }
                      }}
                      className="w-14 h-14 rounded-full object-cover shadow-md" 
                    />
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">{t.name}</h4>
                      <p className="text-gray-500 font-medium">{t.role}, {t.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-[#C0991B] text-[#C0991B]" />
                    ))}
                  </div>
              </div>
            </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
