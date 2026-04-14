import { useState } from "react";
import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";
import { contactDefaults } from "@/lib/cmsDefaults";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const Contact = () => {
  const infoQuery = useContentBlocks("contact", "info");
  const formSettingsQuery = useContentBlocks("contact", "form_settings");
  const info = usePreviewSectionDraft("contact", "info", { ...contactDefaults.info, ...(infoQuery.data ?? {}) });
  const formSettings = usePreviewSectionDraft("contact", "form_settings", { ...contactDefaults.form_settings, ...(formSettingsQuery.data ?? {}) });
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  if (infoQuery.isLoading || formSettingsQuery.isLoading) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-72 w-full" /></section><Footer /></div>;
  }
  if (infoQuery.error || formSettingsQuery.error) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load contact page.</div></section><Footer /></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      if (error) throw error;
      toast.success(String(formSettings.success_message));
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Contact Us"
        description="Contact Vardhman Shiksha Mandir, Daryaganj, New Delhi. Phone: 01123277448. Email: vardhmanschool@yahoo.co.in. Office hours: Mon–Sat 8 AM–3 PM."
        path="/contact"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">We'd love to hear from you</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-8">{String(formSettings.form_heading)}</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: "Address", value: info.address },
                  { icon: Phone, label: "Phone", value: info.phone },
                  { icon: Mail, label: "Email", value: info.email },
                  { icon: Clock, label: "Office Hours", value: info.office_hours },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-0.5">{item.label}</p>
                      <p className="text-muted-foreground text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                type="submit"
                className="w-full px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
