import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const uploadImageToBucket = async (
  file: File,
  bucket: string,
  folder: string,
): Promise<string> => {
  return uploadFileToBucket(file, bucket, folder);
};

export const uploadFileToBucket = async (
  file: File,
  bucket: string,
  folder: string,
): Promise<string> => {
  try {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
    });
    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    toast.error("File upload failed. Please try again.");
    throw error;
  }
};
