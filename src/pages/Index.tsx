import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HighlightCards from "@/components/HighlightCards";
import AboutPreview from "@/components/AboutPreview";
import EventsPreview from "@/components/EventsPreview";
import GalleryPreview from "@/components/GalleryPreview";
import AdmissionsCTA from "@/components/AdmissionsCTA";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HomeAnnouncements from "@/components/HomeAnnouncements";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PageSEO
        title="Senior Secondary School, New Delhi"
        description="Vardhman Shiksha Mandir — CBSE affiliated senior secondary school in Daryaganj, New Delhi. Established 1976. Co-educational, Nursery to Class XII. Admissions open for 2026-27."
        path="/"
      />
      <Navbar />
      <AnnouncementBanner />
      <HeroSection />
      <HomeAnnouncements />
      <HighlightCards />
      <AboutPreview />
      <EventsPreview />
      <GalleryPreview />
      <AdmissionsCTA />
      <Footer />
    </div>
  );
};

export default Index;
