import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import aboutImg from "@/assets/about-school.jpg";
import heroImg from "@/assets/hero-school.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
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
                Vardhman Shiksha Mandir was established with a vision to provide quality education
                accessible to all. Over the decades, the school has grown from a small institution
                into a premier educational establishment in Daryaganj, Delhi.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded on the principles of academic rigor, moral integrity, and inclusive education,
                the school has consistently produced students who excel in academics, sports, and
                extracurricular activities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, Vardhman Shiksha Mandir stands as a testament to the power of education
                in transforming lives and communities.
              </p>
            </div>
            <img src={heroImg} alt="School Campus" className="rounded-xl shadow-lg" loading="lazy" width={800} height={600} />
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
                To be a centre of educational excellence that nurtures globally competent,
                socially responsible, and ethically grounded individuals who contribute
                positively to society.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border border-border">
              <h3 className="font-heading text-2xl font-semibold text-card-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide a stimulating and supportive learning environment that fosters
                intellectual curiosity, creativity, and character development through a
                balanced curriculum and holistic approach to education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section-padding">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Our Leadership" subtitle="Guided by experienced educators and visionary leaders" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { role: "Chairperson", name: "Shri Placeholder Name", desc: "A visionary leader committed to educational reform and student welfare." },
              { role: "Manager", name: "Shri Placeholder Name", desc: "Ensuring operational excellence and sustainable growth of the institution." },
              { role: "Principal", name: "Dr. Placeholder Name", desc: "An educator with decades of experience fostering academic innovation." },
            ].map((leader) => (
              <div key={leader.role} className="text-center p-8 bg-card rounded-xl border border-border">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-muted-foreground">{leader.name.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">{leader.role}</p>
                <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3">{leader.name}</h3>
                <p className="text-muted-foreground text-sm">{leader.desc}</p>
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
