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
  overview_text: z.object({ body: z.string().min(1) }),
  class_levels: z.object({
    primary_body: z.string().min(1),
    secondary_body: z.string().min(1),
    senior_body: z.string().min(1),
  }),
  departments_grid: z.object({
    items: z.array(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      icon_name: z.string().min(1),
    })).min(1),
  }),
  additional_facilities_text: z.object({ body: z.string() }),
});

type Values = z.infer<typeof schema>;

const defaults: Values = {
  overview_text: { body: "Curriculum details..." },
  class_levels: {
    primary_body: "Primary (Class I to V)",
    secondary_body: "Secondary (Class VI to X)",
    senior_body: "Senior Secondary (Class XI to XII)",
  },
  departments_grid: {
    items: [{ name: "Science", description: "Lab-oriented learning.", icon_name: "Beaker" }],
  },
  additional_facilities_text: { body: "" },
};

const AcademicsEditor = () => {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults });
  const overviewQuery = useSectionContentBlocks("academics", "overview_text", defaults.overview_text);
  const levelsQuery = useSectionContentBlocks("academics", "class_levels", defaults.class_levels);
  const deptQuery = useSectionContentBlocks("academics", "departments_grid", defaults.departments_grid);
  const addQuery = useSectionContentBlocks("academics", "additional_facilities_text", defaults.additional_facilities_text);
  const upsert = useUpsertSectionContentBlocks();
  const watched = useWatch({ control: form.control });
  const [draftData, setDraftData] = useState<PreviewDraftData>(defaults as unknown as PreviewDraftData);
  const departments = useFieldArray({ control: form.control, name: "departments_grid.items" });

  const loaded = useMemo<Values | null>(() => {
    if (!overviewQuery.data || !levelsQuery.data || !deptQuery.data || !addQuery.data) return null;
    return {
      overview_text: overviewQuery.data as Values["overview_text"],
      class_levels: levelsQuery.data as Values["class_levels"],
      departments_grid: deptQuery.data as Values["departments_grid"],
      additional_facilities_text: addQuery.data as Values["additional_facilities_text"],
    };
  }, [overviewQuery.data, levelsQuery.data, deptQuery.data, addQuery.data]);

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
      page: "academics",
      section,
      fields: Object.entries(values).reduce<Record<string, { value: unknown; contentType: ContentType }>>((acc, [key, value]) => {
        acc[key] = { value, contentType: types[key as keyof T] };
        return acc;
      }, {}),
    });
  };

  const onSave = form.handleSubmit(async (values) => {
    await saveSection("overview_text", values.overview_text, { body: "richtext" });
    await saveSection("class_levels", values.class_levels, { primary_body: "richtext", secondary_body: "richtext", senior_body: "richtext" });
    await saveSection("departments_grid", values.departments_grid, { items: "json" });
    await saveSection("additional_facilities_text", values.additional_facilities_text, { body: "richtext" });
    toast.success("Academics page saved.");
  });

  return (
    <EditorLayout title="Edit Academics Page" page="academics" draftData={draftData} onSave={onSave} onDiscard={() => loaded && form.reset(loaded)} saving={upsert.isPending}>
      <form className="space-y-4">
        <Accordion type="multiple" defaultValue={["overview", "levels", "departments"]}>
          <AccordionItem value="overview">
            <AccordionTrigger>Overview Text</AccordionTrigger>
            <AccordionContent><Textarea rows={4} {...form.register("overview_text.body")} /></AccordionContent>
          </AccordionItem>
          <AccordionItem value="levels">
            <AccordionTrigger>Class Levels</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Label>Primary</Label><Textarea rows={2} {...form.register("class_levels.primary_body")} />
              <Label>Secondary</Label><Textarea rows={2} {...form.register("class_levels.secondary_body")} />
              <Label>Senior</Label><Textarea rows={2} {...form.register("class_levels.senior_body")} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="departments">
            <AccordionTrigger>Departments Grid</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {departments.fields.map((field, i) => (
                <div key={field.id} className="border border-border rounded p-3 space-y-2">
                  <Input placeholder="Name" {...form.register(`departments_grid.items.${i}.name`)} />
                  <Input placeholder="Icon Name" {...form.register(`departments_grid.items.${i}.icon_name`)} />
                  <Textarea placeholder="Description" rows={2} {...form.register(`departments_grid.items.${i}.description`)} />
                  <Button type="button" variant="destructive" onClick={() => departments.remove(i)}>Remove</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => departments.append({ name: "New", description: "Description", icon_name: "BookOpen" })}>Add Department</Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="additional">
            <AccordionTrigger>Additional Facilities Text</AccordionTrigger>
            <AccordionContent><Textarea rows={3} {...form.register("additional_facilities_text.body")} /></AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </EditorLayout>
  );
};

export default AcademicsEditor;

