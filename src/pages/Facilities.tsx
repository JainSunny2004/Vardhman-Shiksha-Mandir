import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Monitor, BookOpen, Dumbbell, Beaker, Music, Utensils } from "lucide-react";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  BookOpen,
  Dumbbell,
  Beaker,
  Music,
  Utensils,
};

const defaultFacilities = [
  { name: "Smart Classrooms", description: "Interactive digital boards and audio-visual aids.", icon_name: "Monitor" },
  { name: "Library", description: "Well-stocked library with books and digital resources.", icon_name: "BookOpen" },
  { name: "Sports Complex", description: "Facilities for cricket, basketball, football, athletics.", icon_name: "Dumbbell" },
];

const Facilities = () => {
  const introQuery = useContentBlocks("facilities", "intro_text");
  const gridQuery = useContentBlocks("facilities", "facilities_grid");
  const safetyQuery = useContentBlocks("facilities", "safety_measures");
  const supportQuery = useContentBlocks("facilities", "support_services");

  if (introQuery.isLoading || gridQuery.isLoading || safetyQuery.isLoading || supportQuery.isLoading) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-80 w-full" /></section><Footer /></div>;
  }
  if (introQuery.error || gridQuery.error || safetyQuery.error || supportQuery.error) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load facilities content.</div></section><Footer /></div>;
  }

  const intro = introQuery.data ?? {};
  const facilities = Array.isArray(gridQuery.data?.items)
    ? (gridQuery.data?.items as Array<{ name: string; description: string; icon_name: string }>)
    : defaultFacilities;

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Facilities"
        description="Explore the facilities at Vardhman Shiksha Mandir — science labs, computer lab, library, sports ground, smart classrooms, and special education support on a 5059 sq. meter campus in Daryaganj, Delhi."
        path="/facilities"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{String(intro.heading ?? "Facilities")}</h1>
          <p className="text-muted-foreground text-lg">{String(intro.subheading ?? "World-class infrastructure for holistic development")}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f) => {
              const Icon = iconMap[f.icon_name] ?? Monitor;
              return (
                <div key={f.name} className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="text-primary" size={28} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3">{f.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
          {safetyQuery.data?.body ? <p className="mt-8 text-muted-foreground">{String(safetyQuery.data.body)}</p> : null}
          {supportQuery.data?.body ? <p className="mt-3 text-muted-foreground">{String(supportQuery.data.body)}</p> : null}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Facilities;

