import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { uploadImageToBucket } from "@/lib/adminUploads";

interface FacultyRow {
  id: string;
  name: string;
  designation: string | null;
  qualification: string | null;
  department: string | null;
  photo_url: string | null;
  sort_order: number | null;
  active: boolean | null;
}

const schema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  qualification: z.string().min(1),
  department: z.string().min(1),
  sort_order: z.number().int(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const FacultyManager = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", designation: "", qualification: "", department: "", sort_order: 0, active: true },
  });

  const facultyQuery = useQuery({
    queryKey: ["admin_faculty"],
    queryFn: async (): Promise<FacultyRow[]> => {
      try {
        const { data, error } = await supabase.from("faculty").select("*").order("sort_order", { ascending: true });
        if (error) throw error;
        return data as FacultyRow[];
      } catch (error) {
        toast.error("Failed to load faculty.");
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        let photoUrl: string | null = null;
        if (file) photoUrl = await uploadImageToBucket(file, "faculty-photos", "faculty");
        const { error } = await supabase.from("faculty").insert({
          ...values,
          photo_url: photoUrl,
        });
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to create faculty member.");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      setFile(null);
      toast.success("Faculty member created.");
      queryClient.invalidateQueries({ queryKey: ["admin_faculty"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      try {
        const { error } = await supabase.from("faculty").update({ active }).eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to update faculty status.");
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_faculty"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("faculty").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to delete faculty member.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Faculty member deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_faculty"] });
    },
  });

  return (
    <div className="p-5 space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-heading text-lg font-semibold mb-4">Add Faculty Member</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit((v) => void createMutation.mutateAsync(v))}>
          <div><Label>Name</Label><Input {...form.register("name")} /></div>
          <div><Label>Designation</Label><Input {...form.register("designation")} /></div>
          <div><Label>Qualification</Label><Input {...form.register("qualification")} /></div>
          <div><Label>Department</Label><Input {...form.register("department")} /></div>
          <div><Label>Sort Order</Label><Input type="number" {...form.register("sort_order", { valueAsNumber: true })} /></div>
          <div><Label>Photo</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <div className="flex items-center gap-3"><Label>Active</Label><Switch checked={form.watch("active")} onCheckedChange={(v) => form.setValue("active", v)} /></div>
          <div className="md:col-span-2"><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create"}</Button></div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-heading text-lg font-semibold">Faculty List</h3>
        {(facultyQuery.data ?? []).map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              {row.photo_url ? <img src={row.photo_url} alt={row.name} className="h-12 w-12 rounded-md object-cover" /> : <div className="h-12 w-12 rounded-md bg-muted" />}
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.designation} | {row.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={Boolean(row.active)} onCheckedChange={(v) => void toggleMutation.mutateAsync({ id: row.id, active: v })} />
              <Button type="button" variant="destructive" onClick={() => void deleteMutation.mutateAsync(row.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyManager;

