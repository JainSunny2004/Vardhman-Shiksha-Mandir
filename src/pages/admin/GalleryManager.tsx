import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadImageToBucket } from "@/lib/adminUploads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GalleryImageRow {
  id: string;
  src_url: string;
  alt_text: string | null;
  category: string | null;
  sort_order: number | null;
}

const uploadSchema = z.object({
  category: z.string().min(1, "Category is required"),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const GalleryManager = () => {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingRows, setEditingRows] = useState<Record<string, { alt_text: string; category: string; sort_order: string }>>({});

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { category: "Campus" },
  });

  const galleryQuery = useQuery({
    queryKey: ["admin_gallery_images"],
    queryFn: async (): Promise<GalleryImageRow[]> => {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("id, src_url, alt_text, category, sort_order")
          .order("sort_order", { ascending: true });
        if (error) {
          throw error;
        }
        return data as GalleryImageRow[];
      } catch (error) {
        toast.error("Failed to load gallery images.");
        throw error;
      }
    },
  });

  const nextSortOrder = useMemo(() => {
    const orders = (galleryQuery.data ?? []).map((row) => row.sort_order ?? 0);
    return orders.length ? Math.max(...orders) + 1 : 1;
  }, [galleryQuery.data]);

  const bulkUploadMutation = useMutation({
    mutationFn: async (values: UploadFormValues) => {
      if (!selectedFiles.length) {
        throw new Error("Please choose one or more image files.");
      }

      try {
        const createdRows: Array<{ src_url: string; alt_text: string; category: string; sort_order: number }> = [];
        for (let index = 0; index < selectedFiles.length; index += 1) {
          const file = selectedFiles[index];
          const publicUrl = await uploadImageToBucket(file, "gallery", "gallery");
          createdRows.push({
            src_url: publicUrl,
            alt_text: file.name.replace(/\.[^/.]+$/, ""),
            category: values.category,
            sort_order: nextSortOrder + index,
          });
        }

        const { error } = await supabase.from("gallery_images").insert(createdRows);
        if (error) {
          throw error;
        }
      } catch (error) {
        toast.error("Bulk gallery upload failed.");
        throw error;
      }
    },
    onSuccess: () => {
      setSelectedFiles([]);
      toast.success("Gallery images uploaded.");
      queryClient.invalidateQueries({ queryKey: ["admin_gallery_images"] });
    },
  });

  const updateRowMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: { alt_text: string; category: string; sort_order: string } }) => {
      try {
        const parsedSort = Number(values.sort_order);
        const { error } = await supabase
          .from("gallery_images")
          .update({
            alt_text: values.alt_text,
            category: values.category,
            sort_order: Number.isNaN(parsedSort) ? 0 : parsedSort,
          })
          .eq("id", id);
        if (error) {
          throw error;
        }
      } catch (error) {
        toast.error("Failed to update gallery image.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Gallery image updated.");
      queryClient.invalidateQueries({ queryKey: ["admin_gallery_images"] });
    },
  });

  const deleteRowMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("gallery_images").delete().eq("id", id);
        if (error) {
          throw error;
        }
      } catch (error) {
        toast.error("Failed to delete gallery image.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Gallery image deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_gallery_images"] });
    },
  });

  return (
    <div className="p-5 space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <h2 className="font-heading text-lg font-semibold">Bulk Upload Gallery Images</h2>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => {
            void bulkUploadMutation.mutateAsync(values);
          })}
        >
          <div>
            <Label>Category</Label>
            <Input {...form.register("category")} />
          </div>
          <div>
            <Label>Choose Files</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
            />
            <p className="text-xs text-muted-foreground mt-1">{selectedFiles.length} file(s) selected</p>
          </div>
          <Button type="submit" disabled={bulkUploadMutation.isPending}>
            <Upload size={14} className="mr-2" />
            {bulkUploadMutation.isPending ? "Uploading..." : "Upload Images"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-heading text-lg font-semibold mb-4">Gallery Images</h3>
        <div className="space-y-4">
          {(galleryQuery.data ?? []).map((row) => {
            const editValues = editingRows[row.id] ?? {
              alt_text: row.alt_text ?? "",
              category: row.category ?? "",
              sort_order: String(row.sort_order ?? 0),
            };
            return (
              <div key={row.id} className="rounded-lg border border-border p-3">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <img src={row.src_url} alt={editValues.alt_text || "Gallery image"} className="w-full h-32 object-cover rounded-md" />
                  <div className="lg:col-span-3 space-y-2">
                    <div>
                      <Label>Caption</Label>
                      <Textarea
                        rows={2}
                        value={editValues.alt_text}
                        onChange={(event) =>
                          setEditingRows((prev) => ({
                            ...prev,
                            [row.id]: { ...editValues, alt_text: event.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={editValues.category}
                          onChange={(event) =>
                            setEditingRows((prev) => ({
                              ...prev,
                              [row.id]: { ...editValues, category: event.target.value },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Sort Order</Label>
                        <Input
                          type="number"
                          value={editValues.sort_order}
                          onChange={(event) =>
                            setEditingRows((prev) => ({
                              ...prev,
                              [row.id]: { ...editValues, sort_order: event.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => void updateRowMutation.mutateAsync({ id: row.id, values: editValues })}
                        disabled={updateRowMutation.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => void deleteRowMutation.mutateAsync(row.id)}
                        disabled={deleteRowMutation.isPending}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;

