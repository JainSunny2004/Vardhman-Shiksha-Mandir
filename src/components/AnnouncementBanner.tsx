import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { defaultAnnouncements, type Announcement } from "@/data/cmsData";

const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("vsm_announcements");
    const data = stored ? JSON.parse(stored) : defaultAnnouncements;
    setAnnouncements(data.filter((a: Announcement) => a.active));
  }, []);

  const current = announcements[0];
  if (!visible || !current) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-secondary text-secondary-foreground py-2.5 px-4">
      <div className="container-narrow mx-auto flex items-center justify-between">
        <p className="text-sm font-medium">
          📢 {current.title}: {current.content}
        </p>
        <button onClick={() => setVisible(false)} className="ml-4 shrink-0 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
