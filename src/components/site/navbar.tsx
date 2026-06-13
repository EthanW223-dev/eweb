import { useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Briefcase, Tag, Mail } from "lucide-react";
import { Container, Button } from "./primitives";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

// Parallel to the tabs array below; null = separator (no target).
const routes: (string | null)[] = [
  "/",
  "/services",
  "/work",
  null,
  "/pricing",
  "/contact",
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight the tab matching the current route (works on deep links/refresh).
  const activeIndex = routes.indexOf(location.pathname);

  const handleNav = (index: number | null) => {
    if (index === null) return;
    const path = routes[index];
    if (path) navigate(path);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div aria-hidden />

        {/* Expandable tab navigation */}
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
          className="justify-self-center border-white/10 bg-background/60 backdrop-blur-xl"
        />

        {/* CTA */}
        <Button
          to="/contact"
          variant="cta"
          className="hidden justify-self-end shrink-0 sm:inline-flex"
        >
          Get a quote
        </Button>
      </Container>
    </header>
  );
}
