import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditorLayout from "@/components/admin/EditorLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { uploadImageToBucket } from "@/lib/adminUploads";
import { homeDefaults } from "@/lib/cmsDefaults";
import { useSectionContentBlocks, useUpsertSectionContentBlocks } from "@/hooks/useAdminContentBlocks";
import type { PreviewDraftData } from "@/components/admin/PreviewDraftContext";

const cardSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  image_url: z.string().min(1, "Required"),
  link: z.string().min(1, "Required"),
});

const homeSchema = z.object({
  hero: z.object({
    heading: z.string().min(1),
    subheading: z.string().min(1),
    hero_image_url: z.string().min(1),
    cta_label: z.string().min(1),
    session_year: z.string().min(1),
    active: z.boolean(),
  }),
  announcement_banner: z.object({
    active: z.boolean(),
  }),
  about_preview: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    years_badge: z.string().min(1),
    button_label: z.string().min(1),
    image_url: z.string().min(1),
  }),
  highlights: z.object({
    cards: z.array(cardSchema).length(3),
  }),
  events_preview: z.object({
    section_heading: z.string().min(1),
    show_count: z.number().min(1).max(12),
  }),
  gallery_preview: z.object({
    section_heading: z.string().min(1),
    show_count: z.number().min(1).max(20),
  }),
  admissions_cta: z.object({
    heading: z.string().min(1),
    subheading: z.string().min(1),
    button_label: z.string().min(1),
    session_year: z.string().min(1),
  }),
});

type HomeFormValues = z.infer<typeof homeSchema>;

