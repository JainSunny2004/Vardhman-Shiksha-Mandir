import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EditorLayout from "@/components/admin/EditorLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactDefaults } from "@/lib/cmsDefaults";
import { useSectionContentBlocks, useUpsertSectionContentBlocks } from "@/hooks/useAdminContentBlocks";
import type { PreviewDraftData } from "@/components/admin/PreviewDraftContext";
import type { ContentType } from "@/hooks/useAdminContentBlocks";

const contactSchema = z.object({
  info: z.object({
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    office_hours: z.string().min(1),
    map_embed_url: z.string(),
  }),
  form_settings: z.object({
    success_message: z.string().min(1),
    form_heading: z.string().min(1),
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactEditor = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaults,
  });

  const infoQuery = useSectionContentBlocks("contact", "info", contactDefaults.info);
  const formSettingsQuery = useSectionContentBlocks("contact", "form_settings", contactDefaults.form_settings);
  const upsertMutation = useUpsertSectionContentBlocks();
  const watchedValues = useWatch({ control: form.control });
  const [draftData, setDraftData] = useState<PreviewDraftData>(contactDefaults as unknown as PreviewDraftData);

  const loadedDefaults = useMemo<ContactFormValues | null>(() => {
    if (infoQuery.data && formSettingsQuery.data) {
      return {
        info: infoQuery.data as ContactFormValues["info"],
        form_settings: formSettingsQuery.data as ContactFormValues["form_settings"],
      };
    }
    return null;
  }, [infoQuery.data, formSettingsQuery.data]);

  useEffect(() => {
    if (!loadedDefaults) {
      return;
    }
    form.reset(loadedDefaults);
    setDraftData(loadedDefaults as unknown as PreviewDraftData);
  }, [form, loadedDefaults]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDraftData((watchedValues as PreviewDraftData) ?? (contactDefaults as unknown as PreviewDraftData));
    }, 300);
    return () => clearTimeout(timeout);
  }, [watchedValues]);

  const saveSection = async <T extends Record<string, unknown>>(
    section: string,
    values: T,
    contentTypes: Record<keyof T, ContentType>,
  ) => {
    await upsertMutation.mutateAsync({
      page: "contact",
      section,
      fields: Object.entries(values).reduce<Record<string, { value: unknown; contentType: ContentType }>>((acc, [key, value]) => {
        acc[key] = { value, contentType: contentTypes[key as keyof T] };
        return acc;
      }, {}),
    });
  };

  const onSave = form.handleSubmit(async (values) => {
    await saveSection("info", values.info, {
      address: "text",
      phone: "text",
      email: "text",
      office_hours: "text",
      map_embed_url: "text",
    });
    await saveSection("form_settings", values.form_settings, {
      success_message: "text",
      form_heading: "text",
    });
    toast.success("Contact page content saved.");
  });

  const onDiscard = () => {
    if (loadedDefaults) {
      form.reset(loadedDefaults);
      setDraftData(loadedDefaults as unknown as PreviewDraftData);
    }
  };

  return (
    <EditorLayout
      title="Edit Contact Page"
      page="contact"
      draftData={draftData}
      onSave={onSave}
      onDiscard={onDiscard}
      saving={upsertMutation.isPending}
    >
      <form className="space-y-4">
        <Accordion type="multiple" defaultValue={["info", "form_settings"]}>
          <AccordionItem value="info">
            <AccordionTrigger>Contact Info</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Address</Label>
              <Textarea rows={3} {...form.register("info.address")} />
              <Label>Phone</Label>
              <Input {...form.register("info.phone")} />
              <Label>Email</Label>
              <Input type="email" {...form.register("info.email")} />
              <Label>Office Hours</Label>
              <Input {...form.register("info.office_hours")} />
              <Label>Map Embed URL</Label>
              <Input {...form.register("info.map_embed_url")} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="form_settings">
            <AccordionTrigger>Form Settings</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Label>Form Heading</Label>
              <Input {...form.register("form_settings.form_heading")} />
              <Label>Success Message</Label>
              <Textarea rows={3} {...form.register("form_settings.success_message")} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </EditorLayout>
  );
};

export default ContactEditor;

