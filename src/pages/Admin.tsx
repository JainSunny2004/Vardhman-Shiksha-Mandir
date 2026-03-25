import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Edit, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import {
  defaultEvents,
  defaultGallery,
  defaultAnnouncements,
  type Event,
  type GalleryImage,
  type Announcement,
} from "@/data/cmsData";

type Tab = "events" | "gallery" | "announcements";

const Admin = () => {
  const [tab, setTab] = useState<Tab>("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Event form
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", image: "" });
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  // Announcement form
  const [annForm, setAnnForm] = useState({ title: "", content: "", date: "" });
  const [editingAnn, setEditingAnn] = useState<string | null>(null);

  useEffect(() => {
    setEvents(JSON.parse(localStorage.getItem("vsm_events") || "null") || defaultEvents);
    setGallery(JSON.parse(localStorage.getItem("vsm_gallery") || "null") || defaultGallery);
    setAnnouncements(JSON.parse(localStorage.getItem("vsm_announcements") || "null") || defaultAnnouncements);
  }, []);

  const saveEvents = (data: Event[]) => {
    setEvents(data);
    localStorage.setItem("vsm_events", JSON.stringify(data));
  };
  const saveAnnouncements = (data: Announcement[]) => {
    setAnnouncements(data);
    localStorage.setItem("vsm_announcements", JSON.stringify(data));
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      toast.error("Please fill all fields");
      return;
    }
    if (editingEvent) {
      const updated = events.map((e) =>
        e.id === editingEvent ? { ...e, ...eventForm } : e
      );
      saveEvents(updated);
      setEditingEvent(null);
      toast.success("Event updated");
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventForm,
        image: eventForm.image || defaultEvents[0].image,
      };
      saveEvents([...events, newEvent]);
      toast.success("Event added");
    }
    setEventForm({ title: "", description: "", date: "", image: "" });
  };

  const handleDeleteEvent = (id: string) => {
    saveEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event.id);
    setEventForm({ title: event.title, description: event.description, date: event.date, image: event.image });
  };

  const handleAddAnnouncement = () => {
    if (!annForm.title || !annForm.content) {
      toast.error("Please fill all fields");
      return;
    }
    if (editingAnn) {
      const updated = announcements.map((a) =>
        a.id === editingAnn ? { ...a, ...annForm, active: true } : a
      );
      saveAnnouncements(updated);
      setEditingAnn(null);
      toast.success("Announcement updated");
    } else {
      const newAnn: Announcement = {
        id: Date.now().toString(),
        ...annForm,
        date: annForm.date || new Date().toISOString().split("T")[0],
        active: true,
      };
      saveAnnouncements([...announcements, newAnn]);
      toast.success("Announcement added");
    }
    setAnnForm({ title: "", content: "", date: "" });
  };

  const handleDeleteAnnouncement = (id: string) => {
    saveAnnouncements(announcements.filter((a) => a.id !== id));
    toast.success("Announcement deleted");
  };

  const toggleAnnouncement = (id: string) => {
    const updated = announcements.map((a) =>
      a.id === id ? { ...a, active: !a.active } : a
    );
    saveAnnouncements(updated);
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-heading text-xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="text-xs text-muted-foreground">Vardhman Shiksha Mandir</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["events", "gallery", "announcements"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {tab === "events" && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <textarea
                placeholder="Event Description"
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                rows={3}
                className="mt-4 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={eventForm.image}
                onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                className="mt-4 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleAddEvent}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
              >
                {editingEvent ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add Event</>}
              </button>
            </div>

            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={event.image} alt={event.title} className="w-16 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-medium text-card-foreground">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditEvent(event)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {tab === "gallery" && (
          <div className="space-y-6">
            <p className="text-muted-foreground text-sm">Gallery images are managed through the CMS data. Use image URLs to add new photos.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent">
                    <p className="text-primary-foreground text-xs">{img.alt}</p>
                    <p className="text-primary-foreground/60 text-xs">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {tab === "announcements" && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-4">
                {editingAnn ? "Edit Announcement" : "Add Announcement"}
              </h3>
              <input
                type="text"
                placeholder="Announcement Title"
                value={annForm.title}
                onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                placeholder="Announcement Content"
                value={annForm.content}
                onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                rows={3}
                className="mt-4 w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                onClick={handleAddAnnouncement}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
              >
                {editingAnn ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add Announcement</>}
              </button>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-card-foreground">{ann.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{ann.content}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAnnouncement(ann.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ann.active ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ann.active ? "Active" : "Inactive"}
                    </button>
                    <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
