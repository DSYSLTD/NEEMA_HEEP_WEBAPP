import { Link } from 'react-router-dom';
import TestimonialCarousel from '../components/TestimonialCarousel';

export default function ClientTestimonials() {
  return (
    <main className="flex-grow flex flex-col items-center w-full bg-[#f8faf8] font-sans pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col lg:flex-row gap-12 items-start">
        <div className="w-full lg:w-2/3">
          <TestimonialCarousel />
        </div>

        {/* Sidebar CTA */}
        <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center sticky top-32">
          <div className="w-16 h-16 bg-[#F4F7F6] rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-[#C0991B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-[#074504] mb-4">
            Write Your Own Success Story
          </h3>
          <p className="text-gray-600 font-medium mb-8">
            Your journey to financial independence starts here. Reach out to our team to see how we can fuel your growth.
          </p>
          <Link
            to="/mortgage-calculator"
            className="w-full bg-[#C0991B] hover:bg-[#A38217] text-[#074504] font-bold py-4 rounded-full transition-all shadow-[0_4px_14px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
          >
            Start Here →
          </Link>
          <p className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-wider">
            Check your eligibility in 2 minutes
          </p>
        </div>
    </div>
</main>
  );
}
