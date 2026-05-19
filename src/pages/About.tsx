import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import schoolBuildingImg from "@/assets/school-building.jpg";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { aboutDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks, useLeadership } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const About = () => {
  const schoolOverviewQuery = useContentBlocks("about", "school_overview");
  const visionQuery = useContentBlocks("about", "vision");
  const missionQuery = useContentBlocks("about", "mission");
  const managerQuery = useContentBlocks("about", "manager_message");
  const principalQuery = useContentBlocks("about", "principal_message");
  const leadershipQuery = useLeadership();
  const leadershipCardsQuery = useContentBlocks("about", "leadership_cards");
  const schoolOverview = usePreviewSectionDraft("about", "school_overview", { ...aboutDefaults.school_overview, ...(schoolOverviewQuery.data ?? {}) });
  const vision = usePreviewSectionDraft("about", "vision", { ...aboutDefaults.vision, ...(visionQuery.data ?? {}) });
  const mission = usePreviewSectionDraft("about", "mission", { ...aboutDefaults.mission, ...(missionQuery.data ?? {}) });
  const managerMessage = usePreviewSectionDraft("about", "manager_message", { ...aboutDefaults.manager_message, ...(managerQuery.data ?? {}) });
  const principalMessage = usePreviewSectionDraft("about", "principal_message", { ...aboutDefaults.principal_message, ...(principalQuery.data ?? {}) });
  const leadershipCards = usePreviewSectionDraft("about", "leadership_cards", { ...aboutDefaults.leadership_cards, ...(leadershipCardsQuery.data ?? {}) });
  const missionPoints = Array.isArray(mission.points) ? mission.points : aboutDefaults.mission.points;
  const leaders = leadershipQuery.data?.length
    ? leadershipQuery.data.map((leader) => ({
        role: leader.role,
        name: leader.name,
        qualification: leader.qualification ?? "",
        bio: leader.bio ?? "",
        photo_url: leader.photo_url ?? "",
      }))
    : Array.isArray(leadershipCards.cards)
      ? leadershipCards.cards
      : aboutDefaults.leadership_cards.cards;

  if (
    schoolOverviewQuery.isLoading ||
    visionQuery.isLoading ||
    missionQuery.isLoading ||
    managerQuery.isLoading ||
    principalQuery.isLoading ||
    leadershipQuery.isLoading ||
    leadershipCardsQuery.isLoading
  ) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-80 w-full" /></section><Footer /></div>;
  }
  if (
    schoolOverviewQuery.error ||
    visionQuery.error ||
    missionQuery.error ||
    managerQuery.error ||
    principalQuery.error ||
    leadershipQuery.error ||
    leadershipCardsQuery.error
  ) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load about page content.</div></section><Footer /></div>;
  }

  return (
    <div className="min-h-screen">
      <PageSEO
        title="About Us"
        description="Learn about Vardhman Shiksha Mandir — established 1976, CBSE affiliated (No. 2730128), located in Daryaganj, New Delhi. Our vision, mission, leadership, and history."
        path="/about"
      />
      <Navbar />
      {/* Page Header */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">About Us</h1>
          <p className="text-muted-foreground text-lg">Learn about our rich history and commitment to excellence</p>
        </div>
      </section>

      {/* History */}
      <section id="history" className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader title="Our History" subtitle="" centered={false} />
              <p className="text-muted-foreground leading-relaxed mb-4">
                {String(schoolOverview.body)}
              </p>
            </div>
            <img src={schoolBuildingImg} alt="School Campus" className="rounded-xl shadow-lg" loading="lazy" width={800} height={600} />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="section-padding bg-muted">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Vision & Mission" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="font-heading text-2xl font-semibold text-card-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                {String(vision.body)}
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="font-heading text-2xl font-semibold text-card-foreground mb-4">Our Mission</h3>
              <ul className="space-y-3 text-muted-foreground leading-relaxed">
                {missionPoints.map((point, index) => (
                  <li key={`${String(point.title)}-${index}`}>
                    <span className="font-semibold text-foreground">{String(point.title)}:</span>{" "}
                    {String(point.description)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/40">
        <div className="container-narrow mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="font-heading text-2xl font-semibold mb-2">{String(managerMessage.title)}</h3>
            <p className="text-sm text-muted-foreground mb-4">{String(managerMessage.name)}</p>
            <p className="text-muted-foreground leading-relaxed">{String(managerMessage.message)}</p>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="font-heading text-2xl font-semibold mb-2">{String(principalMessage.title)}</h3>
            <p className="text-sm text-muted-foreground mb-4">{String(principalMessage.name)}</p>
            <p className="text-muted-foreground leading-relaxed mb-4">{String(principalMessage.message)}</p>
            {principalMessage.quote ? (
              <p className="italic text-sm text-foreground/80">"{String(principalMessage.quote)}"</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section-padding">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Our Leadership" subtitle="Guided by experienced educators and visionary leaders" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, idx) => (
              <div key={`${String(leader.role)}-${idx}`} className="text-center p-8 bg-card rounded-xl border border-border">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-muted-foreground">{String(leader.name).charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">{String(leader.role)}</p>
                <h3 className="font-heading text-xl font-semibold text-card-foreground mb-1">{String(leader.name)}</h3>
                {leader.qualification && (
                  <p className="text-xs text-muted-foreground mb-3">{String(leader.qualification)}</p>
                )}
                <p className="text-muted-foreground text-sm">{String(leader.bio)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
