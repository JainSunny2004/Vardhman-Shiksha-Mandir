import { useState } from "react";
import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useGallery } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const Gallery = () => {
  const galleryQuery = useGallery();
  const [active, setActive] = useState("All");

  if (galleryQuery.isLoading) return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-80 w-full" /></section><Footer /></div>;
  if (galleryQuery.error) return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load gallery.</div></section><Footer /></div>;
  const gallery = galleryQuery.data ?? [];
  const categories = ["All", ...Array.from(new Set(gallery.map((g) => g.category ?? "General")))];

  const filtered = active === "All" ? gallery : gallery.filter((g) => (g.category ?? "General") === active);

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Photo Gallery"
        description="Browse the Vardhman Shiksha Mandir photo gallery — school events, cultural programmes, sports, campus life, and student activities in Daryaganj, New Delhi."
        path="/gallery"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Gallery</h1>
          <p className="text-muted-foreground text-lg">A visual journey through our school</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((img) => (
              <div key={img.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={img.src_url}
                  alt={img.alt_text ?? "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={600}
                  height={450}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6">
                    <p className="text-primary-foreground font-medium">{img.alt_text ?? "Gallery image"}</p>
                    <p className="text-primary-foreground/70 text-sm">{img.category}</p>
                  </div>
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

export default Gallery;
