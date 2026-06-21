import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6", className)}
      {...props}
    />
  );
}

type ButtonProps = ComponentProps<"a"> & {
  variant?: "primary" | "cta" | "outline" | "ghost";
  size?: "md" | "lg";
  /** When set, renders an in-app router link instead of an anchor. */
  to?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  to,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-2 cursor-pointer",
    size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm",
    variant === "primary" &&
      "bg-foreground text-background hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10",
    variant === "cta" &&
      "bg-white text-black shadow-lg shadow-white/10 hover:-translate-y-0.5 hover:shadow-white/25",
    variant === "outline" &&
      "border border-white/15 bg-white/5 text-foreground hover:border-white/30 hover:bg-white/10",
    variant === "ghost" && "text-muted-foreground hover:text-foreground",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full bg-brand-2 shadow-[0_0_8px_var(--color-brand-2)]" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-2xl text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-xl text-pretty text-muted-foreground sm:text-lg",
            align === "center" ? "mx-auto" : "",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
