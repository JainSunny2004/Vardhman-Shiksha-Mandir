import { useState } from "react";
import { Save, RotateCcw, Monitor, Tablet, Smartphone } from "lucide-react";
import PreviewPanel from "./PreviewPanel";
import { cn } from "@/lib/utils";
import type { PreviewDraftData } from "./PreviewDraftContext";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

type Device = "desktop" | "tablet" | "mobile";

interface EditorLayoutProps {
  title: string;
  page: string;
  draftData: PreviewDraftData;
  onSave: () => void;
  onDiscard: () => void;
  saving?: boolean;
  children: React.ReactNode;
}

const deviceConfig: Record<Device, { label: string; icon: React.ElementType }> = {
  desktop: { label: "Desktop", icon: Monitor },
  tablet: { label: "Tablet", icon: Tablet },
  mobile: { label: "Mobile", icon: Smartphone },
};

const EditorLayout = ({
  title,
  page,
  draftData,
  onSave,
  onDiscard,
  saving = false,
  children,
}: EditorLayoutProps) => {
  const [device, setDevice] = useState<Device>("desktop");
  const [previewVisible, setPreviewVisible] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-card px-5 py-3 shrink-0">
        <h2 className="font-heading text-sm font-semibold text-foreground">{title}</h2>

        <div className="flex items-center gap-2">
          {previewVisible && (
            <div className="hidden items-center gap-1 rounded-lg bg-muted p-1 md:flex">
              {(Object.entries(deviceConfig) as [Device, (typeof deviceConfig)[Device]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  title={cfg.label}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    device === key ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <cfg.icon size={14} />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setPreviewVisible((v) => !v)}
            className="hidden rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/80 md:block"
          >
            {previewVisible ? "Hide Preview" : "Show Preview"}
          </button>

          <button
            onClick={onDiscard}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
          >
            <RotateCcw size={12} />
            Discard
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={12} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {previewVisible ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className="h-full overflow-y-auto border-r border-border bg-card">
                <div className="p-5">{children}</div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex h-full min-h-0 flex-col bg-muted">
                <div className="flex items-center justify-center gap-1.5 border-b border-border bg-card/50 py-2 text-xs text-muted-foreground shrink-0">
                  {(() => {
                    const cfg = deviceConfig[device];
                    return (
                      <>
                        <cfg.icon size={12} />
                        {cfg.label}
                      </>
                    );
                  })()}
                </div>
                <div className="flex-1 min-h-0 overflow-auto p-4 flex items-start justify-center">
                  <PreviewPanel page={page} draftData={draftData} device={device} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full overflow-y-auto bg-card">
            <div className="p-5">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorLayout;

