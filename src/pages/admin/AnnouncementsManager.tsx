import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface AnnouncementRow {
  id: string;
  title: string;
  content: string | null;
  date: string | null;
  active: boolean | null;
  important: boolean | null;
  sort_order: number | null;
}

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string().min(1),
  active: z.boolean(),
  important: z.boolean(),
  sort_order: z.number().int(),
});

type FormValues = z.infer<typeof schema>;

const AnnouncementsManager = () => {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", content: "", date: "", active: true, important: false, sort_order: 0 },
  });

  const query = useQuery({
    queryKey: ["admin_announcements"],
    queryFn: async (): Promise<AnnouncementRow[]> => {
      try {
        const { data, error } = await supabase.from("announcements").select("*").order("sort_order", { ascending: true });
        if (error) throw error;
        return data as AnnouncementRow[];
      } catch (error) {
        toast.error("Failed to load announcements.");
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        const { error } = await supabase.from("announcements").insert(values);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to create announcement.");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      toast.success("Announcement created.");
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("announcements").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to delete announcement.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Announcement deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
    },
  });

  return (
    <div className="p-5 space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-heading text-lg font-semibold mb-4">Create Announcement</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit((v) => void createMutation.mutateAsync(v))}>
          <div><Label>Title</Label><Input {...form.register("title")} /></div>
          <div><Label>Date</Label><Input type="date" {...form.register("date")} /></div>
          <div className="md:col-span-2"><Label>Content</Label><Textarea rows={3} {...form.register("content")} /></div>
          <div><Label>Sort Order</Label><Input type="number" {...form.register("sort_order", { valueAsNumber: true })} /></div>
          <div className="flex items-center gap-3"><Label>Active</Label><Switch checked={form.watch("active")} onCheckedChange={(v) => form.setValue("active", v)} /></div>
          <div className="flex items-center gap-3"><Label>Important (Top Marquee)</Label><Switch checked={form.watch("important")} onCheckedChange={(v) => form.setValue("important", v)} /></div>
          <div className="md:col-span-2"><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create"}</Button></div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-heading text-lg font-semibold">Announcements</h3>
        {(query.data ?? []).map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">{row.title}</p>
              <p className="text-xs text-muted-foreground">{row.date} | {row.active ? "Active" : "Inactive"} | {row.important ? "Important" : "Normal"}</p>
            </div>
            <Button type="button" variant="destructive" onClick={() => void deleteMutation.mutateAsync(row.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsManager;
