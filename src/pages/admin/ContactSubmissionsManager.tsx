import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface SubmissionRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  created_at: string | null;
  read: boolean | null;
}

const ContactSubmissionsManager = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin_contact_submissions"],
    queryFn: async (): Promise<SubmissionRow[]> => {
      try {
        const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return data as SubmissionRow[];
      } catch (error) {
        toast.error("Failed to load contact submissions.");
        throw error;
      }
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("contact_submissions").update({ read: true }).eq("id", id);
        if (error) throw error;
      } catch (error) {
        toast.error("Failed to mark submission as read.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Submission marked as read.");
      queryClient.invalidateQueries({ queryKey: ["admin_contact_submissions"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .delete()
          .eq("id", id)
          .select("id");
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Delete failed: submission not found or not permitted by policy.");
        }
      } catch (error) {
        toast.error("Failed to delete submission.");
        throw error;
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<SubmissionRow[]>(["admin_contact_submissions"], (prev) =>
        (prev ?? []).filter((row) => row.id !== id),
      );
      toast.success("Submission deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin_contact_submissions"] });
    },
  });

  return (
    <div className="p-5">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="font-heading text-lg font-semibold mb-4">Contact Submissions</h2>
        <div className="space-y-3">
          {(query.data ?? []).map((row) => (
            <div key={row.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{row.subject ?? "No Subject"}</p>
                <span className="text-xs text-muted-foreground">{row.created_at ? new Date(row.created_at).toLocaleString() : ""}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{row.name} | {row.email} | {row.phone}</p>
              <p className="text-sm mb-3">{row.message}</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" disabled={Boolean(row.read)} onClick={() => void markReadMutation.mutateAsync(row.id)}>
                  {row.read ? "Read" : "Mark as Read"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => void deleteMutation.mutateAsync(row.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactSubmissionsManager;
