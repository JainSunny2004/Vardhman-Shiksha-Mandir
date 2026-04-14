import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import StudentLife from "./pages/StudentLife";
import Facilities from "./pages/Facilities";
import Admissions from "./pages/Admissions";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import MandatoryDisclosure from "./pages/MandatoryDisclosure";
import NotFound from "./pages/NotFound";

// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import PageEditorRouter from "./pages/admin/PageEditorRouter";
import GalleryManager from "./pages/admin/GalleryManager";
import FacultyManager from "./pages/admin/FacultyManager";
import LeadershipManager from "./pages/admin/LeadershipManager";
import AnnouncementsManager from "./pages/admin/AnnouncementsManager";
import EventsManager from "./pages/admin/EventsManager";
import MandatoryDocumentsManager from "./pages/admin/MandatoryDocumentsManager";
import ContactSubmissionsManager from "./pages/admin/ContactSubmissionsManager";

// Admin shell
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/student-life" element={<StudentLife />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />

          {/* Admin login (unprotected) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            {/* Page editors — placeholders for Phase 3 */}
            <Route path="pages/:page" element={<PageEditorRouter />} />
            {/* Content managers — placeholders for Phase 3 */}
            <Route path="announcements" element={<AnnouncementsManager />} />
            <Route path="events" element={<EventsManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="faculty" element={<FacultyManager />} />
            <Route path="leadership" element={<LeadershipManager />} />
            <Route path="mandatory-documents" element={<MandatoryDocumentsManager />} />
            <Route path="contact-submissions" element={<ContactSubmissionsManager />} />
            <Route path="settings" element={<Dashboard />} />
            <Route path="users" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
