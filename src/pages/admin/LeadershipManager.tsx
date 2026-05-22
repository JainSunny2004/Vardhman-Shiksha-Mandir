import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { uploadImageToBucket } from "@/lib/adminUploads";

interface LeadershipRow {
  id: string;
  role: string;
  name: string;
  qualification: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number | null;
}

const schema = z.object({
  role: z.string().min(1),
  name: z.string().min(1),
  qualification: z.string(),
  bio: z.string().min(1),
  sort_order: z.number().int(),
});

type FormValues = z.infer<typeof schema>;

const LeadershipManager = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "", name: "", qualification: "", bio: "", sort_order: 0 },
  });

  const query = useQuery({
    queryKey: ["admin_leadership"],
    queryFn: async (): Promise<LeadershipRow[]> => {
      try {
        const { data, error } = await supabase.from("leadership").select("*").order("sort_order", { ascending: true });
        if (error) throw error;
        return data as LeadershipRow[];
      } catch (error) {
        toast.error("Failed to load leadership list.");
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        let photoUrl: string | null = null;
        if (file) photoUrl = await uploadImageToBucket(file, "leadership-photos", "leadership");
        const { error } = await supabase.from("leadership").insert({ ...values, photo_url: photoUrl });
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to create leadership entry.");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      setFile(null);
      toast.success("Leadership entry created.");
      queryClient.invalidateQueries({ queryKey: ["admin_leadership"] });
      queryClient.invalidateQueries({ queryKey: ["leadership_public"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("leadership").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to delete leadership entry.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Leadership entry deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_leadership"] });
      queryClient.invalidateQueries({ queryKey: ["leadership_public"] });
    },
  });

  return (
    <div className="p-5 space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-heading text-lg font-semibold mb-4">Add Leadership Entry</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit((v) => void createMutation.mutateAsync(v))}>
          <div><Label>Role</Label><Input {...form.register("role")} /></div>
          <div><Label>Name</Label><Input {...form.register("name")} /></div>
          <div><Label>Qualification</Label><Input {...form.register("qualification")} /></div>
          <div><Label>Sort Order</Label><Input type="number" {...form.register("sort_order", { valueAsNumber: true })} /></div>
          <div className="md:col-span-2"><Label>Bio</Label><Textarea rows={4} {...form.register("bio")} /></div>
          <div className="md:col-span-2"><Label>Photo</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <div className="md:col-span-2"><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create"}</Button></div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-heading text-lg font-semibold">Leadership List</h3>
        {(query.data ?? []).map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              {row.photo_url ? <img src={row.photo_url} alt={row.name} className="h-12 w-12 rounded-md object-cover" /> : <div className="h-12 w-12 rounded-md bg-muted" />}
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.role}</p>
              </div>
            </div>
            <Button type="button" variant="destructive" onClick={() => void deleteMutation.mutateAsync(row.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadershipManager;

