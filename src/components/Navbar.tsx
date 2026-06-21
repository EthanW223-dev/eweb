import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Toolkit", hasChevron: true },
  { label: "Plans", hasChevron: false },
  { label: "News", hasChevron: false },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 text-gray-900">
        <Logo className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="text-[15px] font-medium tracking-tight">Eweb</span>
      </a>

      {/* Desktop nav links */}
      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex items-center gap-1 text-[13px] text-gray-700 transition-colors hover:text-gray-900"
          >
            {link.label}
            {link.hasChevron && <ChevronDown className="h-3.5 w-3.5" />}
          </a>
        ))}
      </div>

      {/* CTA + hamburger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800 sm:px-5"
        >
          Get started
        </button>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-gray-900/10 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="animate-fade-up absolute left-4 right-4 top-full rounded-2xl bg-white/80 px-5 py-3 ring-1 ring-gray-200 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center justify-between border-b border-gray-200 py-3 text-[15px] text-gray-700 transition-colors last:border-b-0 hover:text-gray-900"
            >
              {link.label}
              {link.hasChevron && <ChevronDown className="h-4 w-4" />}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
