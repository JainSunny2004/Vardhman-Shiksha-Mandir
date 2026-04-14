import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { Calendar } from "lucide-react";
import studentLifeImg from "@/assets/student-life.jpg";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { studentLifeDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks, useEvents } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const StudentLife = () => {
  const introQuery = useContentBlocks("student-life", "intro");
  const activitiesQuery = useContentBlocks("student-life", "activities");
  const clubsQuery = useContentBlocks("student-life", "clubs");
  const eventsQuery = useEvents();
  if (introQuery.isLoading || activitiesQuery.isLoading || clubsQuery.isLoading || eventsQuery.isLoading) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-72 w-full" /></section><Footer /></div>;
  }
  if (introQuery.error || activitiesQuery.error || clubsQuery.error || eventsQuery.error) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load student life content.</div></section><Footer /></div>;
  }
  const intro = usePreviewSectionDraft("student-life", "intro", { ...studentLifeDefaults.intro, ...(introQuery.data ?? {}) });
  const activities = usePreviewSectionDraft("student-life", "activities", { ...studentLifeDefaults.activities, ...(activitiesQuery.data ?? {}) });
  const clubs = usePreviewSectionDraft("student-life", "clubs", { ...studentLifeDefaults.clubs, ...(clubsQuery.data ?? {}) });
  const events = eventsQuery.data ?? [];
  const activityItems = Array.isArray(activities.items) ? activities.items : studentLifeDefaults.activities.items;
  const clubCards = Array.isArray(clubs.cards) ? clubs.cards : studentLifeDefaults.clubs.cards;

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Student Life"
        description="Discover vibrant student life at Vardhman Shiksha Mandir — clubs, cultural events, debate, art, sports, music, and more. A community of learning and creativity."
        path="/student-life"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{String(intro.heading)}</h1>
          <p className="text-muted-foreground text-lg">{String(intro.subheading)}</p>
        </div>
      </section>

      <section id="activities" className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <img src={studentLifeImg} alt="Cultural Program" className="rounded-xl shadow-lg" loading="lazy" width={800} height={600} />
            <div>
              <SectionHeader title="Activities" centered={false} />
              <p className="text-muted-foreground leading-relaxed mb-6">
                Beyond academics, we offer a wide range of co-curricular activities that help
                students discover their passions and develop life skills.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activityItems.map((activity, index) => (
                  <div key={`${String(activity.name)}-${index}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {String(activity.name)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="clubs" className="section-padding bg-muted">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Clubs" subtitle="Join a community that shares your interests" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubCards.map((club, index) => (
              <div key={`${String(club.name)}-${index}`} className="bg-card p-6 rounded-xl border border-border text-center hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{String(club.name)}</h3>
                <p className="text-muted-foreground text-sm">{String(club.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="section-padding">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Events" subtitle="Celebrating milestones and achievements" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={event.image_url ?? ""} alt={event.title} className="w-full h-full object-cover" loading="lazy" width={600} height={400} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                    <Calendar size={12} />
                    {event.event_date ? new Date(event.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm">{event.description ?? ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentLife;
