import { useState } from "react";
import { Spinner, type SpinnerProps } from "@/components/ui/spinner";

const VARIANTS: NonNullable<SpinnerProps["variant"]>[] = [
  "default",
  "circle",
  "pinwheel",
  "circle-filled",
  "ellipsis",
  "ring",
  "bars",
  "infinite",
];

function randomVariant() {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

/**
 * Full-screen loader shown while a page/subpage is loading.
 * Picks a random spinner variant each time it mounts.
 */
export function PageLoader() {
  // Chosen once per mount (each route suspension remounts this).
  const [variant] = useState(randomVariant);

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Spinner
        variant={variant}
        size={48}
        className="text-foreground"
        aria-label="Loading"
      />
    </div>
  );
}
