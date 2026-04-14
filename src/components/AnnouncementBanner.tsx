import { useState } from "react";
import { X } from "lucide-react";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useAnnouncements, useContentBlocks } from "@/hooks/useContentBlocks";

const AnnouncementBanner = () => {
  const bannerQuery = useContentBlocks("home", "announcement_banner");
  const merged = {
    ...homeDefaults.announcement_banner,
    ...(bannerQuery.data ?? {}),
  };
  const draft = usePreviewSectionDraft("home", "announcement_banner", merged);
  const announcementsQuery = useAnnouncements();
  const [visible, setVisible] = useState(true);

  const importantAnnouncements = (announcementsQuery.data ?? []).filter((item) => Boolean(item.important));
  const marqueeText = importantAnnouncements
    .map((item) => `${item.title}${item.content ? `: ${item.content}` : ""}`)
    .join("  •  ");

  if (!visible || !marqueeText || !draft.active) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-secondary text-secondary-foreground py-2.5 px-4">
      <div className="container-narrow mx-auto flex items-center justify-between">
        <div className="flex-1 overflow-hidden pr-4">
          <div className="announcement-marquee-track">
            <p className="announcement-marquee-item text-sm font-medium">[Important] {marqueeText}</p>
            <p className="announcement-marquee-item text-sm font-medium" aria-hidden>
              [Important] {marqueeText}
            </p>
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="ml-4 shrink-0 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