const HomeEditor = () => {
  const form = useForm<HomeFormValues>({
    resolver: zodResolver(homeSchema),
    defaultValues: homeDefaults,
  });

  const heroQuery = useSectionContentBlocks("home", "hero", homeDefaults.hero);
  const announcementQuery = useSectionContentBlocks("home", "announcement_banner", homeDefaults.announcement_banner);
  const aboutPreviewQuery = useSectionContentBlocks("home", "about_preview", homeDefaults.about_preview);
  const highlightsQuery = useSectionContentBlocks("home", "highlights", homeDefaults.highlights);
  const eventsPreviewQuery = useSectionContentBlocks("home", "events_preview", homeDefaults.events_preview);
  const galleryPreviewQuery = useSectionContentBlocks("home", "gallery_preview", homeDefaults.gallery_preview);
  const admissionsCtaQuery = useSectionContentBlocks("home", "admissions_cta", homeDefaults.admissions_cta);

  const upsertMutation = useUpsertSectionContentBlocks();
  const watchedValues = useWatch({ control: form.control });
  const [draftData, setDraftData] = useState<PreviewDraftData>(homeDefaults as unknown as PreviewDraftData);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const loadedDefaults = useMemo<HomeFormValues | null>(() => {
    if (
      heroQuery.data &&
      announcementQuery.data &&
      aboutPreviewQuery.data &&
      highlightsQuery.data &&
      eventsPreviewQuery.data &&
      galleryPreviewQuery.data &&
      admissionsCtaQuery.data
    ) {
      return {
        hero: heroQuery.data,
        announcement_banner: announcementQuery.data,
        about_preview: aboutPreviewQuery.data,
        highlights: highlightsQuery.data as HomeFormValues["highlights"],
        events_preview: eventsPreviewQuery.data as HomeFormValues["events_preview"],
        gallery_preview: galleryPreviewQuery.data as HomeFormValues["gallery_preview"],
        admissions_cta: admissionsCtaQuery.data as HomeFormValues["admissions_cta"],
      };
    }
    return null;
  }, [
    heroQuery.data,
    announcementQuery.data,
    aboutPreviewQuery.data,
    highlightsQuery.data,
    eventsPreviewQuery.data,
    galleryPreviewQuery.data,
    admissionsCtaQuery.data,
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
      setDraftData((watchedValues as PreviewDraftData) ?? (homeDefaults as unknown as PreviewDraftData));
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedValues]);

  const onUpload = async (fieldPath: keyof HomeFormValues | string, bucket: string, folder: string, file?: File) => {
    if (!file) {
      return;
    }
    setUploadingField(String(fieldPath));
    try {
      const url = await uploadImageToBucket(file, bucket, folder);
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
      page: "home",
      section,
      fields: Object.entries(values).reduce<Record<string, { value: unknown; contentType: "text" | "richtext" | "image" | "boolean" | "number" | "json" }>>((acc, [key, value]) => {
        acc[key] = { value, contentType: contentTypes[key as keyof T] };
        return acc;
      }, {}),
    });
  };

  const onSave = form.handleSubmit(async (values) => {
    await saveSection("hero", values.hero, {
      heading: "text",
      subheading: "richtext",
      hero_image_url: "image",
      cta_label: "text",
      session_year: "text",
      active: "boolean",
    });
    await saveSection("announcement_banner", values.announcement_banner, { active: "boolean" });
    await saveSection("about_preview", values.about_preview, {
      heading: "text",
      body: "richtext",
      years_badge: "text",
      button_label: "text",
      image_url: "image",
    });
    await saveSection("highlights", values.highlights, { cards: "json" });
    await saveSection("events_preview", values.events_preview, {
      section_heading: "text",
      show_count: "number",
    });
    await saveSection("gallery_preview", values.gallery_preview, {
      section_heading: "text",
      show_count: "number",
    });
    await saveSection("admissions_cta", values.admissions_cta, {
      heading: "text",
      subheading: "richtext",
      button_label: "text",
      session_year: "text",
    });
    toast.success("Home page content saved.");
  });

  const onDiscard = () => {
    if (loadedDefaults) {
      form.reset(loadedDefaults);
      setDraftData(loadedDefaults as unknown as PreviewDraftData);
    }
  };

  return (
    <EditorLayout
      title="Edit Home Page"
      page="home"
      draftData={draftData}
      onSave={onSave}
      onDiscard={onDiscard}
      saving={upsertMutation.isPending}
    >
      <form className="space-y-4">
        <Accordion type="multiple" defaultValue={["hero", "about", "highlights"]}>
          <AccordionItem value="hero">
            <AccordionTrigger>Hero Section</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Heading</Label>
              <Input {...form.register("hero.heading")} />
              <Label>Subheading</Label>
              <Textarea {...form.register("hero.subheading")} rows={3} />
              <Label>Hero Image URL</Label>
              <Input {...form.register("hero.hero_image_url")} />
              <Input type="file" accept="image/*" onChange={(event) => onUpload("hero.hero_image_url", "hero-images", "home-hero", event.target.files?.[0])} />
              <Label>CTA Label</Label>
              <Input {...form.register("hero.cta_label")} />
              <Label>Session Year</Label>
              <Input {...form.register("hero.session_year")} />
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Controller
                  control={form.control}
                  name="hero.active"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
              {uploadingField === "hero.hero_image_url" ? <p className="text-xs text-muted-foreground">Uploading image...</p> : null}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="announcement">
            <AccordionTrigger>Announcement Banner</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Controller
                  control={form.control}
                  name="announcement_banner.active"
                  render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="about">
            <AccordionTrigger>About Preview</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Heading</Label>
              <Input {...form.register("about_preview.heading")} />
              <Label>Body</Label>
              <Textarea {...form.register("about_preview.body")} rows={4} />
              <Label>Years Badge</Label>
              <Input {...form.register("about_preview.years_badge")} />
              <Label>Button Label</Label>
              <Input {...form.register("about_preview.button_label")} />
              <Label>Image URL</Label>
              <Input {...form.register("about_preview.image_url")} />
              <Input type="file" accept="image/*" onChange={(event) => onUpload("about_preview.image_url", "hero-images", "home-about-preview", event.target.files?.[0])} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="highlights">
            <AccordionTrigger>Highlights Cards</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="rounded-lg border border-border p-3 space-y-2">
                  <p className="text-sm font-semibold">Card {index + 1}</p>
                  <Label>Title</Label>
                  <Input {...form.register(`highlights.cards.${index}.title`)} />
                  <Label>Description</Label>
                  <Textarea {...form.register(`highlights.cards.${index}.description`)} rows={3} />
                  <Label>Image URL</Label>
                  <Input {...form.register(`highlights.cards.${index}.image_url`)} />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      onUpload(`highlights.cards.${index}.image_url`, "hero-images", "home-highlights", event.target.files?.[0])
                    }
                  />
                  <Label>Link</Label>
                  <Input {...form.register(`highlights.cards.${index}.link`)} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="events">
            <AccordionTrigger>Events Preview</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Section Heading</Label>
              <Input {...form.register("events_preview.section_heading")} />
              <Label>Show Count</Label>
              <Input
                type="number"
                {...form.register("events_preview.show_count", { valueAsNumber: true })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="gallery">
            <AccordionTrigger>Gallery Preview</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Section Heading</Label>
              <Input {...form.register("gallery_preview.section_heading")} />
              <Label>Show Count</Label>
              <Input
                type="number"
                {...form.register("gallery_preview.show_count", { valueAsNumber: true })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="admission">
            <AccordionTrigger>Admissions CTA</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Heading</Label>
              <Input {...form.register("admissions_cta.heading")} />
              <Label>Subheading</Label>
              <Textarea {...form.register("admissions_cta.subheading")} rows={3} />
              <Label>Button Label</Label>
              <Input {...form.register("admissions_cta.button_label")} />
              <Label>Session Year</Label>
              <Input {...form.register("admissions_cta.session_year")} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {Object.keys(form.formState.errors).length > 0 ? (
          <p className="text-xs text-destructive">Please fix validation errors before saving.</p>
        ) : null}
        <Button type="button" onClick={onSave} className="hidden">
          Save
        </Button>
      </form>
    </EditorLayout>
  );
};

export default HomeEditor;

