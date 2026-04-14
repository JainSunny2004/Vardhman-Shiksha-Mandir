import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks, useGallery } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryPreview = () => {
  const blocksQuery = useContentBlocks("home", "gallery_preview");
  const merged = { ...homeDefaults.gallery_preview, ...(blocksQuery.data ?? {}) };
  const draft = usePreviewSectionDraft("home", "gallery_preview", merged);
  const galleryQuery = useGallery();
  if (blocksQuery.isLoading || galleryQuery.isLoading) return <section className="section-padding bg-muted"><Skeleton className="h-72 w-full" /></section>;
  if (blocksQuery.error || galleryQuery.error) return <section className="section-padding bg-muted"><div className="text-sm text-destructive">Failed to load gallery preview.</div></section>;
  const gallery = (galleryQuery.data ?? []).slice(0, Number(draft.show_count));

  return (
    <section className="section-padding bg-muted">
      <div className="container-narrow mx-auto">
        <SectionHeader
          title={String(draft.section_heading)}
          subtitle="Glimpses of life at Vardhman Shiksha Mandir."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={img.src_url}
                alt={img.alt_text ?? "Gallery image"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-end">
                <span className="text-primary-foreground text-sm font-medium p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.alt_text ?? "Gallery image"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
