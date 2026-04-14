import { Link } from "react-router-dom";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const AdmissionsCTA = () => {
  const query = useContentBlocks("home", "admissions_cta");
  const merged = { ...homeDefaults.admissions_cta, ...(query.data ?? {}) };
  const draft = usePreviewSectionDraft("home", "admissions_cta", merged);
  if (query.isLoading) return <section className="section-padding"><Skeleton className="h-56 w-full" /></section>;
  if (query.error) return <section className="section-padding"><div className="text-sm text-destructive">Failed to load admissions CTA.</div></section>;

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--secondary)),transparent_70%)]" />
      <div className="relative z-10 container-narrow mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
          {String(draft.heading)}
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
          {String(draft.subheading)} {String(draft.session_year)}. Join our community of learners and leaders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/admissions"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-foreground text-primary font-semibold rounded-full hover:bg-primary-foreground/90 transition-all duration-300 hover:shadow-lg"
          >
            {String(draft.button_label)}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-medium rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsCTA;
