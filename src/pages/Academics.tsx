import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import academicsImg from "@/assets/academics.jpg";
import { BookOpen, Beaker, Calculator, Globe, Palette, Dumbbell } from "lucide-react";

const departments = [
  { name: "English & Languages", icon: BookOpen, desc: "Comprehensive language programs developing communication and literary skills." },
  { name: "Science", icon: Beaker, desc: "Hands-on learning in Physics, Chemistry, and Biology with modern lab facilities." },
  { name: "Mathematics", icon: Calculator, desc: "Building analytical thinking and problem-solving skills from fundamentals to advanced levels." },
  { name: "Social Studies", icon: Globe, desc: "Understanding history, geography, civics, and economics through experiential learning." },
  { name: "Arts & Humanities", icon: Palette, desc: "Nurturing creativity through visual arts, music, dance, and performing arts." },
  { name: "Physical Education", icon: Dumbbell, desc: "Promoting fitness, sportsmanship, and team spirit through diverse athletic programs." },
];

const Academics = () => {
  return (
    <div className="min-h-screen">
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
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vardhman Shiksha Mandir follows the CBSE curriculum from Nursery to Class XII,
                offering streams in Science, Commerce, and Humanities at the senior secondary level.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our teaching methodology integrates traditional classroom instruction with
                project-based learning, digital tools, and experiential activities.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {["Pre-Primary (Nursery to KG)", "Primary (Class I to V)", "Middle School (Class VI to VIII)", "Secondary (Class IX to X)", "Senior Secondary (Class XI to XII)"].map((level) => (
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
            {departments.map((dept) => (
              <div key={dept.name} className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 group">
                <dept.icon className="text-primary mb-4 group-hover:text-secondary transition-colors" size={32} />
                <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{dept.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academics;
