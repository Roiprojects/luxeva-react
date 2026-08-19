import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { getServices } from "@/lib/content";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Portfolio from "@/pages/Portfolio";
import ProjectDetail from "@/pages/ProjectDetail";
import Testimonials from "@/pages/Testimonials";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminContentEditor from "@/pages/admin/AdminContentEditor";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";
import AdminMediaLibrary from "@/pages/admin/AdminMediaLibrary";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";

/** Scroll to top on every route change. */
function ScrollToTopOnNav() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  const serviceLinks = getServices().map((s) => ({
    slug: s.slug,
    title: s.title,
    category: s.category,
  }));

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Admin (no public layout) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="home" element={<AdminContentEditor />} />
          <Route path="about" element={<AdminContentEditor />} />
          <Route path="rooms" element={<AdminContentEditor />} />
          <Route path="services" element={<AdminContentEditor />} />
          <Route path="portfolio" element={<AdminContentEditor />} />
          <Route path="faqs" element={<AdminContentEditor />} />
          <Route path="testimonials" element={<AdminContentEditor />} />
          <Route path="leadership" element={<AdminContentEditor />} />
          <Route path="contact-settings" element={<AdminContentEditor />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="media" element={<AdminMediaLibrary />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── Public site ── */}
        <Route path="/*" element={
          <>
            <ScrollToTopOnNav />
            <ScrollProgress />
            <Header services={serviceLinks} />
            <main id="main" className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<ProjectDetail />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
            <FloatingContact />
            <ScrollToTop />
            <div aria-hidden className="lg:hidden" style={{ height: "calc(58px + env(safe-area-inset-bottom))" }} />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}
