import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-school.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Vardhman Shiksha Mandir Campus"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-primary-foreground/80 text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-fade-in font-body">
          An English Medium Senior Secondary School
        </p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up leading-tight">
          Vardhman Shiksha Mandir
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in opacity-0 [animation-delay:0.4s] font-body">
          Nurturing minds, building character, and shaping the leaders of tomorrow
          in the heart of Daryaganj, Delhi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in opacity-0 [animation-delay:0.6s]">
          <Link
            to="/admissions"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
          >
            Admissions Open 2026-27
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-medium rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
          >
            Discover Our School
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
