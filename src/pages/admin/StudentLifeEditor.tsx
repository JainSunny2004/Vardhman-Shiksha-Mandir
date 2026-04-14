import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditorLayout from "@/components/admin/EditorLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { studentLifeDefaults } from "@/lib/cmsDefaults";
import { useSectionContentBlocks, useUpsertSectionContentBlocks } from "@/hooks/useAdminContentBlocks";
import type { PreviewDraftData } from "@/components/admin/PreviewDraftContext";
import type { ContentType } from "@/hooks/useAdminContentBlocks";

const activitySchema = z.object({
  name: z.string().min(1),
});

const clubSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const studentLifeSchema = z.object({
  intro: z.object({
    heading: z.string().min(1),
    subheading: z.string().min(1),
  }),
  activities: z.object({
    items: z.array(activitySchema).min(1),
  }),
  clubs: z.object({
    cards: z.array(clubSchema).min(1),
  }),
});

type StudentLifeFormValues = z.infer<typeof studentLifeSchema>;

const StudentLifeEditor = () => {
  const form = useForm<StudentLifeFormValues>({
    resolver: zodResolver(studentLifeSchema),
    defaultValues: studentLifeDefaults,
  });

  const introQuery = useSectionContentBlocks("student-life", "intro", studentLifeDefaults.intro);
  const activitiesQuery = useSectionContentBlocks("student-life", "activities", studentLifeDefaults.activities);
  const clubsQuery = useSectionContentBlocks("student-life", "clubs", studentLifeDefaults.clubs);

  const upsertMutation = useUpsertSectionContentBlocks();
  const watchedValues = useWatch({ control: form.control });
  const [draftData, setDraftData] = useState<PreviewDraftData>(studentLifeDefaults as unknown as PreviewDraftData);

  const activitiesFields = useFieldArray({
    control: form.control,
    name: "activities.items",
  });

  const clubsFields = useFieldArray({
    control: form.control,
    name: "clubs.cards",
  });

  const loadedDefaults = useMemo<StudentLifeFormValues | null>(() => {
    if (introQuery.data && activitiesQuery.data && clubsQuery.data) {
      return {
        intro: introQuery.data,
        activities: activitiesQuery.data as StudentLifeFormValues["activities"],
        clubs: clubsQuery.data as StudentLifeFormValues["clubs"],
      };
    }
    return null;
  }, [introQuery.data, activitiesQuery.data, clubsQuery.data]);

  useEffect(() => {
    if (!loadedDefaults) {
      return;
    }
    form.reset(loadedDefaults);
    setDraftData(loadedDefaults as unknown as PreviewDraftData);
  }, [form, loadedDefaults]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDraftData((watchedValues as PreviewDraftData) ?? (studentLifeDefaults as unknown as PreviewDraftData));
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedValues]);

  const saveSection = async <T extends Record<string, unknown>>(
    section: string,
    values: T,
    contentTypes: Record<keyof T, ContentType>,
  ) => {
    await upsertMutation.mutateAsync({
      page: "student-life",
      section,
      fields: Object.entries(values).reduce<Record<string, { value: unknown; contentType: ContentType }>>((acc, [key, value]) => {
        acc[key] = { value, contentType: contentTypes[key as keyof T] };
        return acc;
      }, {}),
    });
  };

  const onSave = form.handleSubmit(async (values) => {
    await saveSection("intro", values.intro, {
      heading: "text",
      subheading: "text",
    });
    await saveSection("activities", values.activities, {
      items: "json",
    });
    await saveSection("clubs", values.clubs, {
      cards: "json",
    });
    toast.success("Student Life content saved.");
  });

  const onDiscard = () => {
    if (loadedDefaults) {
      form.reset(loadedDefaults);
      setDraftData(loadedDefaults as unknown as PreviewDraftData);
    }
  };

  return (
    <EditorLayout
      title="Edit Student Life Page"
      page="student-life"
      draftData={draftData}
      onSave={onSave}
      onDiscard={onDiscard}
      saving={upsertMutation.isPending}
    >
      <form className="space-y-4">
        <Accordion type="multiple" defaultValue={["intro", "activities", "clubs"]}>
          <AccordionItem value="intro">
            <AccordionTrigger>Intro</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Heading</Label>
              <Input {...form.register("intro.heading")} />
              <Label>Subheading</Label>
              <Input {...form.register("intro.subheading")} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="activities">
            <AccordionTrigger>Activities List</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {activitiesFields.fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-border p-3 space-y-2">
                  <Label>Activity</Label>
                  <Input {...form.register(`activities.items.${index}.name`)} />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => activitiesFields.swap(index, Math.max(0, index - 1))} disabled={index === 0}>
                      Up
                    </Button>
                    <Button type="button" variant="outline" onClick={() => activitiesFields.swap(index, Math.min(activitiesFields.fields.length - 1, index + 1))} disabled={index === activitiesFields.fields.length - 1}>
                      Down
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => activitiesFields.remove(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => activitiesFields.append({ name: "New Activity" })}>
                Add Activity
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="clubs">
            <AccordionTrigger>Clubs Grid</AccordionTrigger>
            <AccordionContent className="space-y-3">
              {clubsFields.fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-border p-3 space-y-2">
                  <Label>Club Name</Label>
                  <Input {...form.register(`clubs.cards.${index}.name`)} />
                  <Label>Description</Label>
                  <Input {...form.register(`clubs.cards.${index}.description`)} />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => clubsFields.swap(index, Math.max(0, index - 1))} disabled={index === 0}>
                      Up
                    </Button>
                    <Button type="button" variant="outline" onClick={() => clubsFields.swap(index, Math.min(clubsFields.fields.length - 1, index + 1))} disabled={index === clubsFields.fields.length - 1}>
                      Down
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => clubsFields.remove(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => clubsFields.append({ name: "New Club", description: "Description" })}>
                Add Club
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </EditorLayout>
  );
};

export default StudentLifeEditor;

