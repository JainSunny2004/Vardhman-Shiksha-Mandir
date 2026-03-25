import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { highlights } from "@/data/cmsData";
import SectionHeader from "./SectionHeader";

const HighlightCards = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container-narrow mx-auto">
        <SectionHeader
          title="Why Vardhman Shiksha Mandir?"
          subtitle="A tradition of excellence in education, character building, and holistic development."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => (
            <Link
              key={item.title}
              to={item.link}
              className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2 text-card-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  Learn More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightCards;
