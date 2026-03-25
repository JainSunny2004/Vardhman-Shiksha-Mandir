import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import AdmissionsCTA from "@/components/AdmissionsCTA";
import { CheckCircle } from "lucide-react";

const steps = [
  "Obtain the admission form from the school office or download from website.",
  "Fill in the required details and attach necessary documents.",
  "Submit the form along with registration fee.",
  "Attend the interaction/assessment session as scheduled.",
  "Receive admission confirmation and complete the enrollment process.",
];

const documents = [
  "Birth Certificate (original + photocopy)",
  "Transfer Certificate from previous school",
  "Report Card of last academic session",
  "Passport-size photographs (4 copies)",
  "Aadhaar Card of student and parents",
  "Address Proof",
];

const Admissions = () => {
  return (
    <div className="min-h-screen">
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
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader title="Required Documents" centered={false} />
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-secondary mt-0.5 shrink-0" />
                    <p className="text-muted-foreground">{doc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-accent rounded-xl border border-border">
                <h4 className="font-heading text-lg font-semibold text-accent-foreground mb-2">Important Dates</h4>
                <p className="text-muted-foreground text-sm">
                  Registration opens: <strong>January 15, 2026</strong><br />
                  Last date to apply: <strong>June 30, 2026</strong><br />
                  Session begins: <strong>April 1, 2026</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdmissionsCTA />
      <Footer />
    </div>
  );
};

export default Admissions;
