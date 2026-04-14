import { Link } from "react-router-dom";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const AboutPreview = () => {
  const query = useContentBlocks("home", "about_preview");
  const merged = { ...homeDefaults.about_preview, ...(query.data ?? {}) };
  const draft = usePreviewSectionDraft("home", "about_preview", merged);
  if (query.isLoading) return <section className="section-padding"><Skeleton className="h-72 w-full" /></section>;
  if (query.error) return <section className="section-padding"><div className="text-sm text-destructive">Failed to load About preview.</div></section>;

  return (
    <section className="section-padding">
      <div className="container-narrow mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-secondary mb-4">About Our School</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {String(draft.heading)}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {String(draft.body)}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all duration-300"
            >
              {String(draft.button_label)}
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={String(draft.image_url)}
                alt="School Library"
                className="rounded-xl shadow-lg w-full"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg hidden md:block">
                <div className="text-3xl font-heading font-bold">{String(draft.years_badge)}</div>
                <div className="text-sm text-primary-foreground/80">49+ Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
