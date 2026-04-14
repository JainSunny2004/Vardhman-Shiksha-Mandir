import PageSEO from "@/components/PageSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { FileText } from "lucide-react";
import { useContentBlocks, useMandatoryDocuments } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const MandatoryDisclosure = () => {
  const documentsQuery = useMandatoryDocuments();
  const infoQuery = useContentBlocks("contact", "info");
  if (documentsQuery.isLoading || infoQuery.isLoading) return <div className="min-h-screen"><Navbar /><section className="section-padding"><Skeleton className="h-80 w-full" /></section><Footer /></div>;
  if (documentsQuery.error || infoQuery.error) return <div className="min-h-screen"><Navbar /><section className="section-padding"><div className="text-sm text-destructive">Failed to load mandatory disclosure.</div></section><Footer /></div>;
  const contactInfo = infoQuery.data ?? {};
  const mandatoryDocuments = documentsQuery.data ?? [];
  const schoolInfo = [
    { label: "School Name", value: "VardhmanShikshaMandir Senior Secondary School" },
    { label: "CBSE Affiliation No.", value: "2730128" },
    { label: "School Code", value: "85012" },
    { label: "School ID (DoE Delhi)", value: "2127129" },
    { label: "Address", value: String(contactInfo.address ?? "16, Padam Chand Marg, Daryaganj, New Delhi - 110002") },
    { label: "Phone", value: String(contactInfo.phone ?? "01123277448") },
    { label: "Email", value: String(contactInfo.email ?? "vardhmanschool@yahoo.co.in") },
    { label: "Principal", value: "Seema Kandwal (MA, B.Ed)" },
    { label: "Established", value: "1976" },
    { label: "Type", value: "Co-educational, English Medium" },
    { label: "Managed by", value: "Jain Society for the Protection of Orphans in India" },
  ];

  return (
    <div className="min-h-screen">
      <PageSEO
        title="Mandatory Disclosure"
        description="CBSE mandatory disclosure for Vardhman Shiksha Mandir — Affiliation No. 2730128, School Code 85012, School ID 2127129. Public documents including affiliation letter, fee structure, and certificates."
        path="/mandatory-disclosure"
      />
      <Navbar />
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative container-narrow mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Mandatory Disclosure</h1>
          <p className="text-muted-foreground text-lg">Public disclosure as required by CBSE</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto">
          <SectionHeader title="School Information" centered={false} />
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-16">
            {schoolInfo.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-2 px-6 py-4 ${i !== schoolInfo.length - 1 ? "border-b border-border" : ""} ${i % 2 === 0 ? "" : "bg-muted/40"}`}
              >
                <span className="text-sm font-medium text-foreground">{row.label}</span>
                <span className="text-sm text-muted-foreground">{row.value}</span>
              </div>
            ))}
          </div>

          <SectionHeader title="Mandatory Documents" centered={false} />
          <p className="text-muted-foreground text-sm mb-6">
            The following documents are available for public inspection. Physical copies can be viewed at the school office during working hours.
            Digital copies will be made available for download once uploaded.
          </p>
          <div className="space-y-3">
            {mandatoryDocuments.map((doc, i) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-secondary shrink-0" />
                  <span className="text-sm text-foreground">
                    {i + 1}. {doc.title}
                  </span>
                </div>
                {doc.file_url ? (
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                    Download
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Coming soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MandatoryDisclosure;
