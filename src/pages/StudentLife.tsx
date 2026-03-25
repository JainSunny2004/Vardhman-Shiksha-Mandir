import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { Calendar } from "lucide-react";
import studentLifeImg from "@/assets/student-life.jpg";
import { defaultEvents } from "@/data/cmsData";

const activities = [
  "Debate & Public Speaking", "Creative Writing", "Art & Craft", "Music & Dance",
  "Robotics", "Coding Club", "Photography", "Environmental Club",
];

const clubs = [
  { name: "Science Club", desc: "Exploring science through experiments and projects." },
  { name: "Literary Club", desc: "Fostering a love for reading, writing, and poetry." },
  { name: "Eco Club", desc: "Promoting environmental awareness and sustainability." },
  { name: "Sports Club", desc: "Encouraging fitness and competitive sportsmanship." },
];

const StudentLife = () => {
  const events = JSON.parse(localStorage.getItem("vsm_events") || "null") || defaultEvents;

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Student Life</h1>
          <p className="text-muted-foreground text-lg">A vibrant community of learning, growth, and creativity</p>
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
                {activities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {a}
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
            {clubs.map((club) => (
              <div key={club.name} className="bg-card p-6 rounded-xl border border-border text-center hover:shadow-lg transition-all duration-300">
                <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{club.name}</h3>
                <p className="text-muted-foreground text-sm">{club.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="section-padding">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Events" subtitle="Celebrating milestones and achievements" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event: typeof defaultEvents[0]) => (
              <div key={event.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" width={600} height={400} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                    <Calendar size={12} />
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm">{event.description}</p>
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
