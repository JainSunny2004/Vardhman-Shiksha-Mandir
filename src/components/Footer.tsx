import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useContentBlocks } from "@/hooks/useContentBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const Footer = () => {
  const infoQuery = useContentBlocks("contact", "info");
  if (infoQuery.isLoading) return <footer className="bg-foreground text-primary-foreground p-8"><Skeleton className="h-20 w-full" /></footer>;
  const info = infoQuery.data ?? {};

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-2xl font-bold mb-4">Vardhman Shiksha Mandir</h3>
            <p className="text-primary-foreground/70 mb-6 max-w-md leading-relaxed">
              An English Medium Senior Secondary School committed to nurturing young minds
              with a blend of academic excellence and moral values since its inception.
            </p>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{String(info.address ?? "Daryaganj, New Delhi - 110002")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <span>{String(info.phone ?? "01123277448")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <span>{String(info.email ?? "vardhmanschool@yahoo.co.in")}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", path: "/about" },
                { label: "Academics", path: "/academics" },
                { label: "Admissions", path: "/admissions" },
                { label: "Gallery", path: "/gallery" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Faculty", path: "/faculty" },
                { label: "Student Life", path: "/student-life" },
                { label: "Facilities", path: "/facilities" },
                { label: "Mandatory Disclosure", path: "/mandatory-disclosure" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Vardhman Shiksha Mandir, Daryaganj, Delhi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
