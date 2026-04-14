import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const HighlightCards = () => {
  const query = useContentBlocks("home", "highlights");
  const merged = { ...homeDefaults.highlights, ...(query.data ?? {}) };
  const draft = usePreviewSectionDraft("home", "highlights", merged);
  const cards = Array.isArray(draft.cards) && draft.cards.length ? draft.cards : homeDefaults.highlights.cards;
  if (query.isLoading) return <section className="section-padding bg-muted"><Skeleton className="h-72 w-full" /></section>;
  if (query.error) return <section className="section-padding bg-muted"><div className="text-sm text-destructive">Failed to load highlights.</div></section>;

  return (
    <section className="section-padding bg-muted">
      <div className="container-narrow mx-auto">
        <SectionHeader
          title="Why Vardhman Shiksha Mandir?"
          subtitle="A tradition of excellence in education, character building, and holistic development."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((item, i) => (
            <Link
              key={String(item.title)}
              to={String(item.link)}
              className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={String(item.image_url)}
                  alt={String(item.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2 text-card-foreground">{String(item.title)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{String(item.description)}</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  Learn More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightCards;
