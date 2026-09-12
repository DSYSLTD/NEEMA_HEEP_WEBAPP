/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';
import ScrollHandler from './components/ScrollHandler';
import PageNavigation from './components/PageNavigation';
import StickyWhatsApp from './components/StickyWhatsApp';
import TrackingManager from './components/TrackingManager';
import AdminGuard from './components/AdminGuard';

// Direct imports for core primary pages to guarantee immediate availability without dynamic chunk errors
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import LoanProductsIndex from './pages/LoanProductsIndex';
import Programs from './pages/Programs';
import JoinUs from './pages/JoinUs';
import Careers from './pages/Careers';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';

// Robust lazy loading helper with automatic retry for chunk load failures
function lazyWithRetry(componentImport: () => Promise<any>) {
  return lazy(async () => {
    const pageHasBeenRetried = JSON.parse(
      window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
    );
    try {
      const component = await componentImport();
      window.sessionStorage.setItem('retry-lazy-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasBeenRetried) {
        window.sessionStorage.setItem('retry-lazy-refreshed', 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      throw error;
    }
  });
}

// Lazy loaded secondary/extended pages
const LoanProduct = lazyWithRetry(() => import('./pages/LoanProduct'));
const Volunteer = lazyWithRetry(() => import('./pages/Volunteer'));
const EducationSupport = lazyWithRetry(() => import('./pages/EducationSupport'));
const CommunityHealth = lazyWithRetry(() => import('./pages/CommunityHealth'));
const EconomicEmpowerment = lazyWithRetry(() => import('./pages/EconomicEmpowerment'));
const Beneficiaries = lazyWithRetry(() => import('./pages/Beneficiaries'));
const SponsorshipRequest = lazyWithRetry(() => import('./pages/SponsorshipRequest'));
const Donors = lazyWithRetry(() => import('./pages/Donors'));
const Registration = lazyWithRetry(() => import('./pages/Registration'));
const Article = lazyWithRetry(() => import('./pages/Article'));
const AuthorProfile = lazyWithRetry(() => import('./pages/AuthorProfile'));
const MembersPortal = lazyWithRetry(() => import('./pages/MembersPortal'));
const LegalPage = lazyWithRetry(() => import('./pages/LegalPage'));
const CurrentRates = lazyWithRetry(() => import('./pages/CurrentRates'));
const PreQualification = lazyWithRetry(() => import('./pages/PreQualification'));
const ClientTestimonials = lazyWithRetry(() => import('./pages/ClientTestimonials'));
const ProcessAndCompliance = lazyWithRetry(() => import('./pages/ProcessAndCompliance'));
const ChecklistsPage = lazyWithRetry(() => import('./pages/ChecklistsPage'));
const TalkToUsPage = lazyWithRetry(() => import('./pages/TalkToUsPage'));
const RequirementsPage = lazyWithRetry(() => import('./pages/RequirementsPage'));
const JobApplication = lazyWithRetry(() => import('./pages/JobApplication'));
const RequestCallBack = lazyWithRetry(() => import('./pages/RequestCallBack'));
const RequestPartnership = lazyWithRetry(() => import('./pages/RequestPartnership'));
const AdminDashboard = lazyWithRetry(() => import('./pages/AdminDashboard'));
const NewsletterSubscribe = lazyWithRetry(() => import('./pages/NewsletterSubscribe'));
const ThankYou = lazyWithRetry(() => import('./pages/ThankYou'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#074504]/20 border-t-[#074504] rounded-full animate-spin" />
        <span className="text-xs font-black uppercase tracking-widest text-[#074504]">Loading...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isPortal = location.pathname.startsWith('/staff-portal') || location.pathname === '/portal';
  const isBlog = location.pathname.startsWith('/blog');
  const isVolunteer = location.pathname === '/volunteer' || location.pathname === '/volunteers';
  const isDashboardOrPortal = isAdmin || isPortal;
  const hideFloatingButtons = isDashboardOrPortal || isBlog || isVolunteer;

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-[#f8faf8] relative overflow-hidden md:overflow-visible ${isAdmin ? 'pt-0' : 'pt-[88px]'}`}>
      {!isAdmin && <Header />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newsletter-subscribe" element={<NewsletterSubscribe />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/loans" element={<LoanProductsIndex />} />
          <Route path="/loans/:loanId" element={<LoanProduct />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/registration" element={<JoinUs />} />
          <Route path="/portal-activation" element={<Registration />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/volunteers" element={<Volunteer />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/education-support" element={<EducationSupport />} />
          <Route path="/programs/community-health" element={<CommunityHealth />} />
          <Route path="/programs/economic-empowerment" element={<EconomicEmpowerment />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/sponsorship" element={<SponsorshipRequest />} />
          <Route path="/partnership" element={<Donors />} />
          <Route path="/partners" element={<Donors />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/impact" element={<Programs />} />
          <Route path="/client-testimonials" element={<ClientTestimonials />} />
          <Route path="/process-and-compliance" element={<ProcessAndCompliance />} />
          <Route path="/request-partnership" element={<RequestPartnership />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply" element={<JobApplication />} />
          <Route path="/job-application" element={<JobApplication />} />
          <Route 
            path="/admin" 
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            } 
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/author/:authorId" element={<AuthorProfile />} />
          <Route path="/author" element={<Navigate to="/author/patrick-munene" replace />} />
          <Route path="/portal" element={<MembersPortal />} />
          <Route path="/staff-portal" element={<MembersPortal />} />
          <Route path="/privacy-policy" element={<LegalPage />} />
          <Route path="/terms-conditions" element={<LegalPage />} />
          <Route path="/regulatory-disclosures" element={<LegalPage />} />
          <Route path="/calculator" element={<Navigate to="/pre-qualification" replace />} />
          <Route path="/mortgage-calculator" element={<Navigate to="/pre-qualification" replace />} />
          <Route path="/current-rates" element={<CurrentRates />} />
          <Route path="/pre-qualification" element={<PreQualification />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/talk-to-us" element={<TalkToUsPage />} />
          <Route path="/request-callback" element={<RequestCallBack />} />
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!isAdmin && <PageNavigation />}
      {!isAdmin && <Footer />}
      {!hideFloatingButtons && <FloatingCTA />}
      {!hideFloatingButtons && <StickyWhatsApp />}
      <TrackingManager />
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Neema HEEP Microfinance</h2>
            <p className="text-sm text-gray-600 mb-6">We encountered a temporary issue displaying this section. Please click below to refresh.</p>
            <button 
              onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
              className="bg-[#074504] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#053203] transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollHandler />
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
