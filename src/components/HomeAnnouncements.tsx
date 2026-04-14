import SectionHeader from "@/components/SectionHeader";
import { useAnnouncements } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const HomeAnnouncements = () => {
  const announcementsQuery = useAnnouncements();

  if (announcementsQuery.isLoading) {
    return (
      <section className="section-padding bg-muted/40">
        <div className="container-narrow mx-auto">
          <Skeleton className="h-64 w-full" />
        </div>
      </section>
    );
  }

  if (announcementsQuery.error) {
    return (
      <section className="section-padding bg-muted/40">
        <div className="container-narrow mx-auto">
          <div className="text-sm text-destructive">Failed to load announcements.</div>
        </div>
      </section>
    );
  }

  const announcements = announcementsQuery.data ?? [];

  return (
    <section className="section-padding bg-muted/40">
      <div className="container-narrow mx-auto">
        <SectionHeader
          title="Latest Announcements"
          subtitle="All active school updates in one place."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-heading text-xl font-semibold text-card-foreground">{item.title}</h3>
                {item.important ? (
                  <span className="text-xs rounded-full bg-secondary/15 text-secondary px-2 py-1 font-medium">
                    Important
                  </span>
                ) : null}
              </div>
              {item.date ? <p className="text-xs text-muted-foreground mb-2">{item.date}</p> : null}
              <p className="text-sm text-muted-foreground">{item.content ?? ""}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAnnouncements;
