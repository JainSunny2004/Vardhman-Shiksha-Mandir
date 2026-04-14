import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { uploadFileToBucket } from "@/lib/adminUploads";

interface DocumentRow {
  id: string;
  title: string;
  file_url: string | null;
  sort_order: number | null;
}

const schema = z.object({
  title: z.string().min(1),
  sort_order: z.number().int(),
});

type FormValues = z.infer<typeof schema>;

const MandatoryDocumentsManager = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", sort_order: 0 },
  });

  const query = useQuery({
    queryKey: ["admin_documents"],
    queryFn: async (): Promise<DocumentRow[]> => {
      try {
        const { data, error } = await supabase.from("mandatory_documents").select("*").order("sort_order", { ascending: true });
        if (error) throw error;
        return data as DocumentRow[];
      } catch (error) {
        toast.error("Failed to load documents.");
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        let fileUrl: string | null = null;
        if (file) fileUrl = await uploadFileToBucket(file, "documents", "mandatory");
        const { error } = await supabase.from("mandatory_documents").insert({ ...values, file_url: fileUrl });
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to create document record.");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      setFile(null);
      toast.success("Document added.");
      queryClient.invalidateQueries({ queryKey: ["admin_documents"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("mandatory_documents").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to delete document.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Document deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_documents"] });
    },
  });

  return (
    <div className="p-5 space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-heading text-lg font-semibold mb-4">Add Mandatory Document</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit((v) => void createMutation.mutateAsync(v))}>
          <div><Label>Title</Label><Input {...form.register("title")} /></div>
          <div><Label>Sort Order</Label><Input type="number" {...form.register("sort_order", { valueAsNumber: true })} /></div>
          <div className="md:col-span-2"><Label>PDF File</Label><Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <div className="md:col-span-2"><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create"}</Button></div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-heading text-lg font-semibold">Documents</h3>
        {(query.data ?? []).map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">{row.title}</p>
              {row.file_url ? <a className="text-xs text-primary underline" href={row.file_url} target="_blank" rel="noreferrer">View PDF</a> : <p className="text-xs text-muted-foreground">No file</p>}
            </div>
            <Button type="button" variant="destructive" onClick={() => void deleteMutation.mutateAsync(row.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MandatoryDocumentsManager;

