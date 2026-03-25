import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { Monitor, BookOpen, Dumbbell, Beaker, Music, Utensils } from "lucide-react";

const facilities = [
  { name: "Smart Classrooms", icon: Monitor, desc: "Interactive digital boards and audio-visual aids for immersive learning experiences." },
  { name: "Library", icon: BookOpen, desc: "A well-stocked library with thousands of books, journals, and digital resources." },
  { name: "Sports Complex", icon: Dumbbell, desc: "Multi-sport facilities including cricket, basketball, football, and athletics track." },
  { name: "Science Labs", icon: Beaker, desc: "Fully equipped Physics, Chemistry, Biology, and Computer Science laboratories." },
  { name: "Auditorium", icon: Music, desc: "A modern auditorium for cultural events, seminars, and school assemblies." },
  { name: "Cafeteria", icon: Utensils, desc: "Hygienic and nutritious meal options served in a clean dining environment." },
];

const Facilities = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Facilities</h1>
          <p className="text-muted-foreground text-lg">World-class infrastructure for holistic development</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f) => (
              <div key={f.name} className="bg-card p-8 rounded-xl border border-border hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3">{f.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Facilities;
