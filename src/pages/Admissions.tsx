import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import AdmissionsCTA from "@/components/AdmissionsCTA";
import { CheckCircle } from "lucide-react";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreviewSectionDraft } from "@/components/admin/PreviewDraftContext";

const Admissions = () => {
  const introQuery = useContentBlocks("admissions", "intro_text");
  const stepsQuery = useContentBlocks("admissions", "admission_steps");
  const docsQuery = useContentBlocks("admissions", "documents_required");
  const datesQuery = useContentBlocks("admissions", "important_dates");
  const feeQuery = useContentBlocks("admissions", "fee_structure");
  const cbseQuery = useContentBlocks("admissions", "cbse_notes");

  if (
    introQuery.isLoading ||
    stepsQuery.isLoading ||
    docsQuery.isLoading ||
    datesQuery.isLoading ||
    feeQuery.isLoading ||
    cbseQuery.isLoading
  ) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-80 w-full" /></section><Footer /></div>;
  }
  if (introQuery.error || stepsQuery.error || docsQuery.error || datesQuery.error || feeQuery.error || cbseQuery.error) {
    return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load admissions content.</div></section><Footer /></div>;
  }

  const intro = usePreviewSectionDraft("admissions", "intro_text", { body: "", ...(introQuery.data ?? {}) });
  const stepsDraft = usePreviewSectionDraft("admissions", "admission_steps", {
    items: Array.isArray(stepsQuery.data?.items) ? (stepsQuery.data?.items as Array<{ title: string; description: string }>) : [],
  });
  const docsDraft = usePreviewSectionDraft("admissions", "documents_required", {
    items: Array.isArray(docsQuery.data?.items) ? (docsQuery.data?.items as Array<{ title: string; note?: string }>) : [],
  });
  const datesDraft = usePreviewSectionDraft("admissions", "important_dates", {
    items: Array.isArray(datesQuery.data?.items) ? (datesQuery.data?.items as Array<{ label: string; date: string }>) : [],
  });
  const fee = usePreviewSectionDraft("admissions", "fee_structure", { ...(feeQuery.data ?? {}) });
  const cbse = usePreviewSectionDraft("admissions", "cbse_notes", { body: String(cbseQuery.data?.body ?? "") });
  const steps = Array.isArray(stepsDraft.items) ? stepsDraft.items : [];
  const documents = Array.isArray(docsDraft.items) ? docsDraft.items : [];
  const dates = Array.isArray(datesDraft.items) ? datesDraft.items : [];
  const feeStructure = [
    { label: "Registration Fee", value: String(fee.registration_fee ?? "₹25") },
    { label: "Admission Fee", value: String(fee.admission_fee ?? "₹200") },
    { label: "Caution Fee", value: String(fee.caution_fee ?? "₹500") },
    { label: "Tuition Fee (Class I–XII)", value: String(fee.tuition_fee ?? "₹5,110 / month") },
    { label: "Annual Charges (General)", value: String(fee.annual_charges_general ?? "₹10,900") },
    { label: "Annual Charges (Science)", value: String(fee.annual_charges_science ?? "₹12,400") },
  ];

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Admissions 2026-27"
        description="Apply for admission at Vardhman Shiksha Mandir, Daryaganj, New Delhi. Registration ₹25. Nursery to Class XII (CBSE). Documents required, fee structure, and admission steps explained."
        path="/admissions"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Admissions</h1>
          <p className="text-muted-foreground text-lg">Join the Vardhman Shiksha Mandir family</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <SectionHeader title="Admission Process" centered={false} />
              <p className="text-muted-foreground mb-4">{String(intro.body ?? "")}</p>
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={`${step.title}-${i}`} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">{i + 1}</div>
                    <p className="text-muted-foreground pt-1">{step.title} {step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader title="Required Documents" centered={false} />
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.title} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-secondary mt-0.5 shrink-0" />
                    <p className="text-muted-foreground">{doc.title}{doc.note ? ` — ${doc.note}` : ""}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-5 bg-secondary/10 rounded-xl border border-secondary/20 text-sm text-muted-foreground">
                {String(cbse.body ?? "")}
              </div>
              <div className="mt-8 p-6 bg-accent rounded-xl border border-border">
                <h4 className="font-heading text-lg font-semibold text-accent-foreground mb-2">Important Dates</h4>
                <p className="text-muted-foreground text-sm">
                  {dates.map((d) => `${d.label}: ${d.date}`).join(" | ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-narrow mx-auto">
          <SectionHeader title="Fee Structure 2026-27" subtitle="Transparent fee details for the academic session" />
          <div className="max-w-xl mx-auto bg-card rounded-xl border border-border overflow-hidden">
            {feeStructure.map((item, i) => (
              <div key={item.label} className={`flex justify-between items-center px-6 py-4 ${i !== feeStructure.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-muted-foreground text-sm">{item.label}</span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdmissionsCTA />
      <Footer />
    </div>
  );
};

export default Admissions;
