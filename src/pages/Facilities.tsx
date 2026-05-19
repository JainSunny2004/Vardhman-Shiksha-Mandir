import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Monitor, BookOpen, Dumbbell, Beaker, Music, Utensils, Shield, GraduationCap, Heart } from "lucide-react";
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
        </div>
      </section>

      {/* Additional Facilities */}
      <section className="section-padding bg-muted">
        <div className="container-narrow mx-auto">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Additional Facilities</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Vardhman Shiksha Mandir is set on a <span className="font-medium text-foreground">5,059 sq. metre urban campus</span> in Daryaganj, New Delhi, designed to nurture every dimension of student life — academic, physical, and personal. Beyond the core classrooms, students have access to airy, blackboard-equipped classrooms, dedicated science and computer laboratories, a well-stocked library, and spaces for indoor and outdoor sports, dance, and music.
          </p>

          {/* Infrastructure highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { title: "Campus", body: "5,059 sq. m. of green urban campus providing ample space for learning, sport, and recreation." },
              { title: "Classrooms", body: "Airy rooms fitted with blackboards and modern amenities for a focused learning atmosphere." },
              { title: "Laboratories", body: "Science and Computer labs equipped for hands-on experimentation and digital literacy." },
              { title: "Library", body: "A curated collection of academic and recreational books supporting every interest and grade level." },
              { title: "Sports", body: "Indoor game rooms and an outdoor sports ground fostering fitness, teamwork, and sportsmanship." },
              { title: "Performing Arts", body: "Dedicated dance and music rooms for students to explore and develop their creative talents." },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                <h4 className="font-heading font-semibold text-card-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Safety & Security */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="text-primary" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground">Safety &amp; Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "CCTV Surveillance", body: "Security cameras cover the entire premises, ensuring every corner of the campus remains monitored and safe throughout the school day." },
                { title: "Fire Safety Compliance", body: "The school has fulfilled all fire prevention and safety requirements mandated by the Delhi Fire Service, with extinguishers and evacuation plans in place." },
                { title: "Emergency Preparedness", body: "Regular drills and documented emergency protocols keep staff and students ready to respond calmly and effectively in any situation." },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-heading font-semibold text-card-foreground mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Services */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="text-primary" size={20} />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground">Student Support Services</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We believe academic success and personal well-being go hand in hand. Our counselling team works alongside teachers and parents to give every student the support they need.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: GraduationCap,
                  title: "Academic Counselling",
                  points: [
                    "Subject and stream selection aligned with strengths and career goals",
                    "Study skills, time management, and exam preparation guidance",
                    "Career and higher-education pathway advisory",
                  ],
                },
                {
                  icon: Heart,
                  title: "Personal Counselling",
                  points: [
                    "Safe, confidential space to discuss personal challenges and stress",
                    "Peer and teacher conflict resolution support",
                    "Mental health awareness and confidence-building programmes",
                  ],
                },
                {
                  icon: Shield,
                  title: "Parental Engagement",
                  points: [
                    "Regular parent–teacher–counsellor meetings to track progress",
                    "Workshops on supporting children's academic and emotional growth",
                    "Open-door policy for parents to raise concerns at any time",
                  ],
                },
              ].map(({ icon: Icon, title, points }) => (
                <div key={title} className="bg-card rounded-xl border border-border p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <h4 className="font-heading font-semibold text-card-foreground mb-3">{title}</h4>
                  <ul className="space-y-2">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Facilities;

