import { useNavigate, useLocation } from "react-router-dom";
import { Mic } from "lucide-react";

/**
 * Floating "Talk to the AI" button — keeps the flagship product one tap away
 * from every page. Scrolls to the live demo (or routes home first).
 */
export function AIFab() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToDemo = () => {
    const scroll = () => {
      const el = document.getElementById("ai-calls");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname === "/" || location.pathname === "/services") {
      scroll();
    } else {
      navigate("/");
      // wait for the home page + route transition to mount the demo
      setTimeout(scroll, 900);
    }
  };

  return (
    <button
      onClick={goToDemo}
      aria-label="Talk to the AI receptionist"
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-black shadow-xl shadow-black/40 transition-all hover:-translate-y-0.5 hover:shadow-white/20 sm:bottom-6 sm:right-6"
    >
      <span className="relative grid size-5 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/40" />
        <Mic className="relative size-4" />
      </span>
      <span className="hidden sm:inline">Talk to the AI</span>
    </button>
  );
}
