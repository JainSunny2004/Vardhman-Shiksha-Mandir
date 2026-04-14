import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditorLayout from "@/components/admin/EditorLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSectionContentBlocks, useUpsertSectionContentBlocks } from "@/hooks/useAdminContentBlocks";
import type { PreviewDraftData } from "@/components/admin/PreviewDraftContext";
import type { ContentType } from "@/hooks/useAdminContentBlocks";

const schema = z.object({
  intro_text: z.object({ body: z.string().min(1) }),
  admission_steps: z.object({
    items: z.array(z.object({ step_number: z.number(), title: z.string().min(1), description: z.string().min(1) })).min(1),
  }),
  documents_required: z.object({
    items: z.array(z.object({ title: z.string().min(1), note: z.string().optional() })).min(1),
  }),
  important_dates: z.object({
    items: z.array(z.object({ label: z.string().min(1), date: z.string().min(1) })).min(1),
  }),
  fee_structure: z.object({
    registration_fee: z.string().min(1),
    admission_fee: z.string().min(1),
    caution_fee: z.string().min(1),
    tuition_fee: z.string().min(1),
    annual_charges_general: z.string().min(1),
    annual_charges_science: z.string().min(1),
  }),
  cbse_notes: z.object({ body: z.string().min(1) }),
});

type Values = z.infer<typeof schema>;

const defaults: Values = {
  intro_text: { body: "Admission process information..." },
  admission_steps: { items: [{ step_number: 1, title: "Fill Form", description: "Submit required details." }] },
  documents_required: { items: [{ title: "Birth Certificate", note: "" }] },
  important_dates: { items: [{ label: "Session begins", date: "2026-04-01" }] },
  fee_structure: {
    registration_fee: "₹25",
    admission_fee: "₹200",
    caution_fee: "₹500",
    tuition_fee: "₹5,110/month",
    annual_charges_general: "₹10,900",
    annual_charges_science: "₹12,400",
  },
  cbse_notes: { body: "For Class X & XII: as per CBSE rules..." },
};

