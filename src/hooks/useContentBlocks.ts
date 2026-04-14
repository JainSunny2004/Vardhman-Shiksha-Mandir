import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type ContentType = "text" | "richtext" | "image" | "boolean" | "number" | "json";

interface ContentBlockRow {
  field_key: string;
  value: string | null;
  content_type: ContentType | null;
}

const castValue = (raw: string | null, type: ContentType | null): unknown => {
  if (raw === null) return null;
  if (type === "boolean") return raw === "true";
  if (type === "number") {
    const n = Number(raw);
    return Number.isNaN(n) ? 0 : n;
  }
  if (type === "json") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
};

export const useContentBlocks = (page: string, section?: string) => {
  return useQuery({
    queryKey: ["content_blocks_public", page, section ?? "all"],
    staleTime: 60_000,
    queryFn: async (): Promise<Record<string, unknown>> => {
      let query = supabase
        .from("content_blocks")
        .select("field_key, value, content_type")
        .eq("page", page);

      if (section) {
        query = query.eq("section", section);
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      const mapped: Record<string, unknown> = {};
      (data as ContentBlockRow[]).forEach((row) => {
        mapped[row.field_key] = castValue(row.value, row.content_type);
      });
      return mapped;
    },
  });
};

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  date: string | null;
  active: boolean;
  sort_order: number;
  important?: boolean | null;
}

export const useAnnouncements = () =>
  useQuery({
    queryKey: ["announcements_public"],
    staleTime: 30_000,
    queryFn: async (): Promise<Announcement[]> => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Announcement[];
    },
  });

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export const useEvents = (limit?: number) =>
  useQuery({
    queryKey: ["events_public", limit ?? "all"],
    staleTime: 30_000,
    queryFn: async (): Promise<EventItem[]> => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("active", true)
        .order("event_date", { ascending: true });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as EventItem[];
    },
  });

export interface GalleryItem {
  id: string;
  src_url: string;
  alt_text: string | null;
  category: string | null;
  sort_order: number;
}

export const useGallery = (category?: string) =>
  useQuery({
    queryKey: ["gallery_public", category ?? "all"],
    staleTime: 60_000,
    queryFn: async (): Promise<GalleryItem[]> => {
      let query = supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as GalleryItem[];
    },
  });

export interface FacultyItem {
  id: string;
  name: string;
  designation: string | null;
  qualification: string | null;
  department: string | null;
  photo_url: string | null;
  sort_order: number;
  active: boolean;
}

export const useFaculty = () =>
  useQuery({
    queryKey: ["faculty_public"],
    staleTime: 60_000,
    queryFn: async (): Promise<FacultyItem[]> => {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as FacultyItem[];
    },
  });

export interface LeadershipItem {
  id: string;
  role: string;
  name: string;
  qualification: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
}

export const useLeadership = () =>
  useQuery({
    queryKey: ["leadership_public"],
    staleTime: 60_000,
    queryFn: async (): Promise<LeadershipItem[]> => {
      const { data, error } = await supabase.from("leadership").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as LeadershipItem[];
    },
  });

export interface MandatoryDocumentItem {
  id: string;
  title: string;
  file_url: string | null;
  sort_order: number;
}

export const useMandatoryDocuments = () =>
  useQuery({
    queryKey: ["mandatory_documents_public"],
    staleTime: 60_000,
    queryFn: async (): Promise<MandatoryDocumentItem[]> => {
      const { data, error } = await supabase
        .from("mandatory_documents")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MandatoryDocumentItem[];
    },
  });
