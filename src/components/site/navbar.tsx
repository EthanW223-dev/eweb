import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, LayoutGrid, Briefcase, Tag, Mail, Menu, X } from "lucide-react";
import { Container, Button } from "./primitives";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

// Parallel to the desktop tabs array below; null = separator (no target).
const routes: (string | null)[] = ["/", "/services", "/work", null, "/pricing", "/contact"];

const mobileLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Services", to: "/services", icon: LayoutGrid },
  { label: "Work", to: "/work", icon: Briefcase },
  { label: "Pricing", to: "/pricing", icon: Tag },
  { label: "Contact", to: "/contact", icon: Mail },
];

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-lg bg-[linear-gradient(135deg,var(--color-brand),var(--color-brand-2))] font-display text-sm font-bold text-background">
        E
      </span>
      <span className="font-display text-base font-semibold">Eweb</span>
    </Link>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Highlight the tab matching the current route (works on deep links/refresh).
  const activeIndex = routes.indexOf(location.pathname);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleNav = (index: number | null) => {
    if (index === null) return;
    const path = routes[index];
    if (path) navigate(path);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="mt-3">
        {/* Desktop / tablet */}
        <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-3 sm:grid">
          <div aria-hidden />
          <ExpandableTabs
            tabs={[
              { title: "Home", icon: Home },
              { title: "Services", icon: LayoutGrid },
              { title: "Work", icon: Briefcase },
              { type: "separator" },
              { title: "Pricing", icon: Tag },
              { title: "Contact", icon: Mail },
            ]}
            onChange={handleNav}
            selected={activeIndex >= 0 ? activeIndex : null}
            activeColor="text-foreground"
            className="justify-self-center border-white/10 bg-background/60 backdrop-blur-md"
          />
          <Button to="/contact" variant="cta" className="justify-self-end shrink-0">
            Get a quote
          </Button>
        </div>

        {/* Mobile */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-background/70 px-4 py-2.5 backdrop-blur-md">
            <BrandMark />
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.nav
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-background/90 p-2 backdrop-blur-md"
              >
                {mobileLinks.map((l) => {
                  const active = location.pathname === l.to;
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-white/10 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <l.icon className="size-[18px]" strokeWidth={1.75} />
                      {l.label}
                    </Link>
                  );
                })}
                <Button to="/contact" variant="cta" className="mt-2 w-full">
                  Get a quote
                </Button>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  );
}
