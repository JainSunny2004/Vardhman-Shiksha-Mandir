import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Home, Info, BookOpen, ClipboardList, Building2, Users, Phone,
  Image, Megaphone, CalendarDays, GraduationCap, Crown, FileText,
  Mail, Settings, UserCog, Menu, X, LogOut, School, ChevronDown,
  ChevronRight, Eye, EyeOff, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { cn } from '@/lib/utils';

const pagesNav = [
  { label: 'Home', path: '/admin/pages/home', icon: Home },
  { label: 'About', path: '/admin/pages/about', icon: Info },
  { label: 'Academics', path: '/admin/pages/academics', icon: BookOpen },
  { label: 'Admissions', path: '/admin/pages/admissions', icon: ClipboardList },
  { label: 'Facilities', path: '/admin/pages/facilities', icon: Building2 },
  { label: 'Student Life', path: '/admin/pages/student-life', icon: Users },
  { label: 'Contact', path: '/admin/pages/contact', icon: Phone },
];

const contentNav = [
  { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { label: 'Events', path: '/admin/events', icon: CalendarDays },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Faculty', path: '/admin/faculty', icon: GraduationCap },
  { label: 'Leadership', path: '/admin/leadership', icon: Crown },
  { label: 'Documents', path: '/admin/mandatory-documents', icon: FileText },
];

const systemNav = [
  { label: 'Contact Submissions', path: '/admin/contact-submissions', icon: Mail },
  { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  { label: 'Admin Users', path: '/admin/users', icon: UserCog },
];

interface NavSectionProps {
  title: string;
  items: { label: string; path: string; icon: React.ElementType }[];
  defaultOpen?: boolean;
  onNavigate?: () => void;
}

const NavSection = ({ title, items, defaultOpen = true, onNavigate }: NavSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const location = useLocation();

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        {title}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <ul className="space-y-0.5 mt-1">
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                  )}
                >
                  <item.icon size={15} className="shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

interface AdminLayoutProps {
  showPreviewToggle?: boolean;
  previewVisible?: boolean;
  onTogglePreview?: () => void;
}

const AdminLayout = ({ showPreviewToggle, previewVisible, onTogglePreview }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { signOut } = useAdminAuth();
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link to="/admin" onClick={closeSidebar} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <School size={16} className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-foreground leading-tight">VSM Admin</p>
            <p className="text-xs text-muted-foreground leading-tight">CMS Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Dashboard link */}
        <Link
          to="/admin"
          onClick={closeSidebar}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-3',
            location.pathname === '/admin'
              ? 'bg-primary text-primary-foreground font-medium'
              : 'text-foreground/70 hover:bg-muted hover:text-foreground',
          )}
        >
          <Home size={15} />
          Dashboard
        </Link>

        <NavSection title="Pages" items={pagesNav} onNavigate={closeSidebar} />
        <NavSection title="Content" items={contentNav} onNavigate={closeSidebar} />
        <NavSection title="System" items={systemNav} defaultOpen={false} onNavigate={closeSidebar} />
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-card border-r border-border shrink-0 transition-all duration-200',
        sidebarCollapsed ? 'w-0 overflow-hidden border-r-0' : 'w-60',
      )}>
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={closeSidebar} />
          <aside className="relative z-50 flex flex-col w-64 bg-card border-r border-border">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <button
              className="hidden lg:inline-flex text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <span className="font-heading text-sm font-semibold text-foreground hidden sm:block">
              Vardhman Shiksha Mandir
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showPreviewToggle && (
              <button
                onClick={onTogglePreview}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  previewVisible
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
                )}
              >
                {previewVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                {previewVisible ? 'Preview On' : 'Preview Off'}
              </button>
            )}
            <Link
              to="/"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted transition-colors hidden sm:block"
            >
              View Site ↗
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive px-2 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
