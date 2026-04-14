import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks, useEvents } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const EventsPreview = () => {
  const blocksQuery = useContentBlocks("home", "events_preview");
  const merged = { ...homeDefaults.events_preview, ...(blocksQuery.data ?? {}) };
  const draft = usePreviewSectionDraft("home", "events_preview", merged);
  const eventsQuery = useEvents(Number(draft.show_count));
  if (blocksQuery.isLoading || eventsQuery.isLoading) return <section className="section-padding"><Skeleton className="h-72 w-full" /></section>;
  if (blocksQuery.error || eventsQuery.error) return <section className="section-padding"><div className="text-sm text-destructive">Failed to load events preview.</div></section>;
  const events = eventsQuery.data ?? [];

  return (
    <section className="section-padding">
      <div className="container-narrow mx-auto">
        <SectionHeader
          title={String(draft.section_heading)}
          subtitle="Stay updated with the latest happenings at our school."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, i: number) => (
            <div
              key={event.id}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={event.image_url ?? ""}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={600}
                  height={400}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                  <Calendar size={12} />
                  <span>{event.event_date ? new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{event.description ?? ""}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/student-life#events"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Events <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
