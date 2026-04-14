import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Megaphone, CalendarDays, Image, GraduationCap, Mail,
  FileText, Crown, ArrowRight, Clock,
} from 'lucide-react';

interface Stat {
  label: string;
  count: number | null;
  icon: React.ElementType;
  color: string;
  path: string;
}

interface LastUpdated {
  page: string;
  updated_at: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Announcements',       count: null, icon: Megaphone,    color: 'bg-blue-500/10 text-blue-600',   path: '/admin/announcements' },
    { label: 'Events',              count: null, icon: CalendarDays, color: 'bg-green-500/10 text-green-600', path: '/admin/events' },
    { label: 'Gallery Images',      count: null, icon: Image,        color: 'bg-purple-500/10 text-purple-600', path: '/admin/gallery' },
    { label: 'Faculty Members',     count: null, icon: GraduationCap,color: 'bg-orange-500/10 text-orange-600', path: '/admin/faculty' },
    { label: 'Leadership',          count: null, icon: Crown,        color: 'bg-yellow-500/10 text-yellow-600', path: '/admin/leadership' },
    { label: 'Unread Submissions',  count: null, icon: Mail,         color: 'bg-red-500/10 text-red-600',     path: '/admin/contact-submissions' },
  ]);

  const [lastUpdated, setLastUpdated] = useState<LastUpdated[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ann, events, gallery, faculty, leadership, submissions, blocks] = await Promise.all([
          supabase.from('announcements').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
          supabase.from('faculty').select('id', { count: 'exact', head: true }),
          supabase.from('leadership').select('id', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('read', false),
          supabase.from('content_blocks').select('page, updated_at').order('updated_at', { ascending: false }).limit(5),
        ]);

        setStats(prev => [
          { ...prev[0], count: ann.count ?? 0 },
          { ...prev[1], count: events.count ?? 0 },
          { ...prev[2], count: gallery.count ?? 0 },
          { ...prev[3], count: faculty.count ?? 0 },
          { ...prev[4], count: leadership.count ?? 0 },
          { ...prev[5], count: submissions.count ?? 0 },
        ]);

        if (blocks.data) setLastUpdated(blocks.data as LastUpdated[]);
      } catch {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    { label: 'Edit Home Page',    path: '/admin/pages/home',       icon: FileText },
    { label: 'Edit About Page',   path: '/admin/pages/about',      icon: FileText },
    { label: 'Manage Faculty',    path: '/admin/faculty',          icon: GraduationCap },
    { label: 'Manage Events',     path: '/admin/events',           icon: CalendarDays },
    { label: 'Manage Gallery',    path: '/admin/gallery',          icon: Image },
    { label: 'View Submissions',  path: '/admin/contact-submissions', icon: Mail },
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back — here's what's happening on your site.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all group"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div className="text-2xl font-bold font-heading text-foreground">
              {loading ? (
                <div className="h-7 w-8 bg-muted rounded animate-pulse" />
              ) : (
                stat.count ?? '—'
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-4">Quick Links</h2>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <link.icon size={15} className="text-muted-foreground" />
                  {link.label}
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Last updated */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-heading text-sm font-semibold text-foreground mb-4">Recently Updated Content</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : lastUpdated.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content blocks updated yet.</p>
          ) : (
            <div className="space-y-2">
              {lastUpdated.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-foreground capitalize">
                    <FileText size={13} className="text-muted-foreground" />
                    {item.page} page
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    {new Date(item.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
