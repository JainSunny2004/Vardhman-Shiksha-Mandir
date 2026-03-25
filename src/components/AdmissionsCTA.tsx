import { Link } from "react-router-dom";

const AdmissionsCTA = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--secondary)),transparent_70%)]" />
      <div className="relative z-10 container-narrow mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
          Begin Your Child's Journey
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
          Admissions are now open for the academic session 2026-27.
          Join our community of learners and leaders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/admissions"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-foreground text-primary font-semibold rounded-full hover:bg-primary-foreground/90 transition-all duration-300 hover:shadow-lg"
          >
            Apply Now
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-medium rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsCTA;
