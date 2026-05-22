import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  {
    label: "About Us",
    path: "/about",
    children: [
      { label: "History", path: "/about#history" },
      { label: "Vision & Mission", path: "/about#vision" },
      { label: "Leadership", path: "/about#leadership" },
    ],
  },
  {
    label: "Academics",
    path: "/academics",
    children: [
      { label: "Curriculum", path: "/academics#curriculum" },
      { label: "Departments", path: "/academics#departments" },
    ],
  },
  {
    label: "Student Life",
    path: "/student-life",
    children: [
      { label: "Activities", path: "/student-life#activities" },
      { label: "Events", path: "/student-life#events" },
    ],
  },
  { label: "Facilities", path: "/facilities" },
  { label: "Admissions", path: "/admissions" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navBg = scrolled || !isHome
    ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
    : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-foreground" : "text-primary-foreground";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container-narrow mx-auto flex items-center justify-between h-20 px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className={`font-heading text-xl md:text-2xl font-bold tracking-tight ${textColor}`}>
            Vardhman Shiksha Mandir
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => setHoveredMenu(link.label)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                to={link.path}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-primary/10 ${textColor} ${
                  location.pathname === link.path ? "font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
              {link.children && hoveredMenu === link.label && (
                <div className="absolute top-full left-0 mt-1 bg-card shadow-lg rounded-lg border border-border py-2 min-w-[200px] animate-fade-in">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      className="block px-4 py-2 text-sm text-card-foreground hover:bg-muted transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden ${textColor}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-lg animate-fade-in overflow-y-auto max-h-[calc(100vh-5rem)]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  to={link.path}
                  className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </Link>
                {link.children?.map((child) => (
                  <Link
                    key={child.label}
                    to={child.path}
                    className="block pl-8 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
