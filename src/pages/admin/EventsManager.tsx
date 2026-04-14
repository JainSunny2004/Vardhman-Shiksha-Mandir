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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { uploadImageToBucket } from "@/lib/adminUploads";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  active: boolean | null;
  sort_order: number | null;
}

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  event_date: z.string().min(1),
  active: z.boolean(),
  sort_order: z.number().int(),
});

type FormValues = z.infer<typeof schema>;

const EventsManager = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", event_date: "", active: true, sort_order: 0 },
  });

  const query = useQuery({
    queryKey: ["admin_events"],
    queryFn: async (): Promise<EventRow[]> => {
      try {
        const { data, error } = await supabase.from("events").select("*").order("sort_order", { ascending: true });
        if (error) throw error;
        return data as EventRow[];
      } catch (error) {
        toast.error("Failed to load events.");
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        let imageUrl: string | null = null;
        if (file) imageUrl = await uploadImageToBucket(file, "misc", "events");
        const { error } = await supabase.from("events").insert({ ...values, image_url: imageUrl });
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to create event.");
        throw error;
      }
    },
    onSuccess: () => {
      form.reset();
      setFile(null);
      toast.success("Event created.");
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("events").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to delete event.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Event deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
    },
  });

  return (
    <div className="p-5 space-y-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-heading text-lg font-semibold mb-4">Create Event</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={form.handleSubmit((v) => void createMutation.mutateAsync(v))}>
          <div><Label>Title</Label><Input {...form.register("title")} /></div>
          <div><Label>Event Date</Label><Input type="date" {...form.register("event_date")} /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} {...form.register("description")} /></div>
          <div><Label>Sort Order</Label><Input type="number" {...form.register("sort_order", { valueAsNumber: true })} /></div>
          <div><Label>Image</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
          <div className="flex items-center gap-3"><Label>Active</Label><Switch checked={form.watch("active")} onCheckedChange={(v) => form.setValue("active", v)} /></div>
          <div className="md:col-span-2"><Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? "Saving..." : "Create"}</Button></div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-heading text-lg font-semibold">Events</h3>
        {(query.data ?? []).map((row) => (
          <div key={row.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              {row.image_url ? <img src={row.image_url} alt={row.title} className="h-12 w-12 rounded-md object-cover" /> : <div className="h-12 w-12 rounded-md bg-muted" />}
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">{row.event_date} | {row.active ? "Active" : "Inactive"}</p>
              </div>
            </div>
            <Button type="button" variant="destructive" onClick={() => void deleteMutation.mutateAsync(row.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManager;