const AdmissionsEditor = () => {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  const introQ = useSectionContentBlocks("admissions", "intro_text", defaults.intro_text);
  const stepsQ = useSectionContentBlocks("admissions", "admission_steps", defaults.admission_steps);
  const docsQ = useSectionContentBlocks("admissions", "documents_required", defaults.documents_required);
  const datesQ = useSectionContentBlocks("admissions", "important_dates", defaults.important_dates);
  const feeQ = useSectionContentBlocks("admissions", "fee_structure", defaults.fee_structure);
  const cbseQ = useSectionContentBlocks("admissions", "cbse_notes", defaults.cbse_notes);
  const upsert = useUpsertSectionContentBlocks();
  const watched = useWatch({ control: form.control });
  const [draftData, setDraftData] = useState<PreviewDraftData>(defaults as unknown as PreviewDraftData);
  const steps = useFieldArray({ control: form.control, name: "admission_steps.items" });
  const docs = useFieldArray({ control: form.control, name: "documents_required.items" });
  const dates = useFieldArray({ control: form.control, name: "important_dates.items" });

  const loaded = useMemo<Values | null>(() => {
    if (!introQ.data || !stepsQ.data || !docsQ.data || !datesQ.data || !feeQ.data || !cbseQ.data) return null;
    return {
      intro_text: introQ.data as Values["intro_text"],
      admission_steps: stepsQ.data as Values["admission_steps"],
      documents_required: docsQ.data as Values["documents_required"],
      important_dates: datesQ.data as Values["important_dates"],
      fee_structure: feeQ.data as Values["fee_structure"],
      cbse_notes: cbseQ.data as Values["cbse_notes"],
    };
  }, [introQ.data, stepsQ.data, docsQ.data, datesQ.data, feeQ.data, cbseQ.data]);

  useEffect(() => {
    if (!loaded) return;
    form.reset(loaded);
    setDraftData(loaded as unknown as PreviewDraftData);
  }, [form, loaded]);

  useEffect(() => {
    const t = setTimeout(() => setDraftData((watched as PreviewDraftData) ?? (defaults as unknown as PreviewDraftData)), 300);
    return () => clearTimeout(t);
  }, [watched]);

  const saveSection = async <T extends Record<string, unknown>>(section: string, values: T, types: Record<keyof T, ContentType>) => {
    await upsert.mutateAsync({
      page: "admissions",
      section,
      fields: Object.entries(values).reduce<Record<string, { value: unknown; contentType: ContentType }>>((acc, [key, value]) => {
        acc[key] = { value, contentType: types[key as keyof T] };
        return acc;
      }, {}),
    });
  };

  const onSave = form.handleSubmit(async (values) => {
    await saveSection("intro_text", values.intro_text, { body: "richtext" });
    await saveSection("admission_steps", values.admission_steps, { items: "json" });
    await saveSection("documents_required", values.documents_required, { items: "json" });
    await saveSection("important_dates", values.important_dates, { items: "json" });
    await saveSection("fee_structure", values.fee_structure, {
      registration_fee: "text",
      admission_fee: "text",
      caution_fee: "text",
      tuition_fee: "text",
      annual_charges_general: "text",
      annual_charges_science: "text",
    });
    await saveSection("cbse_notes", values.cbse_notes, { body: "richtext" });
    toast.success("Admissions page saved.");
  });

  return (
    <EditorLayout title="Edit Admissions Page" page="admissions" draftData={draftData} onSave={onSave} onDiscard={() => loaded && form.reset(loaded)} saving={upsert.isPending}>
      <form className="space-y-4">
        <Accordion type="multiple" defaultValue={["intro", "steps", "documents", "dates", "fee", "cbse"]}>
          <AccordionItem value="intro"><AccordionTrigger>Intro Text</AccordionTrigger><AccordionContent><Textarea rows={3} {...form.register("intro_text.body")} /></AccordionContent></AccordionItem>
          <AccordionItem value="steps">
            <AccordionTrigger>Admission Steps</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {steps.fields.map((field, i) => (
                <div key={field.id} className="border p-3 rounded space-y-2">
                  <Input type="number" {...form.register(`admission_steps.items.${i}.step_number`, { valueAsNumber: true })} />
                  <Input placeholder="Title" {...form.register(`admission_steps.items.${i}.title`)} />
                  <Textarea placeholder="Description" rows={2} {...form.register(`admission_steps.items.${i}.description`)} />
                  <Button type="button" variant="destructive" onClick={() => steps.remove(i)}>Remove</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => steps.append({ step_number: steps.fields.length + 1, title: "Step", description: "Description" })}>Add Step</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="documents">
            <AccordionTrigger>Documents Required</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {docs.fields.map((field, i) => (
                <div key={field.id} className="border p-3 rounded space-y-2">
                  <Input placeholder="Title" {...form.register(`documents_required.items.${i}.title`)} />
                  <Input placeholder="Note" {...form.register(`documents_required.items.${i}.note`)} />
                  <Button type="button" variant="destructive" onClick={() => docs.remove(i)}>Remove</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => docs.append({ title: "Document", note: "" })}>Add Document</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dates">
            <AccordionTrigger>Important Dates</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {dates.fields.map((field, i) => (
                <div key={field.id} className="border p-3 rounded space-y-2">
                  <Input placeholder="Label" {...form.register(`important_dates.items.${i}.label`)} />
                  <Input type="date" {...form.register(`important_dates.items.${i}.date`)} />
                  <Button type="button" variant="destructive" onClick={() => dates.remove(i)}>Remove</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => dates.append({ label: "Date Label", date: "2026-04-01" })}>Add Date</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fee">
            <AccordionTrigger>Fee Structure</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Label>Registration Fee</Label><Input {...form.register("fee_structure.registration_fee")} />
              <Label>Admission Fee</Label><Input {...form.register("fee_structure.admission_fee")} />
              <Label>Caution Fee</Label><Input {...form.register("fee_structure.caution_fee")} />
              <Label>Tuition Fee</Label><Input {...form.register("fee_structure.tuition_fee")} />
              <Label>Annual Charges General</Label><Input {...form.register("fee_structure.annual_charges_general")} />
              <Label>Annual Charges Science</Label><Input {...form.register("fee_structure.annual_charges_science")} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cbse"><AccordionTrigger>CBSE Notes</AccordionTrigger><AccordionContent><Textarea rows={3} {...form.register("cbse_notes.body")} /></AccordionContent></AccordionItem>
        </Accordion>
      </form>
    </EditorLayout>
  );
};

export default AdmissionsEditor;

