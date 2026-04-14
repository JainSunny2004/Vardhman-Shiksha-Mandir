import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export type ContentType = "text" | "richtext" | "image" | "boolean" | "number" | "json";

interface ContentBlockRow {
  field_key: string;
  value: string | null;
  content_type: ContentType;
}

type DefaultSectionValues = Record<string, unknown>;

const castValue = (raw: string | null, contentType: ContentType): unknown => {
  if (raw === null) {
    return raw;
  }

  if (contentType === "boolean") {
    return raw === "true";
  }

  if (contentType === "number") {
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (contentType === "json") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  return raw;
};

const serializeValue = (value: unknown, contentType: ContentType): string => {
  if (contentType === "json") {
    return JSON.stringify(value ?? null);
  }
  if (contentType === "boolean") {
    return String(Boolean(value));
  }
  return String(value ?? "");
};

export const useSectionContentBlocks = <TSectionValues extends DefaultSectionValues>(
  page: string,
  section: string,
  defaults: TSectionValues,
) => {
  return useQuery({
    queryKey: ["content_blocks", page, section],
    queryFn: async (): Promise<TSectionValues> => {
      try {
        const { data, error } = await supabase
          .from("content_blocks")
          .select("field_key, value, content_type")
          .eq("page", page)
          .eq("section", section);

        if (error) {
          throw error;
        }

        const merged: Record<string, unknown> = { ...defaults };
        (data as ContentBlockRow[]).forEach((row) => {
          merged[row.field_key] = castValue(row.value, row.content_type);
        });
        return merged as TSectionValues;
      } catch (error) {
        toast.error(`Failed to load ${section} content.`);
        throw error;
      }
    },
  });
};

interface UpsertInput {
  page: string;
  section: string;
  fields: Record<string, { value: unknown; contentType: ContentType }>;
}

export const useUpsertSectionContentBlocks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, section, fields }: UpsertInput) => {
      try {
        const rows = Object.entries(fields).map(([fieldKey, field]) => ({
          page,
          section,
          field_key: fieldKey,
          value: serializeValue(field.value, field.contentType),
          content_type: field.contentType,
        }));

        const { error } = await supabase
          .from("content_blocks")
          .upsert(rows, { onConflict: "page,section,field_key" });

        if (error) {
          throw error;
        }
      } catch (error) {
        toast.error(`Failed to save ${section} content.`);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["content_blocks", variables.page, variables.section],
      });
    },
  });
};

