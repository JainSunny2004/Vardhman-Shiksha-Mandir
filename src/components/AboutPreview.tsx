import { Link } from "react-router-dom";
import aboutImg from "@/assets/about-school.jpg";

const AboutPreview = () => {
  return (
    <section className="section-padding">
      <div className="container-narrow mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-secondary mb-4">About Our School</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              A Legacy of Excellence in Education
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vardhman Shiksha Mandir, located in the historic Daryaganj area of Delhi, has been
              a beacon of quality education. Our institution blends traditional Indian values
              with modern pedagogical approaches to create well-rounded individuals.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With dedicated faculty, world-class infrastructure, and a nurturing environment,
              we empower every student to achieve their fullest potential.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all duration-300"
            >
              Read Our Story
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={aboutImg}
                alt="School Library"
                className="rounded-xl shadow-lg w-full"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg hidden md:block">
                <div className="text-3xl font-heading font-bold">25+</div>
                <div className="text-sm text-primary-foreground/80">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
