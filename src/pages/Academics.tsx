import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import academicsImg from "@/assets/academics.jpg";
import { BookOpen, Beaker, Calculator, Globe, Palette, Dumbbell } from "lucide-react";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";

const defaultDepartments = [
  { name: "English & Languages", icon_name: "BookOpen", description: "Comprehensive language programs developing communication and literary skills." },
  { name: "Science", icon_name: "Beaker", description: "Hands-on learning in Physics, Chemistry, and Biology with modern lab facilities." },
  { name: "Mathematics", icon_name: "Calculator", description: "Building analytical thinking and problem-solving skills." },
  { name: "Social Studies", icon_name: "Globe", description: "Understanding history, geography, civics, and economics." },
  { name: "Arts & Humanities", icon_name: "Palette", description: "Nurturing creativity through visual arts and performing arts." },
  { name: "Physical Education", icon_name: "Dumbbell", description: "Promoting fitness and sportsmanship." },
];

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Beaker,
  Calculator,
  Globe,
  Palette,
  Dumbbell,
};

const Academics = () => {
  const overviewQuery = useContentBlocks("academics", "overview_text");
  const levelsQuery = useContentBlocks("academics", "class_levels");
  const departmentsQuery = useContentBlocks("academics", "departments_grid");
  const additionalQuery = useContentBlocks("academics", "additional_facilities_text");

  if (overviewQuery.isLoading || levelsQuery.isLoading || departmentsQuery.isLoading || additionalQuery.isLoading) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-80 w-full" /></section><Footer /></div>;
  }
  if (overviewQuery.error || levelsQuery.error || departmentsQuery.error || additionalQuery.error) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load academics content.</div></section><Footer /></div>;
  }

  const overview = usePreviewSectionDraft("academics", "overview_text", { body: "", ...(overviewQuery.data ?? {}) });
  const levels = usePreviewSectionDraft("academics", "class_levels", {
    primary_body: "",
    secondary_body: "",
    senior_body: "",
    ...(levelsQuery.data ?? {}),
  });
  const departmentsDraft = usePreviewSectionDraft("academics", "departments_grid", {
    items: Array.isArray(departmentsQuery.data?.items)
      ? (departmentsQuery.data?.items as Array<{ name: string; icon_name: string; description: string }>)
      : defaultDepartments,
  });
  const departments = Array.isArray(departmentsDraft.items) ? departmentsDraft.items : defaultDepartments;
  const additional = usePreviewSectionDraft("academics", "additional_facilities_text", { body: "", ...(additionalQuery.data ?? {}) });

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Academics"
        description="CBSE curriculum from Nursery to Class XII at Vardhman Shiksha Mandir. Science (PCB/PCM), Commerce, and Humanities streams. Strong departments in English, Science, Maths, Social Studies, Arts, and Physical Education."
        path="/academics"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Academics</h1>
          <p className="text-muted-foreground text-lg">Excellence in education through a comprehensive CBSE curriculum</p>
        </div>
      </section>

      <section id="curriculum" className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader title="Our Curriculum" centered={false} />
              <p className="text-muted-foreground leading-relaxed mb-4">{String(overview.body ?? "Curriculum details coming soon.")}</p>
              <ul className="space-y-3 text-muted-foreground">
                {[String(levels.primary_body ?? "Primary (Class I to V)"), String(levels.secondary_body ?? "Secondary (Class VI to X)"), String(levels.senior_body ?? "Senior Secondary (Class XI to XII)")].map((level) => (
                  <li key={level} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                    {level}
                  </li>
                ))}
              </ul>
            </div>
            <img src={academicsImg} alt="Science Lab" className="rounded-xl shadow-lg" loading="lazy" width={800} height={600} />
          </div>
        </div>
      </section>

      <section id="departments" className="section-padding bg-muted">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Departments" subtitle="Expert faculty across all disciplines" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => {
              const Icon = iconMap[dept.icon_name] ?? BookOpen;
              return (
                <div key={dept.name} className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
                  <Icon className="text-primary mb-4 group-hover:text-secondary transition-colors" size={32} />
                  <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{dept.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{dept.description}</p>
                </div>
              );
            })}
          </div>
          {additional.body ? <p className="mt-8 text-muted-foreground">{String(additional.body)}</p> : null}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academics;
