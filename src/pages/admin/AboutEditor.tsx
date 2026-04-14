import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditorLayout from "@/components/admin/EditorLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadImageToBucket } from "@/lib/adminUploads";
import { aboutDefaults } from "@/lib/cmsDefaults";
import { useSectionContentBlocks, useUpsertSectionContentBlocks } from "@/hooks/useAdminContentBlocks";
import type { PreviewDraftData } from "@/components/admin/PreviewDraftContext";

const missionPointSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const leaderSchema = z.object({
  role: z.string().min(1),
  name: z.string().min(1),
  qualification: z.string(),
  bio: z.string().min(1),
  photo_url: z.string(),
});

const aboutSchema = z.object({
  school_overview: z.object({
    body: z.string().min(1),
  }),
  vision: z.object({
    body: z.string().min(1),
  }),
  mission: z.object({
    points: z.array(missionPointSchema).min(1),
  }),
  manager_message: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    message: z.string().min(1),
    photo_url: z.string(),
  }),
  principal_message: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    message: z.string().min(1),
    photo_url: z.string(),
    quote: z.string(),
  }),
  leadership_cards: z.object({
    cards: z.array(leaderSchema).min(1),
  }),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

const AboutEditor = () => {
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: aboutDefaults,
  });

  const schoolOverviewQuery = useSectionContentBlocks("about", "school_overview", aboutDefaults.school_overview);
  const visionQuery = useSectionContentBlocks("about", "vision", aboutDefaults.vision);
  const missionQuery = useSectionContentBlocks("about", "mission", aboutDefaults.mission);
  const managerQuery = useSectionContentBlocks("about", "manager_message", aboutDefaults.manager_message);
  const principalQuery = useSectionContentBlocks("about", "principal_message", aboutDefaults.principal_message);
  const leadershipQuery = useSectionContentBlocks("about", "leadership_cards", aboutDefaults.leadership_cards);

  const upsertMutation = useUpsertSectionContentBlocks();
  const watchedValues = useWatch({ control: form.control });
  const [draftData, setDraftData] = useState<PreviewDraftData>(aboutDefaults as unknown as PreviewDraftData);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const missionFields = useFieldArray({
    control: form.control,
    name: "mission.points",
  });

  const leadershipFields = useFieldArray({
    control: form.control,
    name: "leadership_cards.cards",
  });

  const loadedDefaults = useMemo<AboutFormValues | null>(() => {
    if (
      schoolOverviewQuery.data &&
      visionQuery.data &&
      missionQuery.data &&
      managerQuery.data &&
      principalQuery.data &&
      leadershipQuery.data
    ) {
      return {
        school_overview: schoolOverviewQuery.data,
        vision: visionQuery.data,
        mission: missionQuery.data as AboutFormValues["mission"],
        manager_message: managerQuery.data as AboutFormValues["manager_message"],
        principal_message: principalQuery.data as AboutFormValues["principal_message"],
        leadership_cards: leadershipQuery.data as AboutFormValues["leadership_cards"],
      };
    }
    return null;
  }, [
    schoolOverviewQuery.data,
    visionQuery.data,
    missionQuery.data,
    managerQuery.data,
    principalQuery.data,
    leadershipQuery.data,
  ]);

  useEffect(() => {
    if (!loadedDefaults) {
      return;
    }
    form.reset(loadedDefaults);
    setDraftData(loadedDefaults as unknown as PreviewDraftData);
  }, [form, loadedDefaults]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDraftData((watchedValues as PreviewDraftData) ?? (aboutDefaults as unknown as PreviewDraftData));
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedValues]);

  const onUpload = async (fieldPath: string, folder: string, file?: File) => {
    if (!file) {
      return;
    }
    setUploadingField(fieldPath);
    try {
      const url = await uploadImageToBucket(file, "leadership-photos", folder);
      form.setValue(fieldPath as never, url as never, { shouldDirty: true, shouldValidate: true });
      toast.success("Image uploaded.");
    } finally {
      setUploadingField(null);
    }
  };

  const saveSection = async <T extends Record<string, unknown>>(
    section: string,
    values: T,
    contentTypes: Record<keyof T, "text" | "richtext" | "image" | "boolean" | "number" | "json">,
  ) => {
    await upsertMutation.mutateAsync({
      page: "about",
      section,
      fields: Object.entries(values).reduce<Record<string, { value: unknown; contentType: "text" | "richtext" | "image" | "boolean" | "number" | "json" }>>((acc, [key, value]) => {
        acc[key] = { value, contentType: contentTypes[key as keyof T] };
        return acc;
      }, {}),
    });
  };

  const onSave = form.handleSubmit(async (values) => {
    await saveSection("school_overview", values.school_overview, { body: "richtext" });
    await saveSection("vision", values.vision, { body: "richtext" });
    await saveSection("mission", values.mission, { points: "json" });
    await saveSection("manager_message", values.manager_message, {
      name: "text",
      title: "text",
      message: "richtext",
      photo_url: "image",
    });
    await saveSection("principal_message", values.principal_message, {
      name: "text",
      title: "text",
      message: "richtext",
      photo_url: "image",
      quote: "text",
    });
    await saveSection("leadership_cards", values.leadership_cards, { cards: "json" });
    toast.success("About page content saved.");
  });

  const onDiscard = () => {
    if (loadedDefaults) {
      form.reset(loadedDefaults);
      setDraftData(loadedDefaults as unknown as PreviewDraftData);
    }
  };

  return (
    <EditorLayout
      title="Edit About Page"
      page="about"
      draftData={draftData}
      onSave={onSave}
      onDiscard={onDiscard}
      saving={upsertMutation.isPending}
    >
      <form className="space-y-4">
        <Accordion type="multiple" defaultValue={["overview", "vision", "mission"]}>
          <AccordionItem value="overview">
            <AccordionTrigger>School Overview</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Body</Label>
              <Textarea {...form.register("school_overview.body")} rows={6} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="vision">
            <AccordionTrigger>Vision</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Body</Label>
              <Textarea {...form.register("vision.body")} rows={5} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mission">
            <AccordionTrigger>Mission</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {missionFields.fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-border p-3 space-y-2">
                  <Label>Title</Label>
                  <Input {...form.register(`mission.points.${index}.title`)} />
                  <Label>Description</Label>
                  <Textarea {...form.register(`mission.points.${index}.description`)} rows={3} />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => missionFields.swap(index, Math.max(0, index - 1))} disabled={index === 0}>
                      Up
                    </Button>
                    <Button type="button" variant="outline" onClick={() => missionFields.swap(index, Math.min(missionFields.fields.length - 1, index + 1))} disabled={index === missionFields.fields.length - 1}>
                      Down
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => missionFields.remove(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => missionFields.append({ title: "New Point", description: "Describe this mission point." })}>
                Add Mission Point
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="manager">
            <AccordionTrigger>Manager's Message</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Name</Label>
              <Input {...form.register("manager_message.name")} />
              <Label>Title</Label>
              <Input {...form.register("manager_message.title")} />
              <Label>Message</Label>
              <Textarea {...form.register("manager_message.message")} rows={5} />
              <Label>Photo URL</Label>
              <Input {...form.register("manager_message.photo_url")} />
              <Input type="file" accept="image/*" onChange={(event) => onUpload("manager_message.photo_url", "about-manager", event.target.files?.[0])} />
              {uploadingField === "manager_message.photo_url" ? <p className="text-xs text-muted-foreground">Uploading image...</p> : null}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="principal">
            <AccordionTrigger>Principal's Message</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Name</Label>
              <Input {...form.register("principal_message.name")} />
              <Label>Title</Label>
              <Input {...form.register("principal_message.title")} />
              <Label>Message</Label>
              <Textarea {...form.register("principal_message.message")} rows={5} />
              <Label>Quote</Label>
              <Input {...form.register("principal_message.quote")} />
              <Label>Photo URL</Label>
              <Input {...form.register("principal_message.photo_url")} />
              <Input type="file" accept="image/*" onChange={(event) => onUpload("principal_message.photo_url", "about-principal", event.target.files?.[0])} />
              {uploadingField === "principal_message.photo_url" ? <p className="text-xs text-muted-foreground">Uploading image...</p> : null}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="leadership">
            <AccordionTrigger>Leadership Cards</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {leadershipFields.fields.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-border p-3 space-y-2">
                  <p className="text-sm font-semibold">Card {index + 1}</p>
                  <Label>Role</Label>
                  <Input {...form.register(`leadership_cards.cards.${index}.role`)} />
                  <Label>Name</Label>
                  <Input {...form.register(`leadership_cards.cards.${index}.name`)} />
                  <Label>Qualification</Label>
                  <Input {...form.register(`leadership_cards.cards.${index}.qualification`)} />
                  <Label>Bio</Label>
                  <Textarea {...form.register(`leadership_cards.cards.${index}.bio`)} rows={4} />
                  <Label>Photo URL</Label>
                  <Input {...form.register(`leadership_cards.cards.${index}.photo_url`)} />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      onUpload(`leadership_cards.cards.${index}.photo_url`, "about-leadership", event.target.files?.[0])
                    }
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => leadershipFields.swap(index, Math.max(0, index - 1))} disabled={index === 0}>
                      Up
                    </Button>
                    <Button type="button" variant="outline" onClick={() => leadershipFields.swap(index, Math.min(leadershipFields.fields.length - 1, index + 1))} disabled={index === leadershipFields.fields.length - 1}>
                      Down
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => leadershipFields.remove(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  leadershipFields.append({
                    role: "Role",
                    name: "Name",
                    qualification: "",
                    bio: "Biography",
                    photo_url: "",
                  })
                }
              >
                Add Leadership Card
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </EditorLayout>
  );
};

export default AboutEditor;

