import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { PreviewDraftProvider, type PreviewDraftData } from './PreviewDraftContext';

// Public page components
import Index from '@/pages/Index';
import About from '@/pages/About';
import Academics from '@/pages/Academics';
import Admissions from '@/pages/Admissions';
import Facilities from '@/pages/Facilities';
import StudentLife from '@/pages/StudentLife';
import Contact from '@/pages/Contact';
import Gallery from '@/pages/Gallery';
import Faculty from '@/pages/Faculty';

type Device = 'desktop' | 'tablet' | 'mobile';

interface Props {
  page: string;
  draftData: PreviewDraftData;
  device?: Device;
}

// Isolated QueryClient — queries disabled so preview uses only draftData from props
const previewQueryClient = new QueryClient({
  defaultOptions: { queries: { enabled: false, retry: false } },
});

const deviceStyles: Record<Device, { containerClass: string; innerStyle: React.CSSProperties }> = {
  desktop: {
    containerClass: 'w-full',
    innerStyle: { width: '100%', transform: 'translateZ(0)' },
  },
  tablet: {
    containerClass: 'mx-auto',
    innerStyle: { width: '768px', transform: 'translateZ(0) scale(0.75)', transformOrigin: 'top center' },
  },
  mobile: {
    containerClass: 'mx-auto',
    innerStyle: { width: '375px', transform: 'translateZ(0) scale(0.65)', transformOrigin: 'top center' },
  },
};

const pageRouteMap: Record<string, { path: string; Component: React.ComponentType }> = {
  home: { path: "/", Component: Index },
  about: { path: "/about", Component: About },
  academics: { path: "/academics", Component: Academics },
  admissions: { path: "/admissions", Component: Admissions },
  facilities: { path: "/facilities", Component: Facilities },
  "student-life": { path: "/student-life", Component: StudentLife },
  contact: { path: "/contact", Component: Contact },
  gallery: { path: "/gallery", Component: Gallery },
  faculty: { path: "/faculty", Component: Faculty },
};

const PreviewWrapper = ({ page }: { page: string }) => {
  const entry = pageRouteMap[page];

  if (!entry) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Select a page section to preview it here.
      </div>
    );
  }

  const { Component } = entry;

  return (
    <Component />
  );
};

const PreviewPanel = ({ page, draftData, device = 'desktop' }: Props) => {
  const { containerClass, innerStyle } = deviceStyles[device];
  const entry = pageRouteMap[page];
  const iframeSrc = entry ? `${entry.path}?preview_device=${device}` : "/";

  return (
    <QueryClientProvider client={previewQueryClient}>
      <PreviewDraftProvider page={page} data={draftData}>
        {device === "desktop" ? (
          <div className={cn('h-full overflow-auto rounded-lg border border-border bg-background shadow-sm', containerClass)}>
            <div style={innerStyle} className="min-h-full">
              <PreviewWrapper page={page} />
            </div>
          </div>
        ) : (
          <div className={cn("h-full overflow-auto rounded-lg border border-border bg-background shadow-sm", containerClass)}>
            <div style={innerStyle} className="min-h-full">
              <iframe
                title={`${page}-responsive-preview`}
                src={iframeSrc}
                className="h-[1200px] w-full border-0 bg-background"
              />
            </div>
          </div>
        )}
      </PreviewDraftProvider>
    </QueryClientProvider>
  );
};

export default PreviewPanel;
