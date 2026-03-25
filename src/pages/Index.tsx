import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HighlightCards from "@/components/HighlightCards";
import AboutPreview from "@/components/AboutPreview";
import EventsPreview from "@/components/EventsPreview";
import GalleryPreview from "@/components/GalleryPreview";
import AdmissionsCTA from "@/components/AdmissionsCTA";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnnouncementBanner />
      <HeroSection />
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
